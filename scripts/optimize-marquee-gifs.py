"""Resize marquee GIFs and convert to animated WebP for faster page loads."""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "public" / "images" / "marquee"
OUT_DIR = SRC_DIR
PROFILE = ROOT / "src" / "data" / "profile.ts"

DISPLAY_W, DISPLAY_H = 420, 270
QUALITY = 72
# Keep motion smooth while cutting payload; skip more frames on long clips.
MAX_FRAMES = 40


def load_gif(path: Path) -> tuple[list[Image.Image], list[int]]:
    im = Image.open(path)
    frames: list[Image.Image] = []
    durations: list[int] = []
    try:
        while True:
            frames.append(im.copy())
            durations.append(max(int(im.info.get("duration", 40)), 20))
            im.seek(im.tell() + 1)
    except EOFError:
        pass
    return frames, durations


def sample_frames(
    frames: list[Image.Image], durations: list[int]
) -> tuple[list[Image.Image], list[int]]:
    if len(frames) <= MAX_FRAMES:
        step = 1
    else:
        step = max(1, len(frames) // MAX_FRAMES)
    picked_frames = frames[::step]
    picked_durations = [d * step for d in durations[::step]]
    return picked_frames, picked_durations


def resize_frame(frame: Image.Image) -> Image.Image:
    rgba = frame.convert("RGBA")
    return rgba.resize((DISPLAY_W, DISPLAY_H), Image.Resampling.LANCZOS)


def convert_one(gif_path: Path) -> Path:
    frames, durations = load_gif(gif_path)
    frames, durations = sample_frames(frames, durations)
    resized = [resize_frame(f) for f in frames]

    out_path = OUT_DIR / f"{gif_path.stem}.webp"
    resized[0].save(
        out_path,
        save_all=True,
        append_images=resized[1:],
        duration=durations,
        loop=0,
        quality=QUALITY,
        method=6,
    )
    return out_path


def update_profile(names: list[str]) -> None:
    text = PROFILE.read_text(encoding="utf-8")
    block = "const MARQUEE_MEDIA_NAMES = [\n" + "\n".join(
        f"  '{name}'," for name in names
    ) + "\n] as const"
    text = re.sub(
        r"const MARQUEE_(?:GIF|MEDIA)_NAMES = \[[\s\S]*?\] as const",
        block,
        text,
        count=1,
    )
    PROFILE.write_text(text, encoding="utf-8")


def main() -> None:
    gifs = sorted(SRC_DIR.glob("*.gif"))
    if not gifs:
        raise SystemExit(f"No GIFs found in {SRC_DIR}")

    webp_names: list[str] = []
    total_before = 0
    total_after = 0

    for gif in gifs:
        before = gif.stat().st_size
        out = convert_one(gif)
        after = out.stat().st_size
        total_before += before
        total_after += after
        webp_names.append(out.name)
        ratio = (1 - after / before) * 100 if before else 0
        print(f"{gif.name}: {before // 1024}KB -> {after // 1024}KB ({ratio:.0f}% smaller)")

    update_profile(webp_names)

    print(
        f"\nTotal: {total_before // (1024 * 1024)}MB -> {total_after // (1024 * 1024)}MB "
        f"({(1 - total_after / total_before) * 100:.0f}% smaller)"
    )
    print(f"Updated {PROFILE.name} with {len(webp_names)} WebP files.")


if __name__ == "__main__":
    main()

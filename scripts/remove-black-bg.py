"""Convert solid black background to transparency for portrait PNG."""
from collections import deque
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parent.parent / "public" / "images" / "portrait-bong.png"
OUT = SRC
THRESHOLD = 28


def is_blackish(r: int, g: int, b: int) -> bool:
    return r <= THRESHOLD and g <= THRESHOLD and b <= THRESHOLD


def remove_black_background(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()
    visited = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[y][x]:
            r, g, b, _ = pixels[x, y]
            if is_blackish(r, g, b):
                visited[y][x] = True
                queue.append((x, y))

    for x in range(w):
        enqueue(x, 0)
        enqueue(x, h - 1)
    for y in range(h):
        enqueue(0, y)
        enqueue(w - 1, y)

    while queue:
        x, y = queue.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        enqueue(x + 1, y)
        enqueue(x - 1, y)
        enqueue(x, y + 1)
        enqueue(x, y - 1)

    return rgba


def main() -> None:
    img = Image.open(SRC)
    result = remove_black_background(img)
    result.save(OUT, "PNG")
    w, h = result.size
    px = result.load()
    trans = sum(1 for y in range(h) for x in range(w) if px[x, y][3] == 0)
    print(f"Saved: {OUT} ({w}x{h}), transparent pixels: {trans}/{w * h}")


if __name__ == "__main__":
    main()

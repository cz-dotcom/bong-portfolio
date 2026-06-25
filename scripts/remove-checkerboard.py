"""Remove baked-in checkerboard fake-transparency from portrait PNG."""
from collections import deque
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parent.parent / "public" / "images" / "portrait-bong-source.png"
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "portrait-bong.png"


def color_dist(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5


def is_neutral_gray(r: int, g: int, b: int) -> bool:
    return max(abs(r - g), abs(g - b), abs(r - b)) <= 22


def sample_checker_colors(pixels, w: int, h: int) -> list[tuple[int, int, int]]:
    points = [
        (0, 0),
        (1, 0),
        (0, 1),
        (1, 1),
        (w - 1, 0),
        (w - 2, 0),
        (0, h - 1),
        (1, h - 1),
        (w - 1, h - 1),
        (w - 2, h - 1),
    ]
    colors: list[tuple[int, int, int]] = []
    for x, y in points:
        r, g, b, _ = pixels[x, y]
        if is_neutral_gray(r, g, b):
            colors.append((r, g, b))
    return colors


def is_background(r: int, g: int, b: int, bg_colors: list[tuple[int, int, int]]) -> bool:
    if not is_neutral_gray(r, g, b):
        return False
    avg = (r + g + b) / 3
    for br, bg, bb in bg_colors:
        if color_dist((r, g, b), (br, bg, bb)) <= 38:
            return True
        if abs(avg - (br + bg + bb) / 3) <= 30:
            return True
    return False


def flood_transparent(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()
    bg_colors = sample_checker_colors(pixels, w, h)

    if not bg_colors:
        return rgba

    visited = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[y][x]:
            r, g, b, _ = pixels[x, y]
            if is_background(r, g, b, bg_colors):
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

    # 二次清理：从透明区域向外侵蚀残留灰格
    changed = True
    while changed:
        changed = False
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                if a == 0 or not is_neutral_gray(r, g, b):
                    continue
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny][3] == 0:
                        pixels[x, y] = (r, g, b, 0)
                        changed = True
                        break

    return rgba


def main() -> None:
    img = Image.open(SRC)
    result = flood_transparent(img)
    result.save(OUT, "PNG")
    print(f"Saved transparent portrait: {OUT} ({result.size[0]}x{result.size[1]})")


if __name__ == "__main__":
    main()

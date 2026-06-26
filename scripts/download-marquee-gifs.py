"""Download marquee GIFs for local hosting on GitHub Pages."""
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "marquee"
OUT.mkdir(parents=True, exist_ok=True)

profile = (ROOT / "src" / "data" / "profile.ts").read_text(encoding="utf-8")
urls = re.findall(r"https://motionsites\.ai/assets/[^'\"]+\.gif", profile)

names: list[str] = []
for url in urls:
    name = url.rsplit("/", 1)[-1]
    dest = OUT / name
    print(f"Downloading {name}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp, open(dest, "wb") as f:
        f.write(resp.read())
    names.append(name)

print(f"\nDone: {len(names)} files -> {OUT}")
print("Run: python scripts/optimize-marquee-gifs.py")

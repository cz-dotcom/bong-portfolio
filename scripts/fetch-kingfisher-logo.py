import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "images" / "logos"

html = urllib.request.urlopen(
    urllib.request.Request(
        "https://www.kingfishers.cn/",
        headers={"User-Agent": "Mozilla/5.0"},
    ),
    timeout=30,
).read().decode("utf-8", "ignore")

imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
print("Images found:")
for img in imgs[:20]:
    print(img)

for pattern in ["logo", "Logo", "favicon", "icon", "brand"]:
    for img in imgs:
        if pattern.lower() in img.lower():
            print("MATCH:", img)

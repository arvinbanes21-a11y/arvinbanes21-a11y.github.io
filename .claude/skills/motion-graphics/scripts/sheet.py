"""Tile screenshots from shoot.js into one contact sheet.
Usage: python3 sheet.py shotsDir out.png [columns=5] [cellWidth=270]"""
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5
cw = int(sys.argv[4]) if len(sys.argv) > 4 else 270
files = sorted(glob.glob(os.path.join(d, "t*.png")))
if not files: sys.exit("no t*.png files in " + d)
w, h = Image.open(files[0]).size
ch = round(cw * h / w); rows = -(-len(files) // cols)
sheet = Image.new("RGB", (cols * cw, rows * (ch + 22)), "#808080")
draw = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    x, y = (i % cols) * cw, (i // cols) * (ch + 22)
    sheet.paste(Image.open(f).convert("RGB").resize((cw, ch)), (x, y))
    draw.text((x + 6, y + ch + 4), f"{int(os.path.basename(f)[1:-4]) / 1000:.2f}s", fill="white")
sheet.save(out); print(out, sheet.size)

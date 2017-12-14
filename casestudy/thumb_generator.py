from PIL import Image
import glob, os

"""
Create thumbnail images in the current working directory.
Needs PILLOW to be installed!
(Works on Python3.X)
"""

size = 300, 300

for infile in glob.glob("*.jpg", recursive=False):
    file, ext = os.path.splitext(infile)
    im = Image.open(infile)
    im.thumbnail(size)
    im.save(file + ".thumb.jpg", "JPEG")

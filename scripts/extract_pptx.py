import zipfile
import xml.etree.ElementTree as ET
import re

z = zipfile.ZipFile('AduanePa-Fie Project.pptx')
slide_files = sorted([f for f in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml', f)], key=lambda x: int(re.search(r'\d+', x).group()))

print(f"Total slides found: {len(slide_files)}")

for i, sf in enumerate(slide_files, start=1):
    content = z.read(sf).decode('utf-8')
    root = ET.fromstring(content)
    # Extract all text elements
    texts = []
    for elem in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t'):
        if elem.text:
            texts.append(elem.text)
    print(f"\n==========================================")
    print(f"SLIDE {i} ({sf})")
    print(f"==========================================")
    print(" ".join(texts))

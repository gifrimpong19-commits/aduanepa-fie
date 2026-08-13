import zipfile
import re
import os
import shutil
import xml.etree.ElementTree as ET

src_pptx = r'C:\Users\Redeemer\Desktop\4 Gift\AduanePa-Fie Project (2).pptx'
backup_pptx = r'C:\Users\Redeemer\Desktop\4 Gift\AduanePa-Fie Project (2)_backup.pptx'

# Restore from pristine backup
shutil.copy2(backup_pptx, src_pptx)
print("Restored from backup.")

with zipfile.ZipFile(src_pptx, 'r') as zin:
    file_dict = {name: zin.read(name) for name in zin.namelist()}

# 1. Remove Gamma Watermark from slideLayout2.xml
if 'ppt/slideLayouts/slideLayout2.xml' in file_dict:
    xml_str = file_dict['ppt/slideLayouts/slideLayout2.xml'].decode('utf-8')
    # Remove the entire <p:pic> block with Image 0 / Gamma link
    xml_cleaned = re.sub(r'<p:pic>.*?<a:hlinkClick r:id="rId2".*?</p:pic>', '', xml_str, flags=re.DOTALL)
    if xml_cleaned != xml_str:
        print("Successfully removed Gamma watermark picture from slideLayout2.xml!")
        file_dict['ppt/slideLayouts/slideLayout2.xml'] = xml_cleaned.encode('utf-8')

# Remove relationship from slideLayout2.xml.rels
if 'ppt/slideLayouts/_rels/slideLayout2.xml.rels' in file_dict:
    rels_str = file_dict['ppt/slideLayouts/_rels/slideLayout2.xml.rels'].decode('utf-8')
    rels_cleaned = re.sub(r'<Relationship Id="rId2"[^>]*gamma\.app[^>]*/>', '', rels_str)
    if rels_cleaned != rels_str:
        print("Successfully removed Gamma hyperlink relationship from slideLayout2.xml.rels!")
        file_dict['ppt/slideLayouts/_rels/slideLayout2.xml.rels'] = rels_cleaned.encode('utf-8')

# 2. Scale font sizes across slides cleanly
def scale_font_size(match):
    val = int(match.group(1))
    if val <= 850:       # 8pt -> 11pt
        new_val = int(val * 1.38)
    elif val <= 1050:    # 9-10pt -> 12.5-13.5pt
        new_val = int(val * 1.30)
    elif val <= 1200:    # 11-12pt -> 14-15pt
        new_val = int(val * 1.25)
    elif val <= 1450:    # 13.5-14pt -> 16.5-17pt
        new_val = int(val * 1.20)
    elif val <= 2000:    # 17.5-18.5pt -> 22-24pt
        new_val = int(val * 1.20)
    elif val <= 2500:    # 23.5-25pt -> 27-29pt
        new_val = int(val * 1.15)
    else:               # 27.5pt -> 32pt
        new_val = int(val * 1.15)
    return f'sz="{new_val}"'

for fname, content in list(file_dict.items()):
    if fname.startswith('ppt/slides/slide') and fname.endswith('.xml'):
        slide_str = content.decode('utf-8')
        
        # Scale up font sizes
        slide_str = re.sub(r'sz="(\d+)"', scale_font_size, slide_str)
        
        file_dict[fname] = slide_str.encode('utf-8')
        print(f"Updated font sizes in {fname}")

# 3. Write back the updated PPTX
with zipfile.ZipFile(src_pptx, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
    for name, data in file_dict.items():
        zout.writestr(name, data)

print("\nSuccessfully updated AduanePa-Fie Project (2).pptx!")

# Verify every slide parses as valid XML
with zipfile.ZipFile(src_pptx, 'r') as zver:
    for i in range(1, 10):
        sf = f'ppt/slides/slide{i}.xml'
        root = ET.fromstring(zver.read(sf))
        print(f"Slide {i} XML verification: OK (root tag: {root.tag.split('}')[-1]})")

"""Validate resource paths against the target client and create the install ZIP."""
from pathlib import Path
import json
import struct
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / 'dist/Floofy-26.1'
TARGET = ROOT / 'dist/Floofy-26.1.zip'
coverage = json.loads((ROOT / 'source/coverage.json').read_text())
metadata = json.loads((PACK / 'pack.mcmeta').read_text())['pack']
assert metadata['min_format'] == [84, 0] == metadata['max_format']
stems = coverage['textureStems']
assert len(stems) == len(set(stems)) == 54
folder = PACK / 'assets/minecraft/optifine/random/entity/wolf'
assert not (PACK / 'assets/minecraft/textures').exists(), 'No global wolf overrides allowed'
client = ROOT / '.cache/client.jar'
if client.exists():
    with zipfile.ZipFile(client) as jar:
        vanilla = {Path(n).stem for n in jar.namelist()
                   if n.startswith('assets/minecraft/textures/entity/wolf/')
                   and n.endswith('.png') and 'collar' not in n and 'armor' not in n}
    assert set(stems) == vanilla, f'Wolf coverage mismatch: {set(stems) ^ vanilla}'
for stem in stems:
    texture = folder / (stem + '2.png')
    header = texture.read_bytes()[:24]
    assert header[:8] == b'\x89PNG\r\n\x1a\n'
    dimensions = struct.unpack('>II', header[16:24])
    assert dimensions == ((128, 128) if stem.endswith('_baby') else (256, 128))
    rules = dict(line.split('=', 1) for line in (folder / (stem + '.properties')).read_text().splitlines()
                 if line and not line.startswith('#'))
    assert rules == {'skins.1': '2', 'name.1': 'ipattern:Floofy', 'skins.2': '1'}
assert len(list(folder.glob('*.properties'))) == len(stems)
assert len(list(folder.glob('*.png'))) == len(stems)

with zipfile.ZipFile(TARGET, 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(PACK.rglob('*')):
        if file.is_file():
            archive.write(file, file.relative_to(PACK).as_posix())
with zipfile.ZipFile(TARGET) as archive:
    assert archive.testzip() is None
    assert 'pack.mcmeta' in archive.namelist()
    assert 'pack.png' in archive.namelist()
    assert len(archive.namelist()) == 111
print(f'Validated 54 texture/rule pairs and ZIP integrity: {TARGET} ({TARGET.stat().st_size:,} bytes)')

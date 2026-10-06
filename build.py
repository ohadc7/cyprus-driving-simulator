"""Rebuild the standalone game using Python's standard library."""
from pathlib import Path
from html import escape
root = Path(__file__).resolve().parent
fragment = (root / 'src/game.html').read_text(encoding='utf-8')
template = (root / 'src/standalone-template.html').read_text(encoding='utf-8')
assert template.count('__GAME_FRAGMENT__') == 1
(root / 'index.html').write_text(template.replace('__GAME_FRAGMENT__', escape(fragment)), encoding='utf-8')
print('Built index.html')

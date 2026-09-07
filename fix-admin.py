import re

with open(expanduser('~/studyai/src/App.tsx'), 'r') as f:
    content = f.read()

# Replace the broken ternary check
old_code = "{bannedList.length === 0 ? <p className=\"text-xs text-slate-500\">No banned users currently.</p> : bannedList.link ? null : bannedList.map((b) => ("
new_code = "{bannedList.length === 0 ? <p className=\"text-xs text-slate-500\">No banned users currently.</p> : bannedList.map((b) => ("

content = content.replace(old_code, new_code)

with open(expanduser('~/studyai/src/App.tsx'), 'w') as f:
    f.write(content)

import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

emoji_tab = open('emoji_tab.html', 'r', encoding='utf-8').read()

# Replace the Word Count Tab comment with emoji tab + word count tab
content = content.replace('                        <!-- Word Count Tab -->', emoji_tab + '\n\n                        <!-- Word Count Tab -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done adding emoji tab!')

import urllib.request
import re
import sys

url = sys.argv[1]
try:
    html = urllib.request.urlopen(url).read().decode('utf-8')
    match = re.search(r'"(https://live\.staticflickr\.com/[^"]+_b\.jpg)"', html)
    print(match.group(1) if match else 'Not found')
except Exception as e:
    print(e)

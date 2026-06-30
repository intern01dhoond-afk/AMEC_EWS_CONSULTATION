import re
import json

with open("c:/Users/balar/amec-landing-page/stitch_screen.html", "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for WIZ_global_data
match = re.search(r'window\.WIZ_global_data\s*=\s*(\{.*?\});</script>', content, re.DOTALL)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)
    
    # Save formatted JSON of WIZ_global_data to a file
    with open("wiz_data.json", "w", encoding="utf-8") as out:
        json.dump(data, out, indent=2)
    print("Saved wiz_data.json successfully")
else:
    print("WIZ_global_data not found")

import json

file_path = 'src/Pages/teams/teams.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

suresh_data = None

# Remove Suresh from Security
for team in data['teams']:
    if team['title'] == "Head, SECURITY":
        for i, member in enumerate(team['members']):
            if member['name'] == "Suresh":
                suresh_data = team['members'].pop(i)
                break

# Add Suresh to Hospitality
if suresh_data:
    for team in data['teams']:
        if team['title'] == "Head, HOSPITALITY":
            team['members'].append(suresh_data)
            break

# Replace Yajat with Khush in PR
khush_data = {
    "name": "Khush Maheshwari",
    "photo": "https://live.staticflickr.com/65535/55465572983_c985c897cd_b.jpg",
    "linkedin": "https://www.linkedin.com/in/khush-maheshwari-031187274/",
    "phone": "8949036446",
    "email": "khushmahes23@itk.ac.in",
    "instagram": "https://www.instagram.com/_maheshwari_khush_/"
}

for team in data['teams']:
    if team['title'] == "Head, PUBLIC RELATIONS":
        for i, member in enumerate(team['members']):
            if member['name'] == "Yajat":
                team['members'][i] = khush_data
                break

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("Teams updated successfully.")

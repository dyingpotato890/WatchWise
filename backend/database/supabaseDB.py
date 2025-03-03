import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Initialize Supabase Client
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

email = "etihadbank.noreply@gmail.com"
password = 'etihadbankpassword'

response = supabase.auth.sign_up({"email": email, "password": password})
uuuid = response.user.id

data = {
    "UID_REF": str(uuuid),
    "user_id": 2473170
}
response = supabase.table("profiles").insert(data).execute()

print(response)

print(f"User {email} signed up successfully with UID: {uuuid}")
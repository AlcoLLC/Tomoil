import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import time
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_KEY_FILE = os.path.join(BASE_DIR, 'tomoil-a425551e65cb.json')

API_SCOPE = 'https://www.googleapis.com/auth/indexing'
ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish'

SITE_DOMAIN = "https://tomoil.de"
LANGUAGE_PREFIX = ""

STATIC_PATHS = [
    "/",  
    "/brand/",   
    "/case-studies/", 
    "/contact/", 
    "/news/", 
    "/pds-sds/", 
    "/all-data-sheets/",
    "/products/",  
    "/faq/", 
    "/search/",   
    "/services/",  
    "/glance/",   
    "/vision-mission/",
    "/our-commitment/",  
]
def get_credentials():
    try:
        creds = service_account.Credentials.from_service_account_file(
            JSON_KEY_FILE, scopes=[API_SCOPE])
        if not creds.valid:
            print("Kimlik bilgileri geçersiz, yenileniyor...")
            creds.refresh(Request())
        print("Kimlik bilgileri başarıyla alındı.")
        return creds
    except FileNotFoundError:
        print(f"HATA: JSON anahtar dosyası bulunamadı: {JSON_KEY_FILE}")
        return None
    except Exception as e:
        print(f"HATA: Kimlik bilgileri alınırken beklenmedik bir hata oluştu: {e}")
        return None

def submit_url_to_google(url_to_submit, credentials, url_type="URL_UPDATED"):
    session = requests.Session()
    
    if credentials.expired:
        print(f"Token süresi dolmuş, {url_to_submit} için yenileniyor...")
        credentials.refresh(Request())
        
    session.auth = (f"Bearer {credentials.token}")
    
    payload = {
        "url": url_to_submit,
        "type": url_type
    }

    try:
        response = session.post(ENDPOINT, json=payload)
        response.raise_for_status() 
        print(f"  BAŞARILI ({url_type}): {url_to_submit}")
        return True
    except requests.exceptions.HTTPError as e:
        error_json = e.response.json()
        error_message = error_json.get("error", {}).get("message", e.response.text)
        print(f"  HATA ({e.response.status_code}) {url_to_submit}: {error_message}")
        return False
    except Exception as e:
        print(f"  BEKLENMEDİK HATA {url_to_submit}: {e}")
        return False

if __name__ == "__main__":
    print("Google Indexing script'i başlatılıyor...")
    creds = get_credentials()
    
    if creds:
        full_urls = [f"{SITE_DOMAIN}{LANGUAGE_PREFIX}{path}" for path in STATIC_PATHS]
        
        print(f"\nToplam {len(full_urls)} adet statik URL gönderilecek...")
        
        for i, url in enumerate(full_urls):
            print(f"[{i+1}/{len(full_urls)}] Gönderiliyor...")
            submit_url_to_google(url, creds, "URL_UPDATED")
            time.sleep(0.2) 
            
        print("\nStatik URL gönderme işlemi tamamlandı.")
    else:
        print("Kimlik bilgileri alınamadı. İşlem iptal edildi.")
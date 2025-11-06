import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request, AuthorizedSession
import time
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_KEY_FILE = os.path.join(os.path.dirname(BASE_DIR), 'tomoil-a425551e65cb.json')

API_SCOPE = 'https://www.googleapis.com/auth/indexing'
ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish'

SITE_DOMAIN = "https://tomoil.de"

STATIC_PATHS = [
    "/", "/brand/", "/case-studies/", "/contact/", "/news/",
    "/pds-sds/", "/all-data-sheets/", "/products/", "/faq/",
    "/search/", "/services/", "/glance/", "/vision-mission/",
    "/our-commitment/",
]

error_urls = {
    'pds_sds/': 'pds-sds/',
    'our_commitment/': 'our-commitment/',
    'vision_mission/': 'vision-mission/',
    'fr/news/0/': 'fr/news/',
    'services/marketing/': 'services/',
    'products/motor-oil-for-truck-and-buses/': '',
    'de/news/0/': 'de/news/',
    'zh-hans/news/0/': 'zh-hans/news/',
    'es/news/0/': 'es/news/',
    'services/industry/': 'services/',
    'news/0/': 'news/',
    'products/adblue/': 'products/',
    'products/gear-oils-and-transmission-fluids/': 'products/',
    'products/antifreeze-and-coolants/': 'products/',
    'products/break-fluid/': 'products/',
    'services/fleet/': 'services/',
    'company/vision-mission/': 'vision-mission/',
    'products/industrial-oils/': '?product_range=industrial-gear-oil',
    'company/culture/': '',
    'cdn-cgi/l/email-protection/': '',
    'static/tomoil-motoroil.pdf/': '',
}

def get_credentials():
    try:
        creds = service_account.Credentials.from_service_account_file(
            JSON_KEY_FILE, scopes=[API_SCOPE]
        )
        if not creds.valid:
            creds.refresh(Request())
        print("✅ Kimlik bilgileri alındı.")
        return creds
    except FileNotFoundError:
        print(f"❌ JSON anahtar dosyası bulunamadı: {JSON_KEY_FILE}")
    except Exception as e:
        print(f"❌ Kimlik bilgileri alınırken hata: {e}")
    return None


def submit_url_to_google(url_to_submit, credentials, url_type="URL_UPDATED"):
    session = AuthorizedSession(credentials)
    payload = {"url": url_to_submit, "type": url_type}

    try:
        response = session.post(ENDPOINT, json=payload)
        response.raise_for_status()
        print(f"  ✅ {url_type}: {url_to_submit}")
        return True
    except requests.exceptions.HTTPError as e:
        try:
            err_json = e.response.json()
            err_msg = err_json.get("error", {}).get("message", str(e))
        except Exception:
            err_msg = str(e)
        print(f"  ❌ {url_type} ({e.response.status_code}): {url_to_submit} -> {err_msg}")
        return False
    except Exception as e:
        print(f"  ⚠️ Beklenmedik hata {url_to_submit}: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Google Indexing script'i başlatılıyor...\n")
    creds = get_credentials()

    if not creds:
        print("❌ Kimlik bilgileri alınamadı, işlem iptal edildi.")
        exit(1)

    print("\n=== 1️⃣ Eski (yönlendirilmiş) URL'ler KALDIRILIYOR ===\n")
    for old_slug, new_slug in error_urls.items():
        old_url = f"{SITE_DOMAIN}/{old_slug}"
        submit_url_to_google(old_url, creds, "URL_REMOVED")
        time.sleep(0.3)

    print("\n=== 2️⃣ Yeni (aktif) URL'ler GÜNCELLENİYOR ===\n")
    all_new_paths = set(STATIC_PATHS + [f"/{v}" for v in error_urls.values() if v])

    for i, path in enumerate(all_new_paths, 1):
        full_url = f"{SITE_DOMAIN}{path}"
        print(f"[{i}/{len(all_new_paths)}] Gönderiliyor...")
        submit_url_to_google(full_url, creds, "URL_UPDATED")
        time.sleep(0.3)

    print("\n✅ Tüm URL gönderme işlemi tamamlandı!")

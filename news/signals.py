from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.urls import reverse
from django.conf import settings
from django.utils.translation import get_language, activate
from .models import News
from core.google_indexing import submit_url_to_google 
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=News)
def submit_news_to_google(sender, instance, created, **kwargs):
    language_codes = [lang[0] for lang in settings.LANGUAGES]
    original_lang = get_language() 

    for lang_code in language_codes:
        try:
            activate(lang_code)
            path = reverse('news:news_detail', kwargs={'slug': instance.slug})
            full_url = f"{settings.SITE_DOMAIN}{path}"
            submit_url_to_google(full_url, "URL_UPDATED")
        except Exception as e:
            logger.error(f"[Signal Hatası] {instance} için URL oluşturulamadı (Dil: {lang_code}): {e}")
        finally:
            activate(original_lang) 

@receiver(post_delete, sender=News)            
def delete_news_from_google(sender, instance, **kwargs):
    language_codes = [lang[0] for lang in settings.LANGUAGES]
    original_lang = get_language()

    for lang_code in language_codes:
        try:
            activate(lang_code)
            path = reverse('news:news_detail', kwargs={'slug': instance.slug})
            full_url = f"{settings.SITE_DOMAIN}{path}"
            submit_url_to_google(full_url, "URL_DELETED")
        except Exception as e:
             logger.error(f"[Signal Hatası] Silinen {instance} için URL oluşturulamadı (Dil: {lang_code}): {e}")
        finally:
            activate(original_lang)
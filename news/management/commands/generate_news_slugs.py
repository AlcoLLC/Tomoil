# news/management/commands/generate_news_slugs.py

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.db.models import Q
from news.models import News

class Command(BaseCommand):
    help = 'Generates unique slugs for all News items that do not have one.'

    def handle(self, *args, **kwargs):
        # Get all news items where the slug is null or an empty string
        news_to_update = News.objects.filter(Q(slug__isnull=True) | Q(slug=''))
        
        if not news_to_update.exists():
            self.stdout.write(self.style.SUCCESS('All news items already have slugs. Nothing to do.'))
            return

        self.stdout.write(f'Found {news_to_update.count()} news items without slugs. Generating now...')

        updated_count = 0
        for news_item in news_to_update:
            if not news_item.title:
                self.stdout.write(self.style.WARNING(f'Skipping News item with pk={news_item.pk} because it has no title.'))
                continue

            # --- This logic is the same as in your model's save method ---
            base_slug = slugify(news_item.title)
            slug = base_slug
            counter = 1
            
            # Check for uniqueness
            while News.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            # -----------------------------------------------------------
            
            news_item.slug = slug
            news_item.save(update_fields=['slug'])
            updated_count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully generated slug "{slug}" for news "{news_item.title}"'))

        self.stdout.write(self.style.SUCCESS(f'\nProcess finished. Successfully updated {updated_count} news items.'))
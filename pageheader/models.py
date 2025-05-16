from django.db import models


class PageHeader(models.Model):
    """Model for storing page header information that can be managed from admin."""

    page_key = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique identifier for this page (e.g., 'news_list', 'case_studies')"
    )
    breadcrumb_title = models.CharField(
        max_length=100,
        help_text="Title for the breadcrumb link"
    )
    breadcrumb_url = models.CharField(
        max_length=200,
        help_text="URL for the breadcrumb link"
    )
    page_title = models.CharField(
        max_length=200,
        help_text="Main title displayed in the header"
    )
    page_description = models.TextField(
        help_text="Description text displayed below the title",
        blank=True,
        null=True
    )
    background_image = models.ImageField(
        upload_to='page_headers/',
        null=True,
        blank=True,
        help_text="Background image for the header"
    )

    def __str__(self):
        return f"{self.page_key}: {self.page_title}"

    class Meta:
        verbose_name = "Page Header"
        verbose_name_plural = "Page Headers"

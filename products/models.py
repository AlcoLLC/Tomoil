from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

class ProductRange(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='product_ranges/', blank=True, null=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, verbose_name="Order")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    is_home = models.BooleanField(default=False, verbose_name="Show on Home Page")
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Product Range"
        verbose_name_plural = "Product Ranges"

class ApplicationArea(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.FileField(upload_to='application_icons/')
    is_active = models.BooleanField(default=True)
    is_home = models.BooleanField(default=False, verbose_name="Show on Home Page")
    order = models.PositiveIntegerField(default=0, verbose_name="Order")
    
    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = slugify(self.name)
        elif not self.slug:
            self.slug = f"application-area-{self.id}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name if self.name else f"Application Area {self.id}"
    
    class Meta:
        verbose_name = "Application Area"
        verbose_name_plural = "Application Areas"

class Specification(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Specification"
        verbose_name_plural = "Specifications"

class Viscosity(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=275, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Viscosity"
        verbose_name_plural = "Viscosities"

class Composition(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=275, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, verbose_name="Order")
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Composition"
        verbose_name_plural = "Compositions"

class PackSize(models.Model):
    size = models.DecimalField(max_digits=10, decimal_places=2)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, verbose_name="Order")
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"pack-size-{self.size}")
        super().save(*args, **kwargs)
    
    def __str__(self):
        return str(self.size)
    
    class Meta:
        verbose_name = "Pack Size"
        verbose_name_plural = "Pack Sizes"
        ordering = ['size']

class Product(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    product_id = models.CharField(max_length=50, unique=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    pds = models.URLField(max_length=500, blank=True, null=True, verbose_name="Product Data Sheet")
    sds = models.URLField(max_length=500, blank=True, null=True, verbose_name="Safety Data Sheet")
    features_benefits = models.TextField(blank=True, null=True)
    application = models.TextField(blank=True, null=True)
    recommendation = models.TextField(blank=True, null=True)
    
    product_range = models.ForeignKey(ProductRange, on_delete=models.CASCADE, related_name='products', blank=True, null=True)
    application_areas = models.ManyToManyField(ApplicationArea, blank=True, related_name='products')
    specifications = models.ManyToManyField(Specification, blank=True, related_name='products')
    viscosities = models.ManyToManyField(Viscosity, blank=True, related_name='products')
    compositions = models.ManyToManyField(Composition, blank=True, related_name='products')
    pack_sizes = models.ManyToManyField(PackSize, blank=True, related_name='products')
    order = models.PositiveIntegerField(default=0, verbose_name="Order")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_home = models.BooleanField(default=False, verbose_name="Show on Home Page")
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['-created_at']

class TypicalProperties(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='typical_properties')
    property = models.CharField(max_length=200)
    unit = models.CharField(max_length=50, blank=True, null=True)
    test_method = models.CharField(max_length=100, blank=True, null=True)
    typical_value = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.product.title} - {self.property}"
    
    class Meta:
        verbose_name = "Typical Property"
        verbose_name_plural = "Typical Properties"
        ordering = ['order', 'id']

class PackagingSizes(models.Model):    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='packaging_sizes')
    size = models.CharField(max_length=50)  
    packaging_type = models.CharField(max_length=255)
    units_per_box = models.PositiveIntegerField(blank=True, null=True)
    boxes_per_pallet = models.PositiveIntegerField(blank=True, null=True)
    units_per_pallet = models.PositiveIntegerField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.product.title} - {self.size}"
    
    class Meta:
        verbose_name = "Packaging Size"
        verbose_name_plural = "Packaging Sizes"
        ordering = ['order', 'id']

class Review(models.Model):    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    first_name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    email_address = models.EmailField()
    summary = models.CharField(max_length=200)
    review = models.TextField()
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.first_name} {self.surname} - {self.product.title}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.surname}"
    
    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
        ordering = ['-created_at']
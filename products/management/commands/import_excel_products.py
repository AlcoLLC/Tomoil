from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Product, ProductRange, ApplicationArea, Specification, Viscosity, Composition, PackSize
import pandas as pd
import os
import glob


class Command(BaseCommand):
    help = 'Import products from Excel files in a folder'

    def add_arguments(self, parser):
        parser.add_argument('folder_path', type=str, help='Path to the folder containing Excel files')
        parser.add_argument('--header-row', type=int, default=1, help='Row number to use as headers (0-indexed, default: 1)')
        parser.add_argument('--skip-data-rows', type=int, default=1, help='Number of data rows to skip after header (default: 1 to skip repeated header)')

    def handle(self, *args, **options):
        folder_path = options['folder_path']
        header_row = options['header_row']
        skip_data_rows = options['skip_data_rows']
        
        if not os.path.exists(folder_path):
            self.stdout.write(
                self.style.ERROR(f'Folder {folder_path} does not exist')
            )
            return

        # Excel dosyalarını bul
        excel_patterns = ['*.xlsx', '*.xls']
        excel_files = []
        for pattern in excel_patterns:
            excel_files.extend(glob.glob(os.path.join(folder_path, pattern)))
        
        if not excel_files:
            self.stdout.write(
                self.style.WARNING(f'No Excel files found in {folder_path}')
            )
            return

        self.stdout.write(f"Found {len(excel_files)} Excel files:")
        for file in excel_files:
            self.stdout.write(f"  - {os.path.basename(file)}")

        total_success = 0
        total_errors = 0
        
        for excel_file in excel_files:
            self.stdout.write(f"\nProcessing: {os.path.basename(excel_file)}")
            
            try:
                # Excel dosyasını oku - belirtilen satırı header olarak kullan
                df = pd.read_excel(excel_file, header=header_row)
                
                # Boş sütunları kaldır
                df = df.dropna(axis=1, how='all')
                
                # Eğer hala Unnamed sütunlar varsa, manuel mapping yap
                if any('Unnamed' in str(col) for col in df.columns):
                    df = self.fix_column_names(df, excel_file)
                
                # Sütun isimlerini temizle
                df.columns = [str(col).strip() for col in df.columns]
                
                # Sütun isimlerini göster
                self.stdout.write(f"Columns in {os.path.basename(excel_file)}: {list(df.columns)}")
                
                # İlk birkaç satırı atlayabilir (tekrar eden header satırları)
                if skip_data_rows > 0:
                    df = df.iloc[skip_data_rows:]
                
                # Boş satırları kaldır ve sadece gerçek veri satırlarını tut
                df = df.dropna(how='all')
                
                # product_id veya product_name boş olan satırları filtrele
                df = df.dropna(subset=['product_id', 'product_name'], how='any')
                df = df[df['product_id'].astype(str).str.strip() != '']
                df = df[df['product_name'].astype(str).str.strip() != '']
                
                if len(df) == 0:
                    self.stdout.write(
                        self.style.WARNING(f'No valid data rows found in {os.path.basename(excel_file)}')
                    )
                    continue
                
                self.stdout.write(f"Found {len(df)} valid data rows to import")
                
                success_count = 0
                error_count = 0
                
                for index, row in df.iterrows():
                    try:
                        with transaction.atomic():
                            # pandas Series'i dict'e çevir
                            row_dict = row.to_dict()
                            
                            # Debug: print row data for first few rows
                            if success_count < 3:
                                self.stdout.write(f"Processing row {index}: product_id='{row_dict.get('product_id', 'N/A')}', product_name='{row_dict.get('product_name', 'N/A')}'")
                            
                            self.import_product(row_dict, excel_file)
                            success_count += 1
                            self.stdout.write(f"Successfully imported row {index + header_row + 2}")
                            
                    except Exception as e:
                        error_count += 1
                        self.stdout.write(
                            self.style.ERROR(f'Error importing row {index + header_row + 2}: {str(e)}')
                        )
                
                total_success += success_count
                total_errors += error_count
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'File {os.path.basename(excel_file)} completed. Success: {success_count}, Errors: {error_count}'
                    )
                )
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error reading file {os.path.basename(excel_file)}: {str(e)}')
                )
                total_errors += 1
                
        self.stdout.write(
            self.style.SUCCESS(
                f'\nTotal Import completed. Success: {total_success}, Errors: {total_errors}'
            )
        )

    def fix_column_names(self, df, excel_file):
        """Fix column names based on the expected structure"""
        self.stdout.write(f"Fixing column names for {os.path.basename(excel_file)}")
        
        # Preview ilk birkaç satır
        preview_df = pd.read_excel(excel_file, nrows=3)
        self.stdout.write(f"Raw preview:\n{preview_df}")
        
        # Based on your data structure, map the columns
        expected_columns = [
            'product_id',  # A - Product ID
            'product_name',  # B - Product name
            'description',  # C - Description
            'features_benefits',  # D - Features & Benefits
            'application',  # E - Application
            'api',  # F - API
            'ilsac',  # G - ILSAC
            'acea',  # H - ACEA
            'jaso',  # I - JASO
            'oem_specification',  # J - OEM specifications
            'recommendation'  # K - Recommendation
        ]
        
        # Sütun sayısını kontrol et ve eşle
        if len(df.columns) <= len(expected_columns):
            new_columns = expected_columns[:len(df.columns)]
            df.columns = new_columns
            self.stdout.write(f"Mapped columns to: {new_columns}")
        else:
            self.stdout.write(f"Warning: More columns than expected. Keeping original names.")
        
        return df

    def import_product(self, row, excel_file):
        """Import a single product from Excel row"""
        
        # NaN değerlerini kontrol et ve boş string'e çevir
        def safe_get(key, default=''):
            value = row.get(key, default)
            if pd.isna(value) or value == 'Not available':
                return default
            return str(value).strip()
        
        # Temel product bilgileri
        product_id = safe_get('product_id')
        product_name = safe_get('product_name')
        description = safe_get('description')
        features_benefits = safe_get('features_benefits')
        application = safe_get('application')
        recommendation = safe_get('recommendation')
        
        if not product_id or not product_name:
            raise ValueError(f"Missing required fields: product_id='{product_id}', product_name='{product_name}'")
        
        # Title sadece product_name olacak
        product_data = {
            'title': product_name,  # Sadece product name
            # Translatable fields - Excel'den gelen veri EN olarak kaydedilir
            'description_en': description,
            'features_benefits_en': features_benefits,
            'application_en': application,
            'recommendation': recommendation,  # Recommendation field - normal field olarak eklendi
            'product_id': product_id,
            'slug': self.generate_slug(product_name),  # Product name'den slug oluştur
        }
        
        # Optional fields
        pds_url = safe_get('pds_url')
        if pds_url:
            product_data['pds'] = pds_url
            
        sds_url = safe_get('sds_url')
        if sds_url:
            product_data['sds'] = sds_url
            
        image_path = safe_get('image')
        if image_path:
            product_data['image'] = image_path
        
        # Mevcut ürünü kontrol et
        if Product.objects.filter(product_id=product_data['product_id']).exists():
            self.stdout.write(f'Skipped existing product: {product_data["title"]}')
            return
        
        # Ürünü oluştur - product_range boş bırak
        product = Product.objects.create(
            **product_data,
            product_range=None,  # Product range boş
        )
        
        # Specifications - Excel'deki farklı sütunlardan topla
        self.add_specifications(product, row)
        
        # Diğer ilişkili alanları ekle (eğer Excel'de varsa)
        self.add_application_areas(product, safe_get('application_areas'))
        self.add_viscosities(product, safe_get('viscosities'))
        self.add_compositions(product, safe_get('compositions'))
        self.add_pack_sizes(product, safe_get('pack_sizes'))
        
        self.stdout.write(f'Created product: {product.title}')
        return product

    def generate_slug(self, title):
        """Generate a URL-friendly slug from title"""
        import re
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')

    def add_specifications(self, product, row):
        """Add specifications from multiple columns"""
        specifications_list = []
        
        # API, ILSAC, ACEA, JASO sütunlarından specifications oluştur
        api_data = self.safe_get_from_row(row, 'api')
        if api_data:
            specifications_list.append(f"API {api_data}")
        
        ilsac_data = self.safe_get_from_row(row, 'ilsac')
        if ilsac_data:
            specifications_list.append(f"ILSAC {ilsac_data}")
        
        acea_data = self.safe_get_from_row(row, 'acea')
        if acea_data:
            specifications_list.append(f"ACEA {acea_data}")
        
        jaso_data = self.safe_get_from_row(row, 'jaso')
        if jaso_data:
            specifications_list.append(f"JASO {jaso_data}")
        
        # OEM specifications - bu genellikle çoklu değer içerir
        oem_data = self.safe_get_from_row(row, 'oem_specification')
        if oem_data:
            # Newline ve comma ile ayrılmış değerleri işle
            oem_items = []
            for separator in ['\n', ',', ';']:
                if separator in oem_data:
                    oem_items.extend([item.strip() for item in oem_data.split(separator) if item.strip()])
                    break
            else:
                oem_items = [oem_data.strip()]
            
            specifications_list.extend(oem_items)
        
        # Direct specifications column varsa
        specs_data = self.safe_get_from_row(row, 'specifications')
        if specs_data:
            spec_items = [item.strip() for item in specs_data.split(',') if item.strip()]
            specifications_list.extend(spec_items)
        
        # Specifications'ları oluştur ve ekle
        for spec_text in specifications_list:
            if spec_text and spec_text != 'Not available':
                try:
                    specification, created = Specification.objects.get_or_create(
                        name=spec_text,
                        defaults={'name': spec_text}
                    )
                    product.specifications.add(specification)
                    
                    if created:
                        self.stdout.write(f'Created new specification: {spec_text}')
                        
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(f'Error adding specification "{spec_text}": {str(e)}')
                    )

    def safe_get_from_row(self, row, key, default=''):
        """Safely get value from row"""
        value = row.get(key, default)
        if pd.isna(value) or value == 'Not available':
            return default
        return str(value).strip()

    def add_application_areas(self, product, application_areas_data):
        """Add application areas"""
        if not application_areas_data:
            return
            
        area_items = [item.strip() for item in application_areas_data.split(',') if item.strip()]
        
        for area_item in area_items:
            try:
                if area_item.isdigit():
                    area = ApplicationArea.objects.get(id=int(area_item))
                else:
                    area = ApplicationArea.objects.get(name__iexact=area_item)
                
                product.application_areas.add(area)
                
            except ApplicationArea.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Application area "{area_item}" not found')
                )

    def add_viscosities(self, product, viscosities_data):
        """Add viscosities"""
        if not viscosities_data:
            return
            
        viscosity_items = [item.strip() for item in viscosities_data.split(',') if item.strip()]
        
        for viscosity_item in viscosity_items:
            try:
                if viscosity_item.isdigit():
                    viscosity = Viscosity.objects.get(id=int(viscosity_item))
                else:
                    viscosity = Viscosity.objects.get(name__iexact=viscosity_item)
                
                product.viscosities.add(viscosity)
                
            except Viscosity.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Viscosity "{viscosity_item}" not found')
                )

    def add_compositions(self, product, compositions_data):
        """Add compositions"""
        if not compositions_data:
            return
            
        composition_items = [item.strip() for item in compositions_data.split(',') if item.strip()]
        
        for composition_item in composition_items:
            try:
                if composition_item.isdigit():
                    composition = Composition.objects.get(id=int(composition_item))
                else:
                    composition = Composition.objects.get(name__iexact=composition_item)
                
                product.compositions.add(composition)
                
            except Composition.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Composition "{composition_item}" not found')
                )

    def add_pack_sizes(self, product, pack_sizes_data):
        """Add pack sizes"""
        if not pack_sizes_data:
            return
            
        pack_size_items = [item.strip() for item in pack_sizes_data.split(',') if item.strip()]
        
        for pack_size_item in pack_size_items:
            try:
                if pack_size_item.isdigit():
                    pack_size = PackSize.objects.get(id=int(pack_size_item))
                else:
                    pack_size = PackSize.objects.get(size__iexact=pack_size_item)
                
                product.pack_sizes.add(pack_size)
                
            except PackSize.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Pack size "{pack_size_item}" not found')
                )
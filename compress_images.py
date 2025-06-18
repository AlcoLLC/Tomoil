import os
from PIL import Image, UnidentifiedImageError
from io import BytesIO
import shutil
import warnings

# Increase PIL's image size limit and configure warnings
Image.MAX_IMAGE_PIXELS = 200000000  # Increase limit to ~200MP
warnings.filterwarnings("ignore", "Image size")  # Suppress decompression bomb warnings

# Try to import cairosvg, but make it optional
try:
    import cairosvg
    SVG_SUPPORT = True
    print("✅ SVG support available")
except ImportError:
    SVG_SUPPORT = False
    print("⚠️  SVG support not available. Install Cairo dependencies and cairosvg for SVG processing.")

# Target size range in kilobytes - UPDATED FOR MAX 150 KB
TARGET_MIN_KB = 50
TARGET_MAX_KB = 150

# WebP quality settings - UPDATED for larger file sizes with better quality
WEBP_QUALITY_MIN = 30
WEBP_QUALITY_MAX = 95

# Maximum image dimensions for processing - INCREASED for better quality
MAX_IMAGE_DIMENSION = 2560  # Increased from 1920 to allow larger images

# Supported image formats (SVG only if cairosvg is available)
if SVG_SUPPORT:
    IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.svg', '.bmp', '.tiff', '.gif')
else:
    IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif')

# Source directory for original images - UPDATED to target only products folder
SOURCE_DIR = "/Aminol/media/products"

# Target directory for compressed images - UPDATED to products_demo
COMPRESSED_OUTPUT_DIR = "/Aminol/media/products_demo"


def get_file_size_kb(buffer):
    """Return file size in KB from BytesIO buffer"""
    return len(buffer.getvalue()) / 1024

def resize_if_too_large(img, max_dimension=MAX_IMAGE_DIMENSION):
    """Resize image if it's too large to prevent memory issues"""
    width, height = img.size
    if max(width, height) > max_dimension:
        if width > height:
            new_width = max_dimension
            new_height = int((height * max_dimension) / width)
        else:
            new_height = max_dimension
            new_width = int((width * max_dimension) / height)
        
        print(f"  🔄 Resizing from {width}x{height} to {new_width}x{new_height}")
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    return img

def smart_resize_for_target_size(img, target_size_kb):
    """Intelligently resize image to help reach target file size"""
    width, height = img.size
    current_pixels = width * height
    
    # Estimate pixels needed for target size (rough approximation)
    # This is a heuristic - actual results will vary by image content
    target_pixels = int(current_pixels * (target_size_kb / 200))  # Adjusted for 150KB target
    
    if target_pixels < current_pixels:
        scale_factor = (target_pixels / current_pixels) ** 0.5
        new_width = max(200, int(width * scale_factor))  # Increased minimum to 200px width
        new_height = max(200, int(height * scale_factor))  # Increased minimum to 200px height
        
        print(f"  📐 Smart resize for target size: {width}x{height} -> {new_width}x{new_height}")
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    return img

def compress_webp(img):
    """Iteratively compress WebP to target size with multiple strategies"""
    last_buffer = None
    
    # Strategy 1: Start with higher quality for better results
    for quality in range(WEBP_QUALITY_MAX, WEBP_QUALITY_MIN - 1, -5):
        buffer = BytesIO()
        try:
            img.save(buffer, format="WEBP", quality=quality, optimize=True)
            size_kb = get_file_size_kb(buffer)
            print(f"    📊 Quality {quality}: {size_kb:.1f} KB")
            
            if TARGET_MIN_KB <= size_kb <= TARGET_MAX_KB:
                print(f"    ✅ Target achieved at quality {quality}")
                return buffer
            
            last_buffer = buffer
            
            # If still too large, try resizing the image further
            if size_kb > TARGET_MAX_KB and quality <= 50:
                print(f"    🔄 Still too large, trying smaller dimensions...")
                current_width, current_height = img.size
                new_width = int(current_width * 0.85)  # More conservative resize (85% instead of 80%)
                new_height = int(current_height * 0.85)
                
                # Don't go below minimum reasonable size
                if new_width >= 300 and new_height >= 300:  # Increased minimum size
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    print(f"    📐 Resized to {new_width}x{new_height} for size optimization")
                    
                    # Try compression again with the smaller image
                    buffer = BytesIO()
                    img.save(buffer, format="WEBP", quality=quality, optimize=True)
                    size_kb = get_file_size_kb(buffer)
                    print(f"    📊 After resize, quality {quality}: {size_kb:.1f} KB")
                    
                    if TARGET_MIN_KB <= size_kb <= TARGET_MAX_KB:
                        print(f"    ✅ Target achieved after resize at quality {quality}")
                        return buffer
                        
                    last_buffer = buffer
                
        except Exception as e:
            print(f"    ⚠️ WebP compression failed at quality {quality}: {e}")
            continue
    
    return last_buffer

def convert_svg_to_image(svg_path):
    """Convert SVG to PIL Image object"""
    if not SVG_SUPPORT:
        print(f"❌ SVG support not available for {svg_path}")
        return None
    
    try:
        # Convert SVG to PNG
        png_data = cairosvg.svg2png(url=svg_path)
        # Load PNG data into PIL Image
        img = Image.open(BytesIO(png_data))
        return img
    except Exception as e:
        print(f"❌ SVG conversion error {svg_path}: {e}")
        return None

def safe_makedirs(path):
    """Safely create directories, handling conflicts with existing files"""
    try:
        if os.path.exists(path):
            if os.path.isfile(path):
                # If a file exists with the same name, remove it
                print(f"  ⚠️ Removing conflicting file: {path}")
                os.remove(path)
            elif os.path.isdir(path):
                # Directory already exists, that's fine
                return True
        
        os.makedirs(path, exist_ok=True)
        return True
    except Exception as e:
        print(f"  ❌ Failed to create directory {path}: {e}")
        return False

def process_single_image(original_image_path, compressed_image_save_path):
    """Convert and compress a single image file to WebP format targeting 50-150 KB."""
    try:
        if not os.path.exists(original_image_path) or not os.access(original_image_path, os.R_OK):
            print(f"⏭ Unreadable file: {original_image_path}")
            return False

        original_size_kb = os.path.getsize(original_image_path) / 1024
        
        # Skip extremely large files that might cause memory issues
        if original_size_kb > 50000:  # 50MB limit
            print(f"⏭ File too large ({int(original_size_kb)} KB), skipping: {original_image_path}")
            return False
        
        # Check file extension
        file_ext = os.path.splitext(original_image_path)[1].lower()
        
        # SVG file check
        if file_ext == '.svg':
            if not SVG_SUPPORT:
                print(f"⏭ SVG support not available, skipping: {original_image_path}")
                return False
            img = convert_svg_to_image(original_image_path)
            if img is None:
                return False
            print(f"🔄 SVG converted: {original_image_path}")
        else:
            try:
                img = Image.open(original_image_path)
            except Exception as e:
                print(f"❌ Could not open image {original_image_path}: {e}")
                return False

        # Initial resize if too large
        img = resize_if_too_large(img)
        
        # Smart resize based on target size
        img = smart_resize_for_target_size(img, TARGET_MAX_KB)

        # Change output file extension to .webp
        base_name = os.path.splitext(os.path.basename(compressed_image_save_path))[0]
        dir_name = os.path.dirname(compressed_image_save_path)
        compressed_image_save_path = os.path.join(dir_name, base_name + '.webp')

        # Create output directory safely
        output_dir = os.path.dirname(compressed_image_save_path)
        if not safe_makedirs(output_dir):
            return False

        # Handle mode conversions - optimized for WebP
        try:
            if img.mode == 'P':
                if img.info.get("transparency") is not None:
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")
            elif img.mode == 'LA':
                img = img.convert("RGBA")
            elif img.mode not in ('RGB', 'RGBA', 'L'):
                # Convert other modes to RGB
                img = img.convert("RGB")
        except Exception as e:
            print(f"  ⚠️ Mode conversion issue: {e}")
            # Try to convert to RGB as fallback
            try:
                img = img.convert("RGB")
            except:
                return False

        # WebP compression
        buffer = compress_webp(img)

        if buffer is None or len(buffer.getvalue()) == 0:
            print(f"❌ WebP compression failed for {original_image_path}.")
            return False

        with open(compressed_image_save_path, "wb") as f_out:
            f_out.write(buffer.getvalue())

        compressed_size_kb = get_file_size_kb(buffer)
        print(f"✔ Converted to WebP: {original_image_path}")
        print(f"  ↳ Saved: {compressed_image_save_path}")
        print(f"  📊 {int(original_size_kb)} KB → {compressed_size_kb:.1f} KB")
        
        # Show if target was achieved
        if TARGET_MIN_KB <= compressed_size_kb <= TARGET_MAX_KB:
            print(f"  🎯 Target size achieved!")
        elif compressed_size_kb < TARGET_MIN_KB:
            print(f"  📉 Below target (could increase quality)")
        else:
            print(f"  📈 Above target (may need further optimization)")
        
        return True

    except FileNotFoundError:
        print(f"❌ File not found during processing: {original_image_path}")
        return False
    except UnidentifiedImageError:
        print(f"❌ Unidentified image file (corrupted or not an image): {original_image_path}")
        return False
    except MemoryError:
        print(f"❌ Insufficient memory: {original_image_path} (file too large)")
        return False
    except Exception as e:
        print(f"❌ Error processing {original_image_path}: {e} (Line: {e.__traceback__.tb_lineno if e.__traceback__ else 'N/A'})")
        return False

def is_safe_path(path, base_dir):
    """Ensure path is within the intended base_dir to prevent directory traversal attacks."""
    try:
        abs_base = os.path.abspath(base_dir)
        abs_path = os.path.abspath(path)
        return abs_path.startswith(abs_base)
    except Exception:
        return False

def process_source_directory():
    """Recursively process all valid image files from SOURCE_DIR to COMPRESSED_OUTPUT_DIR, converting to WebP."""

    if not os.path.abspath(SOURCE_DIR).startswith(os.path.abspath("/Aminol")):
        print(f"❌ Security error: Source path {SOURCE_DIR} is not within /Aminol.")
        return
    if not os.path.abspath(COMPRESSED_OUTPUT_DIR).startswith(os.path.abspath("/Aminol")):
        print(f"❌ Security error: Target path {COMPRESSED_OUTPUT_DIR} is not within /Aminol.")
        return

    if not os.path.exists(SOURCE_DIR):
        print(f"❌ Source directory does not exist: {SOURCE_DIR}")
        return
    if not os.path.isdir(SOURCE_DIR):
        print(f"❌ Source path is not a directory: {SOURCE_DIR}")
        return

    # Create main output directory
    if not safe_makedirs(COMPRESSED_OUTPUT_DIR):
        print(f"❌ Could not create main target directory {COMPRESSED_OUTPUT_DIR}")
        return
    else:
        print(f"📁 Target directory ready: {COMPRESSED_OUTPUT_DIR}")

    total_source_files_found = 0
    successfully_processed_this_run = 0
    skipped_existing_count = 0
    failed_this_run = 0
    target_achieved_count = 0
    svg_converted_count = 0
    svg_skipped_count = 0
    large_files_skipped = 0

    try:
        for root, dirs, files in os.walk(SOURCE_DIR):
            if not is_safe_path(root, SOURCE_DIR):
                print(f"⏭ Skipping unsafe path during traversal: {root}")
                continue

            for file in files:
                file_lower = file.lower()
                if file_lower.endswith(IMAGE_EXTENSIONS):
                    total_source_files_found += 1
                    original_path = os.path.join(root, file)

                    if not is_safe_path(original_path, SOURCE_DIR):
                        print(f"⏭ Skipping unsafe original file path: {original_path}")
                        continue

                    # Check file size before processing
                    try:
                        file_size_kb = os.path.getsize(original_path) / 1024
                        if file_size_kb > 50000:  # 50MB limit
                            large_files_skipped += 1
                            continue
                    except:
                        continue

                    # SVG file check
                    if file_lower.endswith('.svg') and not SVG_SUPPORT:
                        print(f"⏭ SVG support not available, skipping: {original_path}")
                        svg_skipped_count += 1
                        continue

                    relative_path = os.path.relpath(original_path, SOURCE_DIR)
                    
                    # Change output file extension to .webp
                    base_name = os.path.splitext(relative_path)[0]
                    compressed_save_path = os.path.join(COMPRESSED_OUTPUT_DIR, base_name + '.webp')

                    if not is_safe_path(compressed_save_path, COMPRESSED_OUTPUT_DIR):
                        print(f"⏭ Skipping unsafe target save path: {compressed_save_path}")
                        continue

                    if os.path.exists(compressed_save_path):
                        print(f"⏭ WebP file already exists at target: {compressed_save_path}. Skipping.")
                        skipped_existing_count += 1
                        continue

                    is_svg = original_path.lower().endswith('.svg')
                    
                    processed_successfully = process_single_image(original_path, compressed_save_path)

                    if processed_successfully:
                        successfully_processed_this_run += 1
                        if is_svg:
                            svg_converted_count += 1
                        
                        # Check if target size was achieved
                        try:
                            final_size_kb = os.path.getsize(compressed_save_path) / 1024
                            if TARGET_MIN_KB <= final_size_kb <= TARGET_MAX_KB:
                                target_achieved_count += 1
                        except:
                            pass
                    else:
                        failed_this_run += 1
    
    except PermissionError as e:
        print(f"❌ Permission denied while processing directory: {e}")
    except Exception as e:
        print(f"❌ Error while processing directory: {e}")

    print(f"\n🏁 WebP conversion process completed.")
    print(f"🔎 Total image files found in products folder: {total_source_files_found}")
    if large_files_skipped > 0:
        print(f"⏭ Files skipped due to size (>50MB): {large_files_skipped}")
    if SVG_SUPPORT:
        print(f"🔄 SVG files converted to WebP: {svg_converted_count}")
    else:
        print(f"⏭ SVG files skipped (no SVG support): {svg_skipped_count}")
    print(f"⏭ Skipped (already exists at target): {skipped_existing_count}")
    print(f"✔ Successfully converted to WebP in this run: {successfully_processed_this_run}")
    print(f"🎯 Files achieving target size ({TARGET_MIN_KB}-{TARGET_MAX_KB} KB): {target_achieved_count}")
    print(f"❌ Failed to process in this run: {failed_this_run}")
    attempted_this_run = successfully_processed_this_run + failed_this_run
    print(f"🛠 Total attempted to process in this run: {attempted_this_run}")


if __name__ == "__main__":
    print(f"🚀 Starting WebP conversion and compression for products folder.")
    print(f"📂 Source directory: {SOURCE_DIR}")
    print(f"💾 Target directory for WebP files: {COMPRESSED_OUTPUT_DIR}")
    print(f"📏 Target size range: {TARGET_MIN_KB}-{TARGET_MAX_KB} KB")
    print(f"🔄 All images will be converted to WebP format.")
    print(f"⚠️  Large files (>50MB) will be skipped for safety.")
    print(f"📐 Very large images will be resized to max {MAX_IMAGE_DIMENSION}px.")
    
    if SVG_SUPPORT:
        print(f"✅ SVG support active. SVG files will be converted to PNG first, then to WebP.")
    else:
        print(f"⚠️  No SVG support. To process SVG files, install Cairo libraries:")
        print(f"    sudo apt install libcairo2-dev libgirepository1.0-dev pkg-config")
        print(f"    pip install cairosvg")
        print(f"    SVG files will be skipped.")
    
    print("-" * 60)

    process_source_directory()
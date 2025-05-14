from django.shortcuts import render

def pds_sds_view(request):
    return render(request, 'pds&sds.html')

def all_data_sheets_view(request):
    return render(request, 'all_data_sheets.html')

def products_view(request):
    return render(request, 'products.html')

def products_detail_view(request):
    return render(request, 'products_single_page.html')
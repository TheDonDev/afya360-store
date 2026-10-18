import scrapy
import re
from urllib.parse import urlparse


class MyDawaProductSpider(scrapy.Spider):
    name = 'mydawa_products'
    allowed_domains = ['mydawa.com']
    api_url = 'https://mydawa.com/productsearch?query=products&limit=15000&productSearch=false'
    priority_brands = (
        re.compile(r'\bnow\b', re.IGNORECASE),
        re.compile(r'webber[s]?\s+naturals', re.IGNORECASE),
        re.compile(r"nature[' ]?s?\s+aid", re.IGNORECASE),
        re.compile(r'natural factors', re.IGNORECASE),
        re.compile(r'natures?plus|nature["\' ]?s?\s+plus', re.IGNORECASE),
        re.compile(r'natures?\s+bounty', re.IGNORECASE),
        re.compile(r'jamieson[s]?', re.IGNORECASE),
        re.compile(r'cerave', re.IGNORECASE),
        re.compile(r'la\s* roche|laroche|roche\s*posay', re.IGNORECASE),
        re.compile(r'dr\s+organic', re.IGNORECASE),
        re.compile(r'\busn\b', re.IGNORECASE),
        re.compile(r'optimum\s+nutrition', re.IGNORECASE),
        re.compile(r'\bhb\b|holland\s*(?:and|&)\s*barrett', re.IGNORECASE),
        re.compile(r'vitabiotics', re.IGNORECASE),
        re.compile(r'bioderma', re.IGNORECASE),
    )

    @classmethod
    def is_priority_product(cls, product):
        searchable_text = ' '.join(
            str(value or '')
            for value in (product.get('name'), product.get('webslug'), product.get('url'))
        )
        brand_name = (product.get('brands') or {}).get('brandName', '')
        searchable_text = f'{searchable_text} {brand_name}'
        return any(pattern.search(searchable_text) for pattern in cls.priority_brands)

    @staticmethod
    def replace_brand(value):
        return re.sub(r'\bmydawa\b', 'Afya 360 Supplements', value or '', flags=re.IGNORECASE)

    @staticmethod
    def replace_handle_brand(value):
        return re.sub(r'(?i)mydawa', 'afya-360-supplements', value or '')

    async def start(self):
        yield scrapy.Request(
            self.api_url,
            method='POST',
            headers={'Accept': 'application/json', 'Referer': 'https://mydawa.com/products/'},
            callback=self.parse,
        )

    def parse(self, response):
        payload = response.json()

        for product in payload.get('products', []):
            if not self.is_priority_product(product):
                continue
            yield scrapy.Request(
                response.urljoin(
                    f"/productdetail?id={product.get('id')}&json=true"
                ),
                headers={'Accept': 'application/json'},
                callback=self.parse_product_detail,
                meta={'listing_product': product},
            )

    def parse_product_detail(self, response):
        listing_product = response.meta['listing_product']
        detail_product = response.json()
        product = {**listing_product, **detail_product}
        product_url = response.urljoin(product.get('url') or f"/products/{product.get('webSlug', '')}")
        path_parts = [part for part in urlparse(product_url).path.split('/') if part]
        handle = path_parts[-1] if path_parts else ''
        categories = listing_product.get('categories') or []
        category_names = [
            self.replace_brand(category.get('description', '').strip())
            for category in categories
            if category.get('description')
        ]
        product_type = category_names[-1] if category_names else ''
        image_urls = product.get('imageLink') or []
        image_url = next((url.strip() for url in image_urls if url and url.strip()), '')
        if not image_url:
            return
        description = self.replace_brand(
            product.get('description') or product.get('descriptionDetail') or ''
        )

        yield {
                'Handle': self.replace_handle_brand(handle),
                'Title': self.replace_brand(product.get('name', '').strip()),
                'Body (HTML)': description,
                'Vendor': 'Afya 360 Supplements',
                'Product Category': category_names[0] if category_names else '',
                'Type': product_type,
                'Tags': ', '.join(dict.fromkeys(category_names)),
                'Published': 'FALSE',
                'Option1 Name': 'Title',
                'Option1 Value': 'Default Title',
                'Option2 Name': '',
                'Option2 Value': '',
                'Option3 Name': '',
                'Option3 Value': '',
                'Variant SKU': product.get('itemNo', ''),
                'Variant Grams': '',
                'Variant Inventory Tracker': 'shopify',
                'Variant Inventory Qty': (product.get('stock') or 0) + 10,
                'Variant Inventory Policy': 'deny',
                'Variant Fulfillment Service': 'manual',
                'Variant Price': (
                    product.get('price', 0) - 400
                    if product.get('price', 0) >= 400
                    else product.get('price', 0)
                ),
                'Variant Compare At Price': '',
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Variant Barcode': product.get('itemNo', ''),
                'Image Src': image_url,
                'Image Position': 1,
                'Image Alt Text': self.replace_brand(product.get('name', '').strip()),
                'Gift Card': 'FALSE',
                'SEO Title': self.replace_brand(product.get('name', '').strip()),
                'SEO Description': description,
                'Status': 'draft',
            }

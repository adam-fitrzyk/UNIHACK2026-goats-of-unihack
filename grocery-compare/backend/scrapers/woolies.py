import requests
from bs4 import BeautifulSoup

def woolies_search(query):
    URL = "https://www.woolworths.com.au/shop/search/products?searchTerm=" + query
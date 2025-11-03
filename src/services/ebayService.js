const axios = require('axios');
const cheerio = require('cheerio');
const { scrapeProductDescription } = require('../utils/parser');

// AI-optimized CSS selectors for eBay
const SELECTORS = {
  PRODUCT_CARD: '.s-item__wrapper',
  TITLE: '.s-item__title',
  PRICE: '.s-item__price',
  LINK: '.s-item__link',
  IMAGE: '.s-item__image-img'
};

// Anti-bot configuration (AI-suggested)
const CONFIG = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  },
  timeout: 10000
};

/**
 * Scrape eBay products with pagination
 * @param {string} keyword - Search keyword
 * @param {number} maxPages - Maximum pages to scrape
 * @returns {Array} Array of product objects
 */
async function scrapeEbayProducts(keyword, maxPages = 1) {
  const allProducts = [];
  
  try {
    for (let page = 1; page <= maxPages; page++) {
      console.log(`📄 Scraping page ${page}...`);
      
      const pageUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&_sacat=0&_pgn=${page}`;
      const products = await scrapePage(pageUrl);
      
      if (products.length === 0) {
        console.log('⏹️ No more products found, stopping pagination.');
        break;
      }
      
      allProducts.push(...products);
      
      // AI-suggested: Delay between pages to avoid rate limiting
      if (page < maxPages) {
        await delay(2000 + Math.random() * 1000);
      }
    }
    
    console.log(`✅ Scraping completed: ${allProducts.length} products found`);
    return allProducts;
    
  } catch (error) {
    console.error('Error in scrapeEbayProducts:', error.message);
    throw error;
  }
}

/**
 * Scrape a single page of eBay results
 * @param {string} url - Page URL to scrape
 * @returns {Array} Products from the page
 */
async function scrapePage(url) {
  try {
    const response = await axios.get(url, CONFIG);
    const $ = cheerio.load(response.data);
    const products = [];
    
    // AI-suggested: Use wrapper element for more stable selection
    $(SELECTORS.PRODUCT_CARD).each((index, element) => {
      const $element = $(element);
      
      const title = $element.find(SELECTORS.TITLE).text().trim() || '-';
      const price = $element.find(SELECTORS.PRICE).first().text().trim() || '-';
      const link = $element.find(SELECTORS.LINK).attr('href');
      const image = $element.find(SELECTORS.IMAGE).attr('src');
      
      // Skip promoted ads and invalid items
      if (title === '-' || title.includes('Shop on eBay') || !link) {
        return;
      }
      
      const product = {
        name: cleanText(title),
        price: cleanText(price),
        link: link,
        image: image || '-',
        description: '-' // Will be populated when visiting detail page
      };
      
      products.push(product);
    });
    
    return products;
    
  } catch (error) {
    console.error(`Error scraping page ${url}:`, error.message);
    return [];
  }
}

/**
 * Clean and normalize text
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Delay function (AI-suggested for rate limiting)
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  scrapeEbayProducts,
  scrapePage
};

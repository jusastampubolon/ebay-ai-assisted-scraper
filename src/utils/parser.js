const axios = require('axios');
const cheerio = require('cheerio');

// AI-suggested configuration for detail page requests
const DETAIL_CONFIG = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.ebay.com/',
  },
  timeout: 15000
};

// AI-optimized selectors for product description
const DESCRIPTION_SELECTORS = [
  '.ux-layout-section-evo__row .ux-textspans', // Primary description container
  '.d-item-description', // Alternative description container
  '.item-description', // Fallback selector
  '[data-testid="x-item-description"]', // Data attribute selector
  '.desc' // General description fallback
];

/**
 * Extract product description from detail page
 * @param {string} productUrl - URL of the product detail page
 * @returns {string} Product description or '-'
 */
async function scrapeProductDescription(productUrl) {
  // Skip if no valid URL or if it's a search page
  if (!productUrl || productUrl.includes('/sch/')) {
    return '-';
  }

  try {
    console.log(`🔍 Visiting detail page: ${productUrl.substring(0, 80)}...`);
    
    const response = await axios.get(productUrl, DETAIL_CONFIG);
    const $ = cheerio.load(response.data);
    
    let description = '-';
    
    // AI-suggested: Try multiple selectors for description
    for (const selector of DESCRIPTION_SELECTORS) {
      const descriptionText = $(selector).first().text().trim();
      if (descriptionText && descriptionText.length > 10) { // Minimum length check
        description = cleanDescription(descriptionText);
        break;
      }
    }
    
    // AI-suggested fallback: Look for any text content in main content areas
    if (description === '-') {
      const mainContent = $('main, .main, #main, .item-detail, .product-detail').first();
      if (mainContent.length) {
        const fallbackText = mainContent.text().trim().substring(0, 500); // Limit length
        if (fallbackText.length > 20) {
          description = cleanDescription(fallbackText);
        }
      }
    }
    
    return description;
    
  } catch (error) {
    console.error(`❌ Failed to scrape description from ${productUrl}:`, error.message);
    return '-';
  }
}

/**
 * Clean and format description text (AI-optimized cleaning)
 * @param {string} text - Raw description text
 * @returns {string} Cleaned description
 */
function cleanDescription(text) {
  if (!text) return '-';
  
  return text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[\r\n\t]+/g, ' ') // Replace newlines and tabs
    .replace(/[^\w\s.,!?\-@#$%&*()]/g, '') // Remove special characters but keep basic punctuation
    .trim()
    .substring(0, 1000); // Limit length to prevent huge responses
}

/**
 * Delay utility for rate limiting (AI-suggested)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  scrapeProductDescription,
  cleanDescription,
  delay
};

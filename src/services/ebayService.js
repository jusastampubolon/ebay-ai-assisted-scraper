const puppeteer = require('puppeteer');
const { scrapeProductDescription } = require('../utils/parser');

/**
 * Scrape eBay products with pagination using Puppeteer
 * @param {string} keyword - Search keyword
 * @param {number} maxPages - Maximum pages to scrape
 * @returns {Array} Array of product objects
 */
async function scrapeEbayProducts(keyword, maxPages = 1) {
  let browser;
  const allProducts = [];
  
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set realistic viewport and user agent
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
      console.log(`📄 Scraping page ${currentPage}...`);
      
      const pageUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&_sacat=0&_pgn=${currentPage}`;
      
      console.log(`🌐 Navigating to: ${pageUrl}`);
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for products to load
      await page.waitForSelector('.s-item, .srp-results', { timeout: 10000 }).catch(() => {
        console.log('⏰ Timeout waiting for products, but continuing...');
      });
      
      const products = await page.evaluate(() => {
        const products = [];
        
        // Multiple selector strategies
        const productSelectors = [
          '.s-item__wrapper',
          '.s-item__info', 
          '.s-item',
          '.srp-results li'
        ];
        
        let productElements = [];
        
        for (const selector of productSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            productElements = Array.from(elements);
            break;
          }
        }
        
        console.log(`Found ${productElements.length} product elements`);
        
        productElements.forEach((element) => {
          try {
            // Get title and clean it
            const titleEl = element.querySelector('.s-item__title, [class*="title"]');
            let title = titleEl ? titleEl.textContent.trim() : '';
            
            // CLEAN: Remove "Opens in new window" text and other noise
            title = title
              .replace(/Opens in a new window or tab/gi, '')
              .replace(/New Listing/gi, '')
              .trim();
            
            // Get price
            const priceEl = element.querySelector('.s-item__price, [class*="price"]');
            const price = priceEl ? priceEl.textContent.trim() : '';
            
            // Get link and clean it (remove tracking parameters)
            const linkEl = element.querySelector('a');
            let link = linkEl ? linkEl.href : '';
            
            // CLEAN: Simplify eBay URL - keep only the main product ID part
            if (link.includes('/itm/')) {
              const itemIdMatch = link.match(/\/(\d+)\?/);
              if (itemIdMatch) {
                link = `https://www.ebay.com/itm/${itemIdMatch[1]}`;
              }
            }
            
            // Get image
            const imageEl = element.querySelector('img');
            const image = imageEl ? imageEl.src : '';
            
            // Extract product ID from link
            const productId = link.match(/\/(\d+)$/) ? link.match(/\/(\d+)$/)[1] : null;
            
            // Only add valid products
            if (title && title.length > 10 && !title.includes('Shop on eBay') && link && productId) {
              products.push({
                productId: productId,
                name: title.replace(/\s+/g, ' ').trim(),
                price: price.replace(/\s+/g, ' ').trim() || '-',
                link: link,
                image: image || '-',
                description: '-' // Will be populated later
              });
            }
          } catch (error) {
            console.log('Error processing product element:', error);
          }
        });
        
        return products;
      });
      
      console.log(`📦 Page ${currentPage}: Found ${products.length} products`);
      
      if (products.length === 0) {
        console.log('⏹️ No products found, stopping pagination.');
        break;
      }
      
      allProducts.push(...products);
      
      // Delay between pages
      if (currentPage < maxPages) {
        await delay(3000 + Math.random() * 2000);
      }
    }
    
    console.log(`✅ Initial scraping completed: ${allProducts.length} total products found`);
    
    // ENHANCE: Add real descriptions to products
    console.log('🔍 Enhancing products with descriptions...');
    const enhancedProducts = await enhanceWithDescriptions(allProducts, browser);
    
    console.log(`🎉 Final result: ${enhancedProducts.length} enhanced products`);
    return enhancedProducts;
    
  } catch (error) {
    console.error('Error in scrapeEbayProducts:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔴 Browser closed');
    }
  }
}

/**
 * Enhance products with real descriptions by visiting detail pages
 * @param {Array} products - Array of product objects
 * @param {Object} browser - Puppeteer browser instance
 * @returns {Array} Enhanced products with descriptions
 */
async function enhanceWithDescriptions(products, browser) {
  const enhancedProducts = [];
  const descriptionPage = await browser.newPage();
  
  try {
    // Limit to first 10 products to avoid rate limiting (adjust as needed)
    const productsToEnhance = products.slice(0, 10);
    const remainingProducts = products.slice(10);
    
    console.log(`📖 Getting descriptions for ${productsToEnhance.length} products...`);
    
    for (let i = 0; i < productsToEnhance.length; i++) {
      const product = productsToEnhance[i];
      
      try {
        console.log(`🔍 Fetching description for product ${i + 1}/${productsToEnhance.length}: ${product.productId}`);
        
        await descriptionPage.goto(product.link, { 
          waitUntil: 'networkidle2', 
          timeout: 15000 
        });
        
        // Get description from the detail page
        const description = await descriptionPage.evaluate(() => {
          // Try multiple description selectors
          const descriptionSelectors = [
            '.d-item-description',
            '.item-description',
            '[data-testid="x-item-description"]',
            '.desc',
            '.ux-layout-section-evo__row'
          ];
          
          for (const selector of descriptionSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim().length > 20) {
              return element.textContent
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 500); // Limit length
            }
          }
          
          return 'No description available';
        });
        
        enhancedProducts.push({
          ...product,
          description: description
        });
        
        console.log(`✅ Added description for ${product.productId}`);
        
      } catch (error) {
        console.log(`❌ Failed to get description for ${product.productId}:`, error.message);
        enhancedProducts.push(product); // Keep original product without description
      }
      
      // Delay between description requests
      if (i < productsToEnhance.length - 1) {
        await delay(2000 + Math.random() * 1000);
      }
    }
    
    // Add remaining products without descriptions
    enhancedProducts.push(...remainingProducts);
    
  } catch (error) {
    console.error('Error in enhanceWithDescriptions:', error.message);
    // If enhancement fails, return original products
    return products;
  } finally {
    await descriptionPage.close();
  }
  
  return enhancedProducts;
}

/**
 * Delay function
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  scrapeEbayProducts
};
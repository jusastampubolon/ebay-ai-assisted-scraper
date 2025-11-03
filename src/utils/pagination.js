/**
 * Pagination utility for eBay scraping
 * AI-assisted pagination logic to handle eBay's pagination system
 */

/**
 * Generate pagination URLs for eBay search
 * @param {string} baseUrl - Base eBay search URL
 * @param {number} totalPages - Total pages to scrape
 * @returns {Array} Array of page URLs
 */
function generatePageUrls(baseUrl, totalPages) {
  const urls = [];
  
  // AI-suggested: eBay uses _pgn parameter for pagination
  for (let page = 1; page <= totalPages; page++) {
    // Remove existing _pgn parameter if present
    const cleanUrl = baseUrl.replace(/&_pgn=\d+/, '');
    const pageUrl = `${cleanUrl}&_pgn=${page}`;
    urls.push(pageUrl);
  }
  
  console.log(`📄 Generated ${urls.length} page URLs for scraping`);
  return urls;
}

/**
 * Detect if there are more pages available
 * AI-suggested: Check for next page button or pagination elements
 * @param {Object} $ - Cheerio instance of current page
 * @returns {boolean} True if more pages exist
 */
function hasNextPage($) {
  const nextPageSelectors = [
    '.pagination__next',
    '.pagination .next',
    '.pagination__item:last-child a',
    '[rel="next"]',
    '.pagination li:last-child a'
  ];
  
  // AI-suggested: Check multiple selectors for next page link
  for (const selector of nextPageSelectors) {
    if ($(selector).length > 0 && !$(selector).hasClass('disabled')) {
      return true;
    }
  }
  
  // Fallback: Check if current page has products
  const productCount = $('.s-item__wrapper').length;
  return productCount > 0;
}

/**
 * Calculate delay between page requests (AI-optimized rate limiting)
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total pages to scrape
 * @returns {number} Delay in milliseconds
 */
function calculatePageDelay(currentPage, totalPages) {
  // AI-suggested: Progressive delays to avoid detection
  const baseDelay = 2000; // 2 second base delay
  const randomDelay = Math.random() * 3000; // 0-3 second random delay
  const progressiveDelay = currentPage * 500; // Increase delay as we go deeper
  
  return baseDelay + randomDelay + progressiveDelay;
}

/**
 * Validate page number input (AI-suggested safety limits)
 * @param {number} pages - Requested number of pages
 * @param {number} maxAllowed - Maximum allowed pages
 * @returns {number} Validated page count
 */
function validatePageCount(pages, maxAllowed = 10) {
  const parsedPages = parseInt(pages) || 1;
  
  // AI-suggested: Set reasonable limits to avoid overwhelming the server
  if (parsedPages < 1) return 1;
  if (parsedPages > maxAllowed) {
    console.log(`⚠️ Page limit exceeded, capping at ${maxAllowed} pages`);
    return maxAllowed;
  }
  
  return parsedPages;
}

/**
 * Extract current page number from URL
 * @param {string} url - eBay page URL
 * @returns {number} Current page number
 */
function getCurrentPageNumber(url) {
  const match = url.match(/&_pgn=(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

module.exports = {
  generatePageUrls,
  hasNextPage,
  calculatePageDelay,
  validatePageCount,
  getCurrentPageNumber
};

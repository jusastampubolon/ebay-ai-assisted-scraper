const express = require('express');
const router = express.Router();
const ebayService = require('../services/ebayService');

/**
 * @route GET /api/scrape
 * @description Scrape eBay products by keyword
 * @query {string} keyword - Search term (default: 'nike')
 * @query {number} pages - Number of pages to scrape (default: 1)
 * @returns {Object} JSON response with products array
 */
router.get('/scrape', async (req, res) => {
  try {
    const { keyword = 'nike', pages = 1 } = req.query;
    
    console.log(`🔍 Starting scrape for: "${keyword}" (${pages} pages)`);
    
    const products = await ebayService.scrapeEbayProducts(keyword, parseInt(pages));
    
    res.json({
      success: true,
      keyword,
      pagesScraped: pages,
      totalProducts: products.length,
      products: products
    });
    
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Scraping failed. Please try again later.'
    });
  }
});

module.exports = router;

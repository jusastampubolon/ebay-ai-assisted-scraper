const express = require('express');
const scraperRoutes = require('./routes/scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', scraperRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'eBay AI-Assisted Scraper API is running!',
    endpoints: {
      scrape: 'GET /api/scrape?keyword=product_name&pages=number'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
});

module.exports = app;

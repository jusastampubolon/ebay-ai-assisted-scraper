# eBay AI-Assisted Scraper API

AI-assisted eBay web scraper API built with Node.js. Uses AI during development for optimal selector design and architecture, but runs with traditional Cheerio parsing in production. Extracts product names, prices, and descriptions with pagination support.

## 🚀 Features

- **AI-Assisted Development**: Leveraged AI for optimal CSS selector design and architecture planning
- **Traditional Runtime**: Uses Cheerio + Axios for reliable, cost-effective scraping
- **Pagination Support**: Automatically scrapes all products across multiple pages
- **Robust Error Handling**: Graceful handling of missing data and network issues
- **JSON API**: Clean RESTful API returning structured JSON data
- **Anti-Bot Measures**: Intelligent rate limiting and browser-like headers

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Scraping**: Cheerio (HTML parsing) + Axios (HTTP requests)
- **AI Assistance**: Used during development only (no runtime dependencies)

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ebay-ai-assisted-scraper.git
cd ebay-ai-assisted-scraper

# Install dependencies
npm install

# Start server
npm start
For development with auto-restart:

bash
npm run dev
🎯 API Usage
Scrape eBay Products
http
GET /api/scrape?keyword=nike&pages=3
Parameters:

keyword (optional): Search term (default: "nike")

pages (optional): Number of pages to scrape (default: 1, max: 10)

Example Request:

bash
curl "http://localhost:3000/api/scrape?keyword=adidas&pages=2"
Example Response:

json
{
  "success": true,
  "keyword": "adidas",
  "pagesScraped": 2,
  "totalProducts": 48,
  "products": [
    {
      "name": "Adidas Ultraboost 21 Running Shoes",
      "price": "$129.99",
      "link": "https://www.ebay.com/itm/123456789",
      "image": "https://i.ebayimg.com/images/g/abc123.jpg",
      "description": "Brand new Adidas Ultraboost 21 with latest cushioning technology..."
    }
  ]
}
Health Check
http
GET /
Response:

json
{
  "message": "eBay AI-Assisted Scraper API is running!",
  "endpoints": {
    "scrape": "GET /api/scrape?keyword=product_name&pages=number"
  }
}
🔧 Development Approach
This project demonstrates AI-assisted development:

AI Contributions:
Selector Optimization: AI helped identify the most stable CSS selectors for eBay's dynamic structure

Architecture Design: AI suggested the modular service-based architecture

Pagination Logic: AI designed the robust pagination handling with rate limiting

Anti-Bot Strategies: AI recommended headers and delays to avoid detection

Error Handling: AI helped design comprehensive error handling patterns

Final Implementation:
Zero AI Runtime Dependencies: Pure traditional scraping with Cheerio + Axios

Cost-Effective: No ongoing API costs

Reliable: Consistent performance without AI service dependencies

📁 Project Structure
text
src/
├── app.js                 # Main Express server
├── routes/
│   └── scraper.js         # API routes
├── services/
│   └── ebayService.js     # Core scraping logic
└── utils/
    ├── parser.js          # HTML parsing utilities
    └── pagination.js      # Pagination helpers
🛡️ Error Handling
The API gracefully handles:

Network timeouts

Missing product data

Invalid search terms

Rate limiting responses

HTML structure changes

⚡ Performance Features
Concurrent Processing: Efficient page scraping with controlled concurrency

Rate Limiting: Intelligent delays between requests

Memory Efficient: Streamlined data processing

Fast JSON Responses: Optimized response formatting

🚨 Important Notes
Use responsibly and respect eBay's robots.txt

Add appropriate delays between large scraping jobs

This is for educational/demonstration purposes

Always check website terms of service before scraping

📝 License
MIT License - see LICENSE file for details

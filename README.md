# eBay AI-Assisted Scraper API

AI-assisted eBay web scraper API built with Node.js. Uses AI during development for optimal selector design and architecture, but runs with traditional Cheerio parsing in production. Extracts product names, prices, and descriptions with pagination support.

## 🚀 Features

- **AI-Assisted Development**: Leveraged AI for optimal CSS selector design and architecture planning
- **Traditional Runtime**: Uses Cheerio + Axios for reliable, cost-effective scraping
- **Pagination Support**: Automatically scrapes all products across multiple pages
- **Robust Error Handling**: Graceful handling of missing data and network issues
- **JSON API**: Clean RESTful API returning structured JSON data

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Scraping**: Cheerio (HTML parsing) + Axios (HTTP requests)
- **AI Assistance**: Used during development only (no runtime dependencies)

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ebay-ai-assisted-scraper.git

# Install dependencies
npm install

# Start server
npm start

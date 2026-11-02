TECH THINGS (techthings.cc) — SITE FILES
==========================================

WHAT'S IN HERE
  index.html            The whole website (one page)
  logo.svg / logo.png   Your logo (transparent background)
  favicon.ico, favicon.svg, favicon-32.png   Browser tab icons
  apple-touch-icon.png  iPhone home-screen icon
  icon-192.png, icon-512.png, site.webmanifest   Android / app icons
  robots.txt, sitemap.xml   Help Google find and crawl the site

1) PUT IT ONLINE
  Upload every file (not the folder) to the root of techthings.cc.
  Free options: Netlify (drag and drop the folder), Cloudflare Pages, or GitHub Pages.
  Then point techthings.cc at that host in your domain registrar's DNS settings.

2) GOOGLE SEARCH
  - Go to https://search.google.com/search-console and add techthings.cc
  - Submit the sitemap: https://techthings.cc/sitemap.xml

3) GOOGLE ADSENSE
  - Your AdSense code (ca-pub-3289369952589760) is already in index.html and ads.txt.
  - Once approved, open index.html and find the SETTINGS block near the top.
    Fill in the 3 AD_SLOTS (top, middle, bottom) with your ad unit IDs.
  - The gray "Ad space" boxes turn into real ads automatically.

4) AMAZON AFFILIATE
  - Already set: AFFILIATE_TAG "10techthings-20". Every "View on Amazon" button uses it.
  - Amazon closes new accounts without 3 qualifying sales in the first 180 days.

5) CONTACT EMAIL
  - Set in SETTINGS: CONTACT_EMAIL. Shows in Contact and the Privacy Policy.

6) WEEKLY UPDATE (every Friday)
  In index.html, find "THIS WEEK'S LIST" and:
  - Fill deals (top section, up to 10) with this week's tech deals (asin, img, brand, name).
  - Replace the 10 items (bottom section) with the new best sellers (rank, asin, img, brand, name).
  - Copy every ASIN from last week's deals AND items into lastWeekAsins.
  - Change weekOf to the new Friday's date (YYYY-MM-DD).
  - Update <lastmod> in sitemap.xml to the same date.
  The ASIN is the code in an Amazon link after /dp/ (e.g. amazon.com/dp/B0DCH8VDXF).
  img is the code from the product's main photo: right-click the main photo on Amazon,
  copy the image address, and take the part after /images/I/ up to the first dot
  (https://m.media-amazon.com/images/I/513OSdW4elL._AC_SL1500_.jpg -> 513OSdW4elL).

RULES TO STAY SAFE WITH AMAZON
  - Don't add prices or star ratings by hand (Associates rules).
  - Photos load straight from Amazon's servers (don't download and re-upload them).
    Once you have 3 sales, request Product Advertising API access to pull images officially.
  - Keep the "As an Amazon Associate I earn from qualifying purchases" line.

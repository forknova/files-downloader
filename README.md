# Shopify file downloader

This allows you to download all assets in shopify's /admin/files.

### Configure

1. Create a new Shopify custom app.
2. Under Configuration select "Admin API integration" 
   1. Only access scope needed is `read_files` [see here](screenshot.png)
3. Install app
4. Fill out [config.json](config.json)
5. run `yarn start` or `npm run start` in console
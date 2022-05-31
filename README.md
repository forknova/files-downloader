# Shopify files downloader

This allows you to download all assets in Shopify's `/admin/files`.

## Usage

#### Initial
1. Download or clone this repo
2. Open Terminal and navigate to the appropriate directory
3. Run the command `yarn`

#### Per store
1. Create a new Shopify custom app.
2. Under Configuration select "Admin API integration" 
   1. Only access scope needed is `read_files` [see here](screenshot.png)
3. Install app
4. Fill out [config.json](config.json) with the API access token and the store Shopify url.
5. Run the command `yarn start` and enjoy! (files will be downloaded into `./files/` directory)

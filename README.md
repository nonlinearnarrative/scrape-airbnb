# scrape-airbnb
Scrapes metadata from Airbnb listings and saves them as JSON files. Made as part of a week-long web scraping workshop led by [Jonathan Puckey](https://puckey.studio/) at [Non-Linear Narrative](https://www.kabk.nl/en/programmes/master/non-linear-narrative), a masters programme at the Royal Academy of Art The Hague.

## Usage

```bash
# Install dependencies
npm i
# Run the main script
node scrape
```

## Manipulating the data
The folder `examples` contains various examples of manipulating the data. Some of them require that you run object recognition on the scraped data first. Use our tool [`airbnb-object-recognition`](https://github.com/nonlinearnarrative/airbnb-object-recognition).

```bash
node examples/[example name]
```

### Basics
- `examining-properties` – basic boilerplate to get metadata out of listings
- `examining-adjectives` – get adjectives from comments
- `amenities` – print out all amenities found in the listings
- `geo-json` – extract coordinates from listings
- `minutes-to` – print all listings that contain the phrase "X minutes to Y"
- `properties-by-host` – see all listings of one host

### Imagery
- `copy-bedrooms` – get all listing photos that contain beds and copy them to a separate folder
- `copy-group-images-by-type` sort listing photos into folders by type
- `copy-order-images-by-cleanliness` sort listing photos by Airbnb's cleanliness rating
- `copy-order-images-by-price` sort listing photos by price
- `copy-order-images-by-type-by-price` sort listing photos by type, then price
- `copy-people` – get all listing photos that contain people and copy them to a separate folder
- `copy-random-bed` – get random listing photos of bedrooms

### Specific
- `export-frontend-data` – create JSON files containing all recognized objects for each listing and the other way around
- `neighbourhoods` – use GPS coordinates from neighbourhoods in The Hague to determine which neighbourhood each listing is in

## About this project
[`airbnb-object-recognition`](https://github.com/nonlinearnarrative/airbnb-object-recognition) and [`scrape-airbnb`](https://github.com/nonlinearnarrative/scrape-airbnb) were written as part of a workshop at [Non-Linear Narrative](https://www.kabk.nl/en/programmes/master/non-linear-narrative) at Royal Academy of Art The Hague. They are tools used to create [No Home Like Place](https://github.com/nonlinearnarrative/no-home-like-place).

# Data preparation

### Coordinates
1. Go here: https://sv.wikipedia.org/wiki/Kategori:Sveriges_kommuner
2. "Export all as KML"
3. Manual data wrangling

### Generating kommun images

1. Download ArcView shapes from here: https://www.scb.se/hitta-statistik/regional-statistik-och-kartor/regionala-indelningar/digitala-granser/
2. Extract the first zip file
3. Get an account at Mapbox.com, copy your API token
4. Run this:
```
pip3 install sweref99
pip3 install mapbox
pip3 install pyshp
pip3 install visvalingamwyatt

export MAPBOX_ACCESS_TOKEN="YOUR_MAP_BOX_TOKEN"
python3 generate_images.py
```

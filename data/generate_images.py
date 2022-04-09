import shapefile
from sweref99 import projections
import visvalingamwyatt as vw
import json

from mapbox import StaticStyle
from mapbox import Static
mapboxService = Static()
staticStyleService = StaticStyle()

tm = projections.make_transverse_mercator("SWEREF_99_TM")

#FILE_SUFFIX = '-basic'
#MAPBOX_THEME_ID = 'cl1rtp4ry004i14qsaci3zkn9'
FILE_SUFFIX = '-satellite'
MAPBOX_THEME_ID = 'cl1rswpq7002v14mqhkea8bt8'
#FILE_SUFFIX = '-outdoors'
#MAPBOX_THEME_ID = 'cl1rsu82j000a14t8xitigks8'

# Count number of tuples in arr and in `arr's subarrays
def countTuples(arr):
	if (isinstance(arr, list) and isinstance(arr[0], tuple)):
		return len(arr)
	else:
		return sum(list(map(countTuples, arr)))

# Convert from weird Swedish coordinates to Mapbox-accepted coordinates
def fixCoordinate(coordinate):
	easting, northing = coordinate
	lat, lon = tm.grid_to_geodetic(northing, easting)
	return (lon, lat)

def fixCoordinates(coordinates):
	if (isinstance(coordinates, list)):
		return list(map(fixCoordinates, coordinates))
	else:
		return fixCoordinate(coordinates)

# Remove some coordinates to make Mapbox payload size smaller
def simplifyCoordinates(coordinates, scalingFactor):
	if (isinstance(coordinates, list) and isinstance(coordinates[0], tuple)):
		simplifier = vw.Simplifier(coordinates)
		result = simplifier.simplify(ratio = scalingFactor)
		result = list(map(tuple, result))
		result.append(result[0]) # prevent "the first and last positions in a LinearRing must be the same"
		if (len(result)<4):
			# "A linearRing of coordinates needs to have four or more positions"
			# try again with higher scalingFactor
			return simplifyCoordinates(coordinates, min(1, scalingFactor*1.1))
		else:
			return result
	else:
		return list(map(lambda x: simplifyCoordinates(x, scalingFactor), coordinates))

def fixGeoJson(geoJson):
	coordinates = geoJson['geometry']['coordinates']

	numberOfTuples = countTuples(coordinates)
	acceptedNumberOfTuples = 30
	scalingFactor = min(acceptedNumberOfTuples / numberOfTuples, 1)

	coordinates = fixCoordinates(coordinates)
	coordinates = simplifyCoordinates(coordinates, scalingFactor)
	
	geoJson['geometry']['coordinates'] = coordinates
	# See https://github.com/mapbox/simplestyle-spec
	geoJson['properties']['fill'] = '#fff'
	geoJson['properties']['fill-opacity'] = '0.2'
	geoJson['properties']['stroke-width'] = '2'
	return geoJson

# Render geoJson on top of a Mapbox map and save the image file
def writeImage(geoJson, filename):
	geoJson = fixGeoJson(geoJson)
	response = staticStyleService.image('aommm', MAPBOX_THEME_ID, features=[geoJson])
	if (response.status_code != 200):
		print("Got a non-200 response from Mapbox for " + filename + ": " + str(response.content))
	else:
		with open(filename, 'wb') as output:
			_ = output.write(response.content)
			print("Wrote file to " + filename)


sf = shapefile.Reader("shape_svenska_210505/KommunSweref99TM.zip", encoding="latin1")
shapeRecs = sf.shapeRecords()
for shapeRec in shapeRecs:
	geoJson = shapeRec.__geo_interface__
	kommunCode = shapeRec.record[0]
	kommunName = shapeRec.record[1]
	filename = "../public/images/countries/"+ kommunName + FILE_SUFFIX + ".png"
	writeImage(geoJson, filename)
	


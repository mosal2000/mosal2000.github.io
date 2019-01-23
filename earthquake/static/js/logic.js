var url =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake

  function onEachFeature(feature, layer) {
    layer.bindPopup(
      '<h3>' +
        'Magnitude: ' +
        feature.properties.mag +
        '</h3><hr> <b>' +
        feature.properties.place +
        '</b><br>' +
        new Date(feature.properties.time) +
        ''
    );
  }

  function circleColor(magnitude) {
    var color = '';
    if (magnitude > 5) {
      color = 'Red';
    } else if (magnitude > 4) {
      color = 'DarkOrange';
    } else if (magnitude > 3) {
      color = 'Orange';
    } else if (magnitude > 2) {
      color = '#ffe066';
    } else if (magnitude > 1) {
      color = '#ccff33';
    } else {
      color = '#aed75b';
    }
    return color;
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, layer) {
      return L.circleMarker(layer, {
        radius: feature.properties.mag * 3,
        fillColor: circleColor(feature.properties.mag),
        color: 'grey',
        weight: 1,
        opacity: 0.75,
        fillOpacity: 0.75
      });
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define lightmap and darkmap layers
  var lightmap = L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.light',
      accessToken: API_KEY
    }
  );

  var satellitemap = L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.satellite',
      accessToken: API_KEY
    }
  );

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    'Light Map': lightmap,
    'Satelite Map': satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map('map', {
    center: [37.09, 0],
    zoom: 2,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false
    })
    .addTo(myMap);
}

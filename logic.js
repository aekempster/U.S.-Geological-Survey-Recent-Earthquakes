var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
var mapboxToken = "pk.eyJ1IjoiYWtlbXBzdGVyIiwiYSI6ImNqbThjbDlxaTB5YzQzcXFxZXkxYWx1eWwifQ.nef5A_ZVogRvCzqPwJWVtg"
var mapboxURL = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?"

d3.json(URL, function (data) {
    createFeatures(data.features)
});

function chooseColor(magnitude) {
    if (magnitude < 1) {
        return "#0c905d"
    }
    else if (magnitude < 2) {
        return "#97e200"
    }
    else if (magnitude < 3) {
        return "#FFC300"
    }
    else if (magnitude < 4) {
        return "#FF5733"
    }
    else if (magnitude < 5) {
        return "#c70007"
    }
    else if (magnitude < 6) {
        return "#900c1e"
    }
    else {
        return "#581845"
    };
};

function createFeatures(data) {
    function onEachFeature(feature, layer) {
        var months = ['Jan','Feb','Mar','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat']


        var quakeTime = new Date(feature.properties.time);

        layer.bindPopup(`<strong>Location: ${feature.properties.place}</strong>
            <hr>
            Magnitude: ${feature.properties.mag}
            <br>
            Time: ${quakeTime}`);
    };

    var earthquakes = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: Math.pow(1.88,feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                color: "#000",
                weight: .2,
                opacity: .7,
                fillOpacity: 0.7
            });
        },
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
    var map = L.tileLayer(`${mapboxURL}access_token=${mapboxToken}`);
    var myMap = L.map("map", {
        center: [20, -20],
        zoom: 2.9,
        layers: [map, earthquakes]
    });
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            intensity = [0, 1, 2, 3, 4, 5, 6],
            labels = [];

        for (var i = 0; i < intensity.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(intensity[i]) + '"></i> ' +
                intensity[i] + (intensity[i + 1] ? '&ndash;' + intensity[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
};

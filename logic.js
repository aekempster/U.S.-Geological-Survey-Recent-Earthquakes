var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
var mapboxKey = "pk.eyJ1IjoiYWtlbXBzdGVyIiwiYSI6ImNqbThjbDlxaTB5YzQzcXFxZXkxYWx1eWwifQ.nef5A_ZVogRvCzqPwJWVtg"
var mapboxURL = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?"

d3.json(URL, function (data) {
    createFeatures(data.features)
});

function chooseColor(magnitude) {
    if (magnitude < 1) {
        return "#4FFF2F"
    }
    else if (magnitude < 2) {
        return "#BAFF2F"
    }
    else if (magnitude < 3) {
        return "#FFC300"
    }
    else if (magnitude < 4) {
        return "#FF5733"
    }
    else if (magnitude < 5) {
        return "#C70039"
    }
    else if (magnitude < 6) {
        return "#900C3F"
    }
    else {
        return "#581845"
    };
};

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        var months = ['Jan','Feb','Mar','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var days = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat']
        var timestamp = new Date(feature.properties.time);
        var day = days[timestamp.getDay()];
        var month = months[timestamp.getMonth()];
        var date = timestamp.getDate();
        var hours = timestamp.getHours();
        var minutes = "0" + timestamp.getMinutes();
        var formattedTime = day + ", " + month + " " + date + " " + hours + ':' + minutes.substr(-2);

        layer.bindPopup(`<strong>Location: ${feature.properties.place}</strong>
            <hr>
            Magnitude: ${feature.properties.mag}
            <br>
            Time: ${formattedTime}`);
    };

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: Math.pow(2,feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
    var streetmap = L.tileLayer(`${mapboxURL}access_token=${mapboxKey}`);
    var myMap = L.map("map", {
        center: [20, -20],
        zoom: 2.5,
        layers: [streetmap, earthquakes]
    });
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5, 6],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
};

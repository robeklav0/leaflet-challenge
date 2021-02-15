// console.log("it's working")

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  // Once we get a response, send the data.features object to the createMap function
  createMap(data.features);
});

function createMap(earthquakeData) {

    // Loop through locations and markers
      EarthquakeMarkers = earthquakeData.map((feature) =>
        L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
            radius: magSize(feature.properties.mag),
            stroke: true,
            color: 'black',
            opacity: 1,
            weight: 0.5,
            fill: true,
            fillColor: cirColor(feature.properties.mag),
            fillOpacity: 0.9   
        })
        .bindPopup("<h1> Magnitude : " + feature.properties.mag +
        "</h1><hr><h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
      )

      // Add the earthquakes layer
      let quakes=L.layerGroup(EarthquakeMarkers)
      let mags = earthquakeData.map((d) => magSize(+d.properties.mag));
      //  console.log(d3.extent(mags));
      //  console.log(mags);
    

  // Define basemap layer
  let basemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Create  map, with basemap and quakes layers
  let myMap = L.map("map", {
    center: [ 4.7110, -74.0721 ],
    zoom: 3,
    layers: [basemap, quakes]
  });

// Add legend to the map
let legend = L.control({ position: "bottomright" });

legend.onAdd = function(){
    let div = L.DomUtil.create("div","info legend");
    
  let grades = [1, 2, 3, 4, 5, 6,];
  let colors = [
    "#ffffb2",
    "#fecc5c",
    "#fd8d3c",
    "#f03b20",
    "#bd0026",
    "#bd0027"
  ];

  for (let i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
    + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

    return div;
}

legend.addTo(myMap);

}
// Function for circle's color

     function cirColor(mag) {
      let color = "";
      if (mag <= 2) { color = "#ffffb2"; }
      else if (mag <= 3) {color = "#fecc5c"; }
      else if (mag <= 4) { color = "#fd8d3c"; }
      else if (mag <= 5) {color = "#f03b20"; }
      else { color = "#bd0026"; }
    
    return color;
    
    };
// Function for circle size

function magSize(mag){
  if (mag <= 1){
      return 3
  }
  return mag * 3;
}
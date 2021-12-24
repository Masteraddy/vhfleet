var map = L.map("map").setView([8.155, 4.267], 12);
var tiles = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(map);

var carIcon = L.icon({
  iconUrl: "car.png",
  iconSize: [38, 38],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

var markers = [];

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos) => {
    map.setView([pos.coords.latitude, pos.coords.longitude], 12);
    let yourmarker = L.marker([pos.coords.latitude, pos.coords.longitude])
      .addTo(map)
      .bindPopup(`Your Location`);
  });
}

fetch(`${location.origin}/vehicle/location`)
  .then((res) => res.json())
  .then((data) => {
    data.forEach((dt) => {
      markers[dt.vehicle] = L.marker([dt.latitude, dt.longitude], { icon: carIcon })
        .addTo(map)
        .bindPopup(`<a href="/vehicle/one/${dt.vehicle}">Car ID${dt.vehicle}</a>`);
    });
  })
  .catch((err) => console.error(err));

setInterval(() => {
  fetch(`${location.origin}/vehicle/location`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((dt) => {
        markers[dt.vehicle].setLatLng([dt.latitude, dt.longitude]);
      });
    })
    .catch((err) => console.error(err));
}, 5000);

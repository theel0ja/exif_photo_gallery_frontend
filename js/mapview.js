const API_SERVER = "https://api.gallery-demo.theel0ja.info/";


const map = L.map("map", {
  maxZoom: 17
});

// map.setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
}).addTo(map);

var photoLayer = L.photo.cluster({ spiderfyDistanceMultiplier: 1.2 }).on('click', function (evt) {
  evt.layer.bindPopup(L.Util.template('<a href="{url}"><img src="{url}"/></a><p>{caption}</p>', evt.layer.photo), {
    className: 'leaflet-popup-photo',
    minWidth: 400
  }).openPopup();
});

function openInOsmButton(location) {
  const osmLink = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}&zoom=16&layers=M`;

  return `<a href="${osmLink}">Open in OpenStreetMap</a>`
}

fetch(API_SERVER)
  .then((response) => response.json())
  .then((files) => {
    const photos = [];

    files.forEach((file) => {
      if(file.location.lat != null && file.location.lon != null) {
        const url = API_SERVER + file.file_name;
        
        photos.push({
          lat: file.location.lat,
          lng: file.location.lon,
          thumbnail: url, // thumbnail picture
          url: url, // Full sized url
          caption: `Filename: ${ file.file_name.replace("images/", "") }<br><a href="${url}">Open in full size</a><br>` + openInOsmButton(file.location)
        });
      }
    });

    console.log(photos)

    photoLayer.add(photos).addTo(map);
    map.fitBounds(photoLayer.getBounds());
  });
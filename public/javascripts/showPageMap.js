mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: divesite.geometry.coordinates,
    zoom: 10
});

new mapboxgl.Marker()
    .setLngLat(divesite.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${divesite.title}</h3><p>${divesite.location}</p>`
            )
    )
    .addTo(map)
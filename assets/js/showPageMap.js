mapboxgl.accessToken = 'pk.eyJ1Ijoienlncm9tZWNvZGVzIiwiYSI6ImNrcW9pZWRpZzA0NnoycmxjZXczdWFoejEifQ.gpNeTaurFG9MUmWhSKilFQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campGeometry, // starting position [lng, lat]
    zoom: 4 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(campGeometry)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campTitle}</h3><p>campLocation</p>`
            )
    )
    .addTo(map);


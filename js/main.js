// map 1
mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0ZXNhZSIsImEiOiJjbHMxNDdnbHUwODdsMmpwNWliYzZzOGdjIn0.eK5A1j3I8VWSkpZhnBV9EA';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3.5, // starting zoom
    center: [-100, 38.5], // starting center
    projection: 'albers'
});

async function geojsonFetch() { 
    // other operations
    let response = await fetch('assets/us-covid-2020-rates.json');
    let covid_rates_data = await response.json();
    map.on('load', function loadingData() {
        // add layer
        // add legend
        map.addSource('covid_rates_data', {
            type: 'geojson',
            data: covid_rates_data
        });

        map.addLayer({
            'id': 'covid_rates_data-layer',
            'type': 'fill',
            'source': 'covid_rates_data',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#ffffb2',   // stop_output_0
                    10,          // stop_input_0
                    '#fed976',   // stop_output_1
                    20,          // stop_input_1
                    '#feb24c',   // stop_output_2
                    50,          // stop_input_2
                    '#fd8d3c',   // stop_output_3
                    100,         // stop_input_3
                    '#f03b20',   // stop_output_4
                    200,         // stop_input_4
                    '#bd0026' // stop_output_5
                ],
                'fill-outline-color': '#000000',
                'fill-opacity': 0.7,
            }
        });
    });   

    const layers = [
        '0-9',
        '10-19',
        '20-49',
        '50-99',
        '100-199',
        '200-300',

    ];
    const colors = [
        '#ffffb2',
        '#fed976',
        '#feb24c',
        '#fd8d3c',
        '#f03b20',
        '#bd0026'
    ];

    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Covid-19 Rate by County<br>(Number of cases/1000 residents)</b><br><p>Sources: <a href=https://data.census.gov/table/ACSDP5Y2018.DP05?g=0100000US$050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&hidePreview=true>2018 ACS 5 Year Estimate</a> & <a href=https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html> US Census Bureau </p><br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });

    map.on('mousemove', ({point}) => {
        const covid_rate = map.queryRenderedFeatures(point, {
            layers: ['covid_rates_data-layer']
        });
        document.getElementById('text-description').innerHTML = covid_rate.length ?
            `<h3>${covid_rate[0].properties.county}, ${covid_rate[0].properties.state}</h3><p>Covid-19 Rate:<em><strong>${covid_rate[0].properties.rates}` :
            `<p>Created By Katelyn Saechao <p> Colors on the map display the Covid-19 rates within a given county. These were calculated by number of cases per 1000 residents. Hover over a county to see its Covid-19 rate!</p>`;
    });  
}
geojsonFetch();


function addData(chart, label, data) {
    // chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();  
}

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
};

$(document).ready(function(){
    let a
 })

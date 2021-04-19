function addData(chart, label, data) {
    // chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();  
}

function geocodeAddress(geocoder, resultsMap, address) {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}
let map;
var geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
    });
    geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, "Владивосток, Державина 15")
};



$(document).ready(function(){

    
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0', '1', '2', '3', '4', '5'],
            datasets: [{
                label: 'Неподходят',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    });

    var ctx1 = document.getElementById('myChart1').getContext('2d');
    var myChart1 = new Chart(ctx1, {
        type: 'horizontalBar',
        data: {
            labels: ['Город', 'Образование', 'Профессия', 'Навыки', 'Ограничения'],
            datasets: [{
                label: 'Подходят по параметру',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    });


    $(":input").on("change", function(e){
        e.preventDefault();
        var id_disability = $("#id_disability").val();
        var id_city = $("#id_city").val();
        var id_education = $("#id_education").val();
        var id_profession = $("#id_profession").val();
        var id_skill = $("#id_skill").val();

        var data = {id_disability, id_city, id_education, id_profession, id_skill};
        console.log(data)
        $.ajax({
            type : 'GET',
            url :  '/personal_area/firm/',
            data : data,
            success : function(response){
                tempDict = [];
                console.log(response.user_info);
                addData(myChart, 0, response.user_info.prof_desc)
                Object.keys(response.user_info.target_mismatches).forEach(function(key) {
                    tempDict.push(response.user_info.target_mismatches[key]);
                 });
                 addData(myChart1, 0, tempDict)
            },
            error : function(response){
                console.log(response)
            }
        })
    })


    $("#id_profession").on("change", function(e){
        e.preventDefault();
        var id_profession = $("#id_profession").val();
        var data = {id_profession};
        
        $.ajax({
            type : 'GET',
            url :  '/test_page/test_update/',
            data : data,
            success : function(response){
                tempDict = [];
                console.log(response.user_info);
                $('#id_disability option:selected').removeAttr('selected');
                for (i in response.user_info){
                    $("#id_disability option[value=" + response.user_info[i] + "]").attr('selected','selected');
                }

            },
            error : function(response){
                console.log(response)
            }
        })
    })


    $("#id_relocation_check").click(function(e){
        var vis = (this.checked) ? "block" : "none";
        document.getElementById('div_id_region_relocation').style.display = vis;
    })
 })

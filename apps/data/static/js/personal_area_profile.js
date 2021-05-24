function addData(chart, label, data) {
    // chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();  
}



var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Полностью подходят', 'Подходит по городу для переезда', 'Подходит по смежной профессии', 'Надо переехать и переобучиться'],
        datasets: [{
            label: 'Подходите',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
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

let map;
var geocoder;
var markersArray = [];

function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}

function geocodeAddress(geocoder, resultsMap, address, image= "https://icons.iconarchive.com/icons/chanut/role-playing/128/King-icon.png", size1 = 70, size2 = 70, resultTitle='Noname', description="You Firm place", checkCenter = false) {
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            if (checkCenter){
                resultsMap.setCenter(results[0].geometry.location);
            }            
            marker = new google.maps.Marker({
            map: resultsMap,
            title: resultTitle,  
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: {url:image, scaledSize: new google.maps.Size(size1, size2)}, 
            
            });
            const contentString =
                '<div id="content">' +
                '<div id="siteNotice">' +
                "</div>" +
                '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
                '<div id="bodyContent">' +
                "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
                "sandstone rock formation in the southern part of the " +
                "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
                "south west of the nearest large town, Alice Springs; 450&#160;km " +
                "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
                "features of the Uluru - Kata Tjuta National Park. Uluru is " +
                "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
                "Aboriginal people of the area. It has many springs, waterholes, " +
                "rock caves and ancient paintings. Uluru is listed as a World " +
                "Heritage Site.</p>" +
                '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
                "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
                "(last visited June 22, 2009).</p>" +
                "</div>" +
                "</div>";
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
            });
            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });
            markersArray.push(marker);
            // map.setCenter(marker);
        } else {
            console.log("Geocode was not successful for the following reason: " + status + resultTitle + address);
        }
    });
}

function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
        mapId: '4c6f35280440418d'
    });
    geocoder = new google.maps.Geocoder();
    // geocodeAddress(geocoder, map, "Владивосток, Державина 15")
};

function showInfoWorkPlace(id){
    var id_city = $("#id_city").val();
    var id_education = $("#id_education").val();
    var id_profession = $("#id_profession").val();
    var id_skill = $("#id_skills").val();
    data={"id": id, "id_city": id_city, "id_education": id_education, "id_profession": id_profession, "id_skill": id_skill}
    $.ajax({
        type : 'GET',
        url :  '/personal_area/profile/show_info',
        data : data,
        success : function(response){
            tempStr =  `<div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title">${response.place_info["Наименование"][0]}</h4>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <table class="table">
                                                <tbody>
                        `
                                                
            $.each(response.place_info, function(key,data){
                if(data.length == 1){
                    tempStr += `<tr>
                        <th scope="row">
                            ${key}
                        </th>
                            <td>${data[0]}</td>
                        </tr>`            
                } else {
                    ul_list = `<ul>`
                    $.each(data, function(key1,data1){
                        ul_list +=`<li>${data1}</li>`
                    })
                    ul_list +=`</ul>`
                    tempStr += `<tr>
                        <th scope="row">
                            ${key}
                        </th>
                            <td>${ul_list}</td>
                        </tr>` 
                }
                
            });
            tempStr += `</tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary"  onclick='saveLike(${id}, 3)'>Готов обучиться</button>
                        </div>
                    </div>
                </div>`

            let Modal = document.createElement('div')
            Modal.className = "modal fade"
            Modal.id = "myModalBox"
            Modal.innerHTML = tempStr 
            document.getElementById("chart_div").after(Modal)
            $('#myModalBox').modal('show')
            console.log(response)
        },
        error : function(response){
            console.log(response)
        }
    })
};

var list_workplace
function updateData(){

    var id_city = $("#id_city").val();
    var id_city_to_move = $("#id_city_to_move").val();
    var id_education = $("#id_education").val();
    var id_profession = $("#id_profession").val();
    var id_work_experience = $("#id_work_experience").val();
    var id_skill = $("#id_skills").val();
    var id_sort_by = $('#id_sort_by').val();
    var check_proffession = $('#check_proffession:checked').val();
    var check_city_move = $('#check_city_move:checked').val();

    var data = {id_city, id_city_to_move, id_education, id_profession, id_work_experience, id_skill, id_sort_by, check_proffession, check_city_move};
    console.log(data)
    $.ajax({
        type : 'GET',
        url :  '/personal_area/profile/',
        data : data,
        success : function(response){
            console.log(response);

            tempDict = [];
            Object.keys(response.place_info.target_mismatches).forEach(function(key) {
                tempDict.push(response.place_info.target_mismatches[key]);
            });
            addData(myChart, 0, tempDict)

            while(document.getElementById("boxWork")){
                document.getElementById("boxWork").remove()
            }
            markersArray.length = 0;

            list_workplace = response.place_info.work_place
            $.each(response.place_info.work_place, function(key,data) {
                geocodeAddress(geocoder, map, data['position'], "https://icons.iconarchive.com/icons/artdesigner/webtoys/64/Home-icon.png", 40, 40, data['name'], data)
            
                let block_work_place = document.createElement('div')
                block_work_place.id = "boxWork"
                if (data["checkPlace"] == 1){
                    block_work_place.className = "row border border-success mt-1"
                    approach = "Подходит по профессии"
                } else if(data["checkPlace"] == 2){
                    block_work_place.className = "row border border-warning mt-1"
                    approach = "Подходит по смежной профессии"
                } else if(data["checkPlace"] == 3){
                    block_work_place.className = "row border border-warning mt-1"
                    approach = "Подходит по профессии, но требуется переезд"
                } else if(data["checkPlace"] == 4){
                    block_work_place.className = "row border border-warning mt-1"
                    approach = "Подходит по смежной профессии, но требуется переезд"
                }
                
                block_work_place.innerHTML =    `<div class='col'><text id=place_${data['id']} ' >${data['name']}</text></div>\
                                                <div class='col'>\
                                                    <p class='text-right'>Зарплата: </p>\
                                                </div>\                                
                                                <div class='col'>\
                                                    <p class='text'>${data['min_salary']} - ${data['max_salary']}</p>\
                                                </div>\
                                                <div class='col'>\
                                                    <p class='text-right'>${approach}</p>\
                                                </div>\
                                                <div class='w-100'></div>\
                                                <div class='col-4'>\
                                                    ${data['profession']}\
                                                </div>\
                                                <div class='col-4'>\
                                                    <p class='text-right'>Адрес: ${data['position']}</p>\
                                                </div>\
                                                <div class='col-2'>\
                                                </div>\
                                                <div class='col-2'>\
                                                    <div class="btn-group btn-group-toggle" data-toggle="buttons" onclick='showInfoWorkPlace(${data['id']})'>\
                                                        <label class="btn btn-primary active">\
                                                        <input type="checkbox" name="options" autocomplete="off" checked> Like\
                                                    </label>\
                                                    </div>\
                                                </div>
                                                    `
                document.getElementById("filters").after(block_work_place)
                
            });

            var location =  response.place_info.city + ', ' + $("#id_location").val();
            geocodeAddress(geocoder, map, location, "https://icons.iconarchive.com/icons/artdesigner/webtoys/64/User-male-icon.png", 40, 40, 'Вы', data, checkCenter=true)
        },
        error : function(response){
            console.log(response)
        }
    })
}


$(document).ready(function(){
    setTimeout(function() {
        updateData();
    }, 10);
    
    $(":input").on("change", function(e){
        clearOverlays();
        e.preventDefault();
        updateData();
    })
 })


function saveLike(idW, idU){
    var idWorkplace = idW;
    var idUser = idU;

    var data = {idWorkplace, idUser};
    console.log(data)
    $.ajax({
        type : 'GET',
        url :  '/personal_area/profile/like',
        data : data,
        success : function(response){
            console.log('Complete');
        },
        error : function(response){
            console.log(response)
        }
    })
};

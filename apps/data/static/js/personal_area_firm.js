function addData(chart, label, data) {
    // chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();  
}

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Полностью подходят', 'Город', 'Профессия', 'Город и профессия', 'Ограничения'],
        datasets: [{
            label: 'Не подходят по',
            data: [0, 0, 0, 0, 0, 0],
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



var selectedValuesLiked = [];
function selectElement(id, valueToSelect) {    
    console.log(id, valueToSelect)
    let element = document.getElementById(id);

    id = '#'+id;
    if (selectedValuesLiked.includes(valueToSelect)){
        selectedValuesLiked.splice(selectedValuesLiked.indexOf(valueToSelect), 1);
    }
    else{
        selectedValuesLiked.push(valueToSelect);
    }
    // $(id).val(selectedValuesLiked).Trigger('change');
    $.each(selectedValuesLiked, function(i,e){
        tstr = id + " option[value=" + e + "]"
        console.log(tstr, selectedValuesLiked)
        $(tstr).prop("selected", true);
    });
    // element.options[valueToSelect].selected= valueToSelect;
}

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
                // resultsMap.zoom = 15;
            }            
            marker = new google.maps.Marker({
                map: resultsMap,
                title: resultTitle,  
                position: results[0].geometry.location,
                // animation: google.maps.Animation.DROP,
                icon: {url:image, scaledSize: new google.maps.Size(size1, size2)}, 
            });
            const contentString =
                '<div id="content">' +
                '<div id="siteNotice">' +
                "</div>" +
                '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
                '<div id="bodyContent">' +
                "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
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
        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
            console.log("Waiting for Limit for item: "+ address);
            setTimeout(function () {
                geocodeAddress(geocoder, resultsMap, address, image, size1, size2, resultTitle, description, checkCenter)
            }, 100);
       } else {
            console.log("Geocode was not successful for the following reason: " + status + resultTitle + address);
        }
    });
}


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
        mapId: '4c6f35280440418d'
    });
    geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, "Владивосток, Державина 15")
};


function updateData(){
    var id_disability = $("#id_disability").val();
    var id_city = $("#id_city").val();  
    var id_education = $("#id_education").val();
    var id_profession = $("#id_profession").val();
    var id_skill = $("#id_skill").val();
    var check_disability = $('#check_disability:checked').val();
    var check_proffession = $('#check_proffession:checked').val();
    var check_city_move = $('#check_city_move:checked').val();
    var id_dysfunctions_body = $('#id_dysfunctions_body').val();
    var id_restrictions_categories_life = $('#id_restrictions_categories_life').val();
    var data = {id_disability, id_city, id_education, id_profession, id_skill, check_disability, check_proffession, check_city_move, id_restrictions_categories_life, id_dysfunctions_body};
    console.log(data)
    
    $.ajax({
        type : 'GET',
        url :  '/personal_area/firm/',
        data : data,
        success : function(response){
            tempDict = [];
            console.log(response);
            // $('#id_disability option:selected').removeAttr('selected'); //разобраться потом, код для автоматического добавления ограничений
            // for (i in response.user_info){
            //     $("#id_disability option[value=" + response.user_info[i] + "]").attr('selected','selected');
            // }
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
                geocodeAddress(geocoder, map, data['position'], "https://icons.iconarchive.com/icons/artdesigner/webtoys/64/User-male-icon.png", 40, 40, data['name'], data)
            
                let block_work_place = document.createElement('div')
                block_work_place.id = "boxWork"
                if (data["checkPlace"] == 1){
                    block_work_place.className = "row border border-success mt-1"
                    approach = "Подходит полностью"
                } else if(data["checkPlace"] == 2){
                    block_work_place.className = "row border border-warning mt-1"
                    approach = "Подходит по смежной профессии"
                } else if(data["checkPlace"] == 3){
                    block_work_place.className = "row border border-warning mt-1"
                    approach = "Подходит по профессии, но требуется переезд"
                } else if(data["checkPlace"] == 4){
                    block_work_place.className = "row border border-warning mt-1"
                    approach = "Подходит по смежной профессии, но требуется переезд"
                }   else if(data["checkPlace"] == 5){
                    block_work_place.className = "row border border-danger mt-1"
                    approach = "Вы исключили по инвалидности"
                }
                
                block_work_place.innerHTML =    `<div class='col'><text id=place_${data['id']} ' >${data['name']}</text></div>\
                                                <div class='col'>\
                                                    <p class='text-right'></p>\
                                                </div>\                                
                                                <div class='col'>\
                                                    <p class='text-right'>${approach}</p>\
                                                </div>\
                                                <div class='w-100'></div>\
                                                <div class='col-4'>\

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
            geocodeAddress(geocoder, map, location, "https://icons.iconarchive.com/icons/artdesigner/webtoys/64/Home-icon.png", 40, 40, data['name'], data, checkCenter=true)
        },
        error : function(response){
            console.log(response)
        }
    })
}


function showInfoWorkPlace(id){
    var id_disability = $("#id_disability").val();
    var id_city = $("#id_city").val();  
    var id_education = $("#id_education").val();
    var id_profession = $("#id_profession").val();
    var id_skill = $("#id_skill").val();
    var id_dysfunctions_body = $('#id_dysfunctions_body').val();
    var id_restrictions_categories_life = $('#id_restrictions_categories_life').val();
    var data = {id, id_disability, id_city, id_education, id_profession, id_skill, id_restrictions_categories_life, id_dysfunctions_body};
    console.log(data)
    
    $.ajax({
        type : 'GET',
        url :  '/personal_area/firm/show_info',
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
                            <button type="button" class="btn btn-primary"  onclick='selectElement("id_profile_liked", ${id})'>Принять</button>
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

var list_user = []
var city;
function showInfoUser(id){
    $.each(list_user, function(key,data){
        if (data["user_id"] == id){
            console.log(data)

            list_skill = data['skill']
            list_skill_check = data['skillCheck']
            ul_list_skill = `<ul>`
            $.each(list_skill, function(key,skill){
                check_box = '-'
                if (list_skill_check[key]){
                    check_box = '+'
                }
                ul_list_skill +=`<li>${skill} ${check_box}</li>`
            });
            ul_list_skill +=`</ul>`


            list_disability = data['disability']
            list_disability_check = data['disabilityCheck']
            ul_list_disability = `<ul>`
            $.each(list_disability, function(key,disability){
                check_box = '+'
                if (list_skill_check[key]){
                    check_box = '-'
                }
                ul_list_disability +=`<li>${disability} ${check_box}</li>`
            });
            ul_list_disability +=`</ul>`


            list_profession = data['profession']
            ul_list_profession = `<ul>`
            $.each(list_profession, function(key,profession){
                ul_list_profession +=`<li>${profession}</li>`
            });
            ul_list_profession +=`</ul>`


            if (data['city'] == city){
                city_check = true
            } else{
                city_check = false
            }

            if (data['educationCheck']){
                education_check = true
            } else{
                education_check = false
            }

            if (data['desired_salary']){
                desired_salary = data['desired_salary']
            } else{
                desired_salary = "Не указано"
            }

            let Modal = document.createElement('div')

            Modal.className = "modal fade"
            Modal.id = "myModalBox"
            Modal.innerHTML =  `<div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title">${data['name']}</h4>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <table class="table">
                                                <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        Фамилия и имя
                                                    </th>
                                                    <td>${data['name']}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Город
                                                    </th>
                                                    <td>${data['city']}</td>
                                                    <td>${city_check}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Адресс
                                                    </th>
                                                    <td>${data['position']}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Образование
                                                    </th>
                                                    <td>${data['education']}</td>
                                                    <td>${education_check}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Профессии по образованию
                                                    </th>
                                                    <td>${ul_list_profession}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Ключевые навыки
                                                    </th>
                                                    <td>${ul_list_skill}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Ограничения
                                                    </th>
                                                    <td>${ul_list_disability}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Желаемая зарплата
                                                    </th>
                                                    <td>${desired_salary}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary">Готов обучить</button>
                                        </div>
                                    </div>
                                </div>`
            document.getElementById("myChart1").after(Modal)
            $('#myModalBox').modal('show')
        }
    }); 
};





$(document).ready(function(){
    $('.selectmultiple').toggleClass('selectmultiple selectpicker');
    // $('.selectmultiple form-control').addClass('selectpicker').removeClass('selectmultiple form-control');
    // $('.mdb-select').formSelect();

    
   

    $(":input").on("change", function(e){
        e.preventDefault();
        clearOverlays();
        updateData();
    })

    // $("#id_profession").on("change", function(e){
    //     e.preventDefault();
    //     console.log($("#id_profession").val())
    //     // tstr = id + " option[value=" + e + "]"
    //     // console.log(tstr, selectedValuesLiked)
    //     // $(tstr).prop("selected", true);
    // })


    // $("#id_profession").on("change", function(e){
    //     e.preventDefault();
    //     updateData();
    // })
 })

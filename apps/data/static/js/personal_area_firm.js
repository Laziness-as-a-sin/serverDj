function addData(chart, label, data) {
    // chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();  
}

var selectedValuesLiked = [];
function selectElement(id, valueToSelect) {    
    // console.log(id, valueToSelect)
    let element = document.getElementById(id);

    id = '#'+id;
    if (selectedValuesLiked.includes(valueToSelect)){
        selectedValuesLiked.splice(selectedValuesLiked.indexOf(valueToSelect), 1);
    }
    else{
        selectedValuesLiked.push(valueToSelect);
    }
    $(id).val(selectedValuesLiked);
    // element.options[valueToSelect].selected= valueToSelect;
}



let map;
var geocoder;
var markersArray = [];

function geocodeAddress(geocoder, resultsMap, address, image= "https://icons.iconarchive.com/icons/chanut/role-playing/128/King-icon.png", size1 = 70, size2 = 70, resultTitle='Noname', description="You Firm place") {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        // resultsMap.setCenter(results[0].geometry.location);
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
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
    });
    geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, "Владивосток, Державина 15")
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
                var location =  response.user_info.city + ', ' + $("#id_location").val();
                city = response.user_info.city;
                console.log(response);
                addData(myChart, 0, response.user_info.prof_desc)
                Object.keys(response.user_info.target_mismatches).forEach(function(key) {
                    tempDict.push(response.user_info.target_mismatches[key]);
                });
                addData(myChart1, 0, tempDict)

                while(document.getElementById("boxUserGood")){
                    document.getElementById("boxUserGood").remove()
                }

                while(document.getElementById("boxUserWrong")){
                    document.getElementById("boxUserWrong").remove()
                }

                for (var i = 0; i < markersArray.length; i++ ) {
                    markersArray[i].setMap(null);
                }
                markersArray.length = 0;

                var approach
                list_user = response.user_info.users_all
                var counter = 0
                $.each(response.user_info.users_all, function(key,data) {
                    let block_user = document.createElement('div')
                    if (data["checkUser"] == 2){
                        geocodeAddress(geocoder, map, data['position'], "https://icons.iconarchive.com/icons/chanut/role-playing/128/Villager-icon.png", 40, 40, data)
                        approach = "Подходит по профессии"
                        block_user.className = "row border border-primary mt-1"
                        block_user.id = "boxUserGood"
                    } else{
                        geocodeAddress(geocoder, map, data['position'], "https://icons.iconarchive.com/icons/chanut/role-playing/1024/Grim-Reaper-icon.png", 40, 40, data['name'], data)
                        block_user.className = "row border border-warning mt-1"
                        block_user.id = "boxUserWrong"
                        approach = "Подходит по смежной профессии"
                    }


                    block_user.innerHTML =    `<div class='col'><text id=user_${data['user_id']} onclick='showInfoUser(${data['user_id']})'>${data['name']}</text></div>\
                                                        <div class='col'>\
                                                            <p class='text-right'>${approach}</p>\
                                                        </div>\
                                                        <div class='w-100'></div>\
                                                        <div class='col'>\
                                                            ${data['profession']}\
                                                        </div>\
                                                        <div class='col'>\
                                                            <p class='text-right'>Адрес: ${data['position']}</p>\
                                                        </div>\
                                                        <div class='col'>\
                                                            <div class="btn-group btn-group-toggle" data-toggle="buttons" onclick='selectElement("id_profile_liked", ${data['user_id']})'>\
                                                                <label class="btn btn-primary active">\
                                                                <input type="checkbox" name="options" autocomplete="off" checked> Like\
                                                            </label>\
                                                            </div>\
                                                        </div>
                                                        `
                    if (data["checkUser"] == 2){
                        document.getElementById("mapRow").after(block_user)
                    }
                    else{
                        if (document.getElementById("boxUserGood")){
                            document.getElementById("boxUserGood").after(block_user)
                        }
                        else{
                            document.getElementById("mapRow").after(block_user)
                        }
                        
                    }

                    // document.getElementsByClassName('btn-group btn-group-toggle')[counter]
                    //     .addEventListener('click', function (event) {
                    //         alert('Hi!');
                    //         selectElement('id_profile_liked', data['user_id']);
                    //     });
                    // counter += 1;
                });


                geocoder.geocode({ address: location }, (results, status) => {
                    if (status === "OK") {
                      map.setCenter(results[0].geometry.location);
                      marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        animation: google.maps.Animation.DROP,
                        title: 'Местоположение вас',
                        icon: {url:"https://icons.iconarchive.com/icons/chanut/role-playing/128/King-icon.png", scaledSize: new google.maps.Size(70, 70)}, 
                        
                      });
                      markersArray.push(marker);
                    } else {
                      alert("Geocode was not successful for the following reason: " + status);
                    }
                });
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

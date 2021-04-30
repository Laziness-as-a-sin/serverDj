function addData(chart, label, data) {
    // chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();  
}

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
let map;
var geocoder;
var markersArray = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
    });
    geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, "Владивосток, Державина 15")
};


function showInfoWorkPlace(WorkPlace){
    // console.log(WorkPlace)

    // let Modal = document.createElement('div')

    // Modal.className = "modal fade"
    // Modal.id = "myModalBox"
    // Modal.innerHTML =  `<div class="modal-dialog" role="document">
    //                         <div class="modal-content">
    //                             <div class="modal-header">
    //                                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    //                                     <span aria-hidden="true">&times;</span>
    //                                 </button>
    //                                 <h4 class="modal-title">Modal title</h4>
    //                             </div>
    //                             <div class="modal-body">
    //                                 <p>One fine body&hellip;</p>
    //                             </div>
    //                             <div class="modal-footer">
    //                                 <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    //                                 <button type="button" class="btn btn-primary">Save changes</button>
    //                             </div>
    //                         </div>
    //                     </div>`
    // document.getElementById("chart_div").after(Modal)
    // $('#myModalBox').modal(options)
    
};

$(document).ready(function(){

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ограничения', 'Город', 'Образование', 'Профессия', 'Навыки'],
            datasets: [{
                label: 'Подходите',
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


    $(":input").on("change", function(e){
        e.preventDefault();

        var id_disability = $("#id_disability").val();
        var id_city = $("#id_city").val();
        var id_education = $("#id_education").val();
        var id_profession = $("#id_profession").val();
        var id_skill = $("#id_skills").val();

        var data = {id_disability, id_city, id_education, id_profession, id_skill};
        // console.log(data)
        $.ajax({
            type : 'GET',
            url :  '/personal_area/profile/',
            data : data,
            success : function(response){
                tempDict = [];
                console.log(response);
                addData(myChart, 0, response.place_info.prof_desc)
                Object.keys(response.place_info.target_mismatches).forEach(function(key) {
                    tempDict.push(response.place_info.target_mismatches[key]);
                });
                addData(myChart, 0, tempDict)

                while(document.getElementById("idtest")){
                    document.getElementById("idtest").remove()
                }

                while(document.getElementById("boxWorkPlaceGood")){
                    document.getElementById("boxWorkPlaceGood").remove()
                }

                while(document.getElementById("boxWorkPlaceWrong")){
                    document.getElementById("boxWorkPlaceWrong").remove()
                }

                for (var i = 0; i < markersArray.length; i++ ) {
                    markersArray[i].setMap(null);
                }
                markersArray.length = 0;

                // $.each(response.place_info.work_places_info,function(key,data) {
                //     // console.log(data);

                    
                //     let block_user_workplace = document.createElement('div')
                //     block_user_workplace.className = "row border border-primary"
                //     block_user_workplace.id = "idtest"
                //     block_user_workplace.innerHTML =    `<div class='col'><text>${data['work_place_name']}</text></div>\
                //                                         <div class='col'>\
                //                                             <p class='text-right'>${data['work_place_min_salary']} - ${data['work_place_max_salary']}</p>\
                //                                         </div>\
                //                                         <div class='w-100'></div>\
                //                                         <div class='col'>\
                //                                             ${data['work_place_profession']}\
                //                                         </div>\
                //                                         <div class='col'>\
                //                                             <p class='text-right'>Процент совпадения: ${data['work_place_coincidence']}%</p>\
                //                                         </div>
                //                                         `
                    

                //     document.getElementById("mapRow").after(block_user_workplace)
                // });


                $.each(response.place_info.work_place, function(key,data) {
                    // geocodeAddress(geocoder, map, data['position'], "https://icons.iconarchive.com/icons/chanut/role-playing/128/Food-icon.png", 40, 40, data['name'], data)

                    let block_work_place = document.createElement('div')
                    if (data["checkPlace"] == 2){
                        block_work_place.id = "boxWorkPlaceGood"
                        block_work_place.className = "row border border-success mt-1"
                        approach = "Подходит по профессии"
                    } else{
                        block_work_place.id = "boxWorkPlaceWrong"
                        block_work_place.className = "row border border-warning mt-1"
                        approach = "Подходит по смежной профессии"
                    }
                    block_work_place.innerHTML =    `<div class='col'><text id=place_${data['place_id']} onclick="showInfoWorkPlace(${data})">${data['name']}</text></div>\
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
                                                        <div class="btn-group btn-group-toggle" data-toggle="buttons">\
                                                            <label class="btn btn-primary active">\
                                                            <input type="checkbox" name="options" autocomplete="off" checked> Like\
                                                        </label>\
                                                        </div>\
                                                    </div>
                                                        `
                    if (data["checkPlace"] == 2){
                        document.getElementById("mapRow").after(block_work_place)
                    }
                    else{
                        if (document.getElementById("boxWorkPlaceGood")){
                            document.getElementById("boxWorkPlaceGood").after(block_work_place)
                        }
                        else{
                            document.getElementById("mapRow").after(block_work_place)
                        }
                        
                    }
                    
                });

                var location =  response.place_info.city + ', ' + $("#id_location").val();
                // geocoder.geocode({ address: location }, (results, status) => {
                //     if (status === "OK") {
                //       map.setCenter(results[0].geometry.location);
                //       marker = new google.maps.Marker({
                //         map: map,
                //         position: results[0].geometry.location,
                //         animation: google.maps.Animation.DROP,
                //         title: 'Местоположение вас',
                //         icon: {url:"https://icons.iconarchive.com/icons/chanut/role-playing/128/Orc-icon.png", scaledSize: new google.maps.Size(70, 70)}, 
                        
                //       });
                //       markersArray.push(marker);
                //     } else {
                //       alert("Geocode was not successful for the following reason: " + status);
                //     }
                // });
            },
            error : function(response){
                console.log(response)
            }
        })
    })
 })

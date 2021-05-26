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

function geocodeAddress(geocoder, resultsMap, address, image= "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgYmFzZVByb2ZpbGU9InRpbnkiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iWE1MSURfMTc4XyI+PHBhdGggZD0iTTI2OC43LDQxMy42aC0yNS40Yy0yMS42LDAtMzkuMS0xNy41LTM5LjEtMzkuMXYtNTYuNmMwLTIxLjYsMTcuNS0zOS4xLDM5LjEtMzkuMWgyNS40ICAgYzIxLjYsMCwzOS4xLDE3LjUsMzkuMSwzOS4xdjU2LjZDMzA3LjgsMzk2LjEsMjkwLjMsNDEzLjYsMjY4LjcsNDEzLjZ6IiBmaWxsPSIjRURCQjk4IiBpZD0iWE1MSURfMTk4XyIvPjxwYXRoIGQ9Ik0zMDcuOCwzNzMuNnYwLjljMCwyMS42LTE3LjUsMzkuMS0zOS4xLDM5LjFoLTI1LjRjLTIxLjYsMC0zOS4xLTE3LjUtMzkuMS0zOS4xdi0wLjkgICBjLTgxLjQsMTcuNi0xNDQuOCw3MS44LTE2MS44LDEzOGMtMC4yLDAuOSwxMDcuOCwwLDIxMy42LDBjMTA1LjgsMCwyMTMuOSwwLjksMjEzLjYsMEM0NTIuNiw0NDUuNCwzODkuMiwzOTEuMiwzMDcuOCwzNzMuNnoiIGZpbGw9IiMyOUFCRTIiIGlkPSJYTUxJRF8xOTdfIi8+PGcgaWQ9IlhNTElEXzE3OV8iPjxlbGxpcHNlIGN4PSIzODUuNCIgY3k9IjIxNC43IiBmaWxsPSIjRjRDNUEyIiBpZD0iWE1MSURfMTk2XyIgcng9IjI4LjciIHJ5PSIzOS42IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjk3NzIgMC4yMTI0IC0wLjIxMjQgMC45NzcyIDU0LjM5NTIgLTc2Ljk3MDQpIi8+PGVsbGlwc2UgY3g9IjEzMS42IiBjeT0iMjE3LjIiIGZpbGw9IiNGNEM1QTIiIGlkPSJYTUxJRF8xOTVfIiByeD0iMjguNyIgcnk9IjM5LjYiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjk3NzIgMC4yMTI0IC0wLjIxMjQgLTAuOTc3MiAzMDYuMjkwNyA0MDEuNTgwOCkiLz48ZWxsaXBzZSBjeD0iMjU4LjgiIGN5PSIyMTIuMiIgZmlsbD0iI0Y0QzVBMiIgaWQ9IlhNTElEXzE5NF8iIHJ4PSIxMjMuMiIgcnk9IjE0My43Ii8+PGcgaWQ9IlhNTElEXzE4M18iPjxnIGlkPSJYTUxJRF8xODlfIj48cGF0aCBkPSJNMjgyLjEsMTc1YzIuOC01LDcuMy04LjgsMTIuMy0xMS42YzUtMi44LDEwLjgtNC40LDE2LjgtNC41YzMtMC4yLDYsMC4zLDguOSwwLjggICAgICBjMi45LDAuOSw1LjcsMS43LDguMiwzLjNjMi42LDEuMyw0LjksMy4yLDcsNS4yYzEuMSwwLjksMS45LDIuMSwyLjgsMy4zYzAuOCwxLjIsMS42LDIuMywyLjMsMy42Yy0yLjktMC42LTUuMy0xLjctNy44LTIuMyAgICAgIGMtMi41LTAuNi00LjgtMS40LTcuMi0xLjdjLTIuMy0wLjYtNC43LTAuNy02LjktMS4xYy0yLjMsMC00LjYtMC4zLTYuOS0wLjFjLTQuNiwwLjEtOS4yLDAuNy0xNC4xLDEuNiAgICAgIEMyOTIuNiwxNzIuNCwyODcuNiwxNzMuNiwyODIuMSwxNzV6IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTkzXyIvPjxnIGlkPSJYTUxJRF8xOTBfIj48Y2lyY2xlIGN4PSIzMTEuMiIgY3k9IjE5Ny40IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTkyXyIgcj0iMTQuOCIvPjxjaXJjbGUgY3g9IjMxMy43IiBjeT0iMTg2LjYiIGZpbGw9IiNGMkYyRjIiIGlkPSJYTUxJRF8xOTFfIiByPSIzLjciLz48L2c+PC9nPjxnIGlkPSJYTUxJRF8xODRfIj48cGF0aCBkPSJNMTc3LjMsMTc1YzIuOC01LDcuMy04LjgsMTIuMy0xMS42YzUtMi44LDEwLjgtNC40LDE2LjgtNC41YzMtMC4yLDYsMC4zLDguOSwwLjggICAgICBjMi45LDAuOSw1LjcsMS43LDguMiwzLjNjMi42LDEuMyw0LjksMy4yLDcsNS4yYzEuMSwwLjksMS45LDIuMSwyLjgsMy4zYzAuOCwxLjIsMS42LDIuMywyLjMsMy42Yy0yLjktMC42LTUuMy0xLjctNy44LTIuMyAgICAgIGMtMi41LTAuNi00LjgtMS40LTcuMi0xLjdjLTIuMy0wLjYtNC43LTAuNy02LjktMS4xYy0yLjMsMC00LjYtMC4zLTYuOS0wLjFjLTQuNiwwLjEtOS4yLDAuNy0xNC4xLDEuNiAgICAgIEMxODcuNywxNzIuNCwxODIuOCwxNzMuNiwxNzcuMywxNzV6IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTg4XyIvPjxnIGlkPSJYTUxJRF8xODVfIj48Y2lyY2xlIGN4PSIyMDYuNCIgY3k9IjE5Ny40IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTg3XyIgcj0iMTQuOCIvPjxjaXJjbGUgY3g9IjIwOC44IiBjeT0iMTg2LjYiIGZpbGw9IiNGMkYyRjIiIGlkPSJYTUxJRF8xODZfIiByPSIzLjciLz48L2c+PC9nPjwvZz48cGF0aCBkPSJNMjEzLjgsMjc4LjRjNy40LDMuMiwxNC44LDUuNiwyMi4zLDcuMmM3LjUsMS41LDE1LDIuNSwyMi42LDIuM2MxLjksMC4xLDMuOC0wLjIsNS42LTAuMyAgICBjMS45LTAuMSwzLjgtMC4yLDUuNi0wLjVjMS45LTAuMywzLjctMC42LDUuNi0wLjhsNS42LTEuMmwyLjgtMC42YzAuOS0wLjIsMS44LTAuNiwyLjgtMC44bDUuNi0xLjZjMy44LTEuMSw3LjQtMi43LDExLjQtMy43ICAgIGMtMy4xLDIuNi02LjMsNS4yLTkuNyw3LjRjLTMuNiwxLjktNy4xLDQuMi0xMSw1LjVjLTEuOSwwLjctMy45LDEuNS01LjgsMi4xYy0yLDAuNS00LDAuOS02LjEsMS40Yy0yLDAuNS00LjEsMC43LTYuMiwwLjkgICAgYy0yLjEsMC4yLTQuMiwwLjUtNi4yLDAuNGMtOC40LDAuMi0xNi43LTEuNC0yNC41LTQuNEMyMjYuNiwyODguNywyMTkuMywyODQuNCwyMTMuOCwyNzguNHoiIGZpbGw9IiNGNEE1NkUiIGlkPSJYTUxJRF8xODJfIi8+PHBhdGggZD0iTTIzOCwyNDYuNWM0LDEuMSw3LjUsMiwxMC45LDIuNmMzLjQsMC43LDYuNywxLDEwLDEuMWMzLjIsMCw2LjUtMC4yLDkuOS0xICAgIGMxLjctMC4yLDMuNC0wLjgsNS4yLTEuMmMxLjgtMC40LDMuNi0xLjIsNS43LTEuNWMtMSwxLjgtMi4yLDMuNS0zLjYsNWMtMS41LDEuNC0zLjEsMi44LTUsMy44Yy0zLjYsMi4yLTgsMy4yLTEyLjMsMy4yICAgIGMtNC4zLDAtOC41LTEuMi0xMi4yLTMuMkMyNDMsMjUzLDIzOS45LDI1MC4yLDIzOCwyNDYuNXoiIGZpbGw9IiNGNEE1NkUiIGlkPSJYTUxJRF8xODFfIi8+PHBhdGggZD0iTTI1OC44LDk2LjZjMCwwLDI3LjEsNTMuOCw4OS43LDU4LjVjMCwwLDE3LjksMzcuOSw4LjMsNTdsMjEuNy0zNGMwLDAsMTkuMS01LjEsMjkuOSw4LjQgICAgYzAsMCwyNS44LTExNS44LTU1LjItMTYxLjRjMCwwLDE0LjMtOS41LDE2LjMtOS41YzIsMC0yMS43LDEuNC0yOS4yLDUuNFYwbC0xNC4zLDE3LjdjMCwwLTg1LjYtNDguMi0xODQuMywxNy44ICAgIGMwLDAtNjguNSw1NS44LTM1LjMsMTU3LjVjMCwwLDEwLjgtMjMuMiwzMS45LTEwLjRjMCwwLDExLjgsMjMuMywyMi4yLDM0LjdjMCwwLTE0LjgtNTYsMTMuMS05MGMwLDAsMy4xLDI0LjEsMTcuOSwyNy45ICAgIGMwLDAtOC42LTE5LjMsMy44LTQ2LjVjMCwwLDkuOSw1My4yLDU0LjQsNTRDMjQ5LjksMTYyLjYsMjE4LjksMTE3LjEsMjU4LjgsOTYuNnoiIGZpbGw9IiMzRjI4MjAiIGlkPSJYTUxJRF8xODBfIi8+PC9nPjwvZz48L3N2Zz4=", size1 = 70, size2 = 70, resultTitle='Noname', description="You Firm place", checkCenter = false) {
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

function showInfoWorkPlace(id, checkPlace){
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
            if(checkPlace == 1){
                checkPlaceText = 'Готов'
            } else {
                checkPlaceText = 'Готов переобучиться'
            }
            tempStr += `</tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary"  onclick='saveLike(${id}, 3)'>${checkPlaceText}</button>
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
                geocodeAddress(geocoder, map, data['position'], "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgdmlld0JveD0iMCAwIDQzMi4wOSAzNzMuNTEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlLz48ZyBkYXRhLW5hbWU9IkxheWVyIDIiIGlkPSJMYXllcl8yIj48ZyBkYXRhLW5hbWU9ImJlaWppbmcsIGNoaW5hLCBwYWxhY2UsIGFyY2hpdGVjdHVyZSwgYnVpbGRpbmcsIGNpdHksIGZvcmJpZGRlbiwgbGFuZG1hcmssIHRvdXJpc20sIHRyYXZlbCIgaWQ9ImJlaWppbmdfY2hpbmFfcGFsYWNlX2FyY2hpdGVjdHVyZV9idWlsZGluZ19jaXR5X2ZvcmJpZGRlbl9sYW5kbWFya190b3VyaXNtX3RyYXZlbCI+PHBhdGggZD0iTTE1OS43MSwyODlIMjc2LjEyYTUuNDYsNS40NiwwLDAsMCw1LjQ3LTUuNDZWMjYyLjc1YTUuNDcsNS40NywwLDAsMC01LjQ3LTUuNDdIMjY1Ljc2YTUuNDcsNS40NywwLDEsMCwwLDEwLjkzaDQuODl2OS44OEgxNjUuMTh2LTkuODhoNDguNjRhNS40Nyw1LjQ3LDAsMCwwLDAtMTAuOTNIMTU5LjcxYTUuNDYsNS40NiwwLDAsMC01LjQ2LDUuNDd2MjAuODFBNS40NSw1LjQ1LDAsMCwwLDE1OS43MSwyODlaIi8+PHBhdGggZD0iTTIzNiwyNjguMjFoMi4yMmE1LjQ3LDUuNDcsMCwxLDAsMC0xMC45M0gyMzZhNS40Nyw1LjQ3LDAsMSwwLDAsMTAuOTNaIi8+PHBhdGggZD0iTTExNy43MiwxMC45M0gyNDBBNS40Nyw1LjQ3LDAsMSwwLDI0MCwwSDExNy43MmExNC40NywxNC40NywwLDAsMC0xNC40NSwxNC40NlYyOC4wOWMtMS43OCwyLjM1LTQuNiw1LjkyLTguNCwxMC4xOWE1LjQ3LDUuNDcsMCwxLDAsOC4xOCw3LjI2YzQuNjUtNS4yNCw3Ljk0LTkuNDgsOS43Ny0xMkgzMjYuNTdjNS40LDYuOTMsMjMsMjguMjYsNDYuNzksNDQuOTFoLTUuOTRhNS40Nyw1LjQ3LDAsMCwwLDAsMTAuOTNoMjUuNDFhNS40Nyw1LjQ3LDAsMCwwLDIuNTEtMTAuMzNDMzY2LjU2LDY0LjI0LDM0My4yNSwzNi45MiwzMzYsMjcuODhWMTQuNDZBMTQuNDgsMTQuNDgsMCwwLDAsMzIxLjU2LDBIMjk2YTUuNDcsNS40NywwLDAsMCwwLDEwLjkzaDI1LjU1YTMuNTMsMy41MywwLDAsMSwzLjUzLDMuNTN2OC4xOEgxMTQuMlYxNC40NkEzLjUzLDMuNTMsMCwwLDEsMTE3LjcyLDEwLjkzWiIvPjxwYXRoIGQ9Ik0yNzAuOSwxMC45M0E1LjQ3LDUuNDcsMCwwLDAsMjcwLjksMGgtLjU2YTUuNDcsNS40NywwLDEsMCwwLDEwLjkzWiIvPjxwYXRoIGQ9Ik0xOTkuMywxNjAuMzNIMjQwYTUuNDYsNS40NiwwLDAsMCw1LjQ3LTUuNDZWMTA3LjUzYTUuNDcsNS40NywwLDAsMC01LjQ3LTUuNDdIMTk5LjNhNS40Nyw1LjQ3LDAsMCwwLTUuNDcsNS40N3Y0Ny4zNEE1LjQ2LDUuNDYsMCwwLDAsMTk5LjMsMTYwLjMzWk0yMDQuNzYsMTEzaDI5Ljc2VjE0OS40SDIwNC43NloiLz48cGF0aCBkPSJNNS40NywzNzMuNTFoNy43OGE1LjQ3LDUuNDcsMCwwLDAsMC0xMC45M0g1LjQ3YTUuNDcsNS40NywwLDEsMCwwLDEwLjkzWiIvPjxwYXRoIGQ9Ik00MzIuMDksMzY4YTUuNDYsNS40NiwwLDAsMC01LjQ2LTUuNDZIMzkwLjI1VjI0MS42OGE1LjQ2LDUuNDYsMCwwLDAtNS40Ni01LjQ2aC02LjQ0VjE4OS41NmgxNC40OGE1LjQ3LDUuNDcsMCwwLDAsMi42NS0xMC4yNWMtMjguNzMtMTUuODgtNTItNDAuMzYtNTkuNDYtNDguN1Y4OS40MWg5LjE1YTUuNDcsNS40NywwLDEsMCwwLTEwLjkzSDY1LjkxcTcuNzMtNS4zMSwxNS4xNC0xMS41NGE1LjQ3LDUuNDcsMCwxLDAtNy04LjM3QTE3Ni4zOSwxNzYuMzksMCwwLDEsNDMuODgsNzkuMTJhNS40Nyw1LjQ3LDAsMCwwLDIuNTcsMTAuMjloNTYuODJ2NDEuMmMtNy40OCw4LjM0LTMwLjc0LDMyLjgyLTU5LjQ2LDQ4LjdhNS40Nyw1LjQ3LDAsMCwwLDIuNjQsMTAuMjVINjAuOTN2NDYuNjZINTEuMDVhNS40Nyw1LjQ3LDAsMCwwLTUuNDcsNS40NnYxMjAuOUgzNi41MmE1LjQ3LDUuNDcsMCwxLDAsMCwxMC45M0g0MjYuNjNBNS40Nyw1LjQ3LDAsMCwwLDQzMi4wOSwzNjhaTTM2Ny40MiwyMzYuMjJIMzU2LjA5VjE4OS41NmgxMS4zM1ptLTMxLjQsMFYxODkuNTZoOS4xM3Y0Ni42NlpNMzI1LjA5LDEyNS43M0gyOTMuNjNWODkuNDFoMzEuNDZabS01My43MiwwVjg5LjQxSDI4Mi43djM2LjMyWm0tMTE0Ljc4LDBWODkuNDFoMTEuMzN2MzYuMzJaTTE0NS42NSw4OS40MXYzNi4zMkgxMTQuMlY4OS40MVptLTMzLjEyLDQ3LjI1aDY5LjZhNS40Nyw1LjQ3LDAsMSwwLDAtMTAuOTNoLTMuMjhWODkuNDFoODEuNTh2MzYuMzJoLTEuOTFhNS40Nyw1LjQ3LDAsMSwwLDAsMTAuOTNoNjguMjRhMjcwLjQ1LDI3MC40NSwwLDAsMCw0Nyw0MkgzMjEuNTZhNS40Nyw1LjQ3LDAsMSwwLDAsMTAuOTNoMy41M3Y0Ni42NkgyOTMuNjNWMTg5LjU2aDRhNS40Nyw1LjQ3LDAsMSwwLDAtMTAuOTNINjUuNTZBMjcwLjg1LDI3MC44NSwwLDAsMCwxMTIuNTMsMTM2LjY2Wm0xNTguODQsOTkuNTZWMTg5LjU2SDI4Mi43djQ2LjY2Wm0tOTIuNTIsMFYxODkuNTZoODEuNTh2NDYuNjZabS0yMi4yNiwwVjE4OS41NmgxMS4zM3Y0Ni42NlptLTQyLjM5LDBWMTg5LjU2aDMxLjQ1djQ2LjY2Wm0tMjAuMDcsMFYxODkuNTZoOS4xNHY0Ni42NlpNNzEuODcsMTg5LjU2SDgzLjJ2NDYuNjZINzEuODdaTTU2LjUxLDI0Ny4xNUgzNzkuMzJWMzYyLjU4SDMyOC4xNXYtNDEuMWE1LjQ2LDUuNDYsMCwwLDAtNS40Ni01LjQ3SDI3Ni4xMmE1LjQ3LDUuNDcsMCwwLDAtNS40Nyw1LjQ3djQxLjFIMjU0LjEzdi01NmE1LjQ2LDUuNDYsMCwwLDAtNS40Ni01LjQ3SDE4Ny4xNmE1LjQ3LDUuNDcsMCwwLDAtNS40Niw1LjQ3djU2SDE2NS4xOHYtNDEuMWE1LjQ3LDUuNDcsMCwwLDAtNS40Ny01LjQ3SDExMy4xNWE1LjQ3LDUuNDcsMCwwLDAtNS40Nyw1LjQ3djQxLjFINTYuNTFaTTMxNy4yMiwzNjIuNThIMjgxLjU5VjMyNi45NGgzNS42M1ptLTc0LDBIMTkyLjYzVjMxMkgyNDMuMlptLTg4Ljk1LDBIMTE4LjYxVjMyNi45NGgzNS42NFoiLz48L2c+PC9nPjwvc3ZnPg==", 40, 40, data['name'], data)
            
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
                                                    <div class="btn-group btn-group-toggle" data-toggle="buttons" onclick='showInfoWorkPlace(${data['id']}, ${data["checkPlace"]})'>\
                                                        <label class="btn btn-primary active">\
                                                        <input type="checkbox" name="options" autocomplete="off" checked> Like\
                                                    </label>\
                                                    </div>\
                                                </div>
                                                    `
                document.getElementById("filters").after(block_work_place)
                
            });

            var location =  response.place_info.city + ', ' + $("#id_location").val();
            geocodeAddress(geocoder, map, location, "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgYmFzZVByb2ZpbGU9InRpbnkiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iWE1MSURfMTc4XyI+PHBhdGggZD0iTTI2OC43LDQxMy42aC0yNS40Yy0yMS42LDAtMzkuMS0xNy41LTM5LjEtMzkuMXYtNTYuNmMwLTIxLjYsMTcuNS0zOS4xLDM5LjEtMzkuMWgyNS40ICAgYzIxLjYsMCwzOS4xLDE3LjUsMzkuMSwzOS4xdjU2LjZDMzA3LjgsMzk2LjEsMjkwLjMsNDEzLjYsMjY4LjcsNDEzLjZ6IiBmaWxsPSIjRURCQjk4IiBpZD0iWE1MSURfMTk4XyIvPjxwYXRoIGQ9Ik0zMDcuOCwzNzMuNnYwLjljMCwyMS42LTE3LjUsMzkuMS0zOS4xLDM5LjFoLTI1LjRjLTIxLjYsMC0zOS4xLTE3LjUtMzkuMS0zOS4xdi0wLjkgICBjLTgxLjQsMTcuNi0xNDQuOCw3MS44LTE2MS44LDEzOGMtMC4yLDAuOSwxMDcuOCwwLDIxMy42LDBjMTA1LjgsMCwyMTMuOSwwLjksMjEzLjYsMEM0NTIuNiw0NDUuNCwzODkuMiwzOTEuMiwzMDcuOCwzNzMuNnoiIGZpbGw9IiMyOUFCRTIiIGlkPSJYTUxJRF8xOTdfIi8+PGcgaWQ9IlhNTElEXzE3OV8iPjxlbGxpcHNlIGN4PSIzODUuNCIgY3k9IjIxNC43IiBmaWxsPSIjRjRDNUEyIiBpZD0iWE1MSURfMTk2XyIgcng9IjI4LjciIHJ5PSIzOS42IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjk3NzIgMC4yMTI0IC0wLjIxMjQgMC45NzcyIDU0LjM5NTIgLTc2Ljk3MDQpIi8+PGVsbGlwc2UgY3g9IjEzMS42IiBjeT0iMjE3LjIiIGZpbGw9IiNGNEM1QTIiIGlkPSJYTUxJRF8xOTVfIiByeD0iMjguNyIgcnk9IjM5LjYiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjk3NzIgMC4yMTI0IC0wLjIxMjQgLTAuOTc3MiAzMDYuMjkwNyA0MDEuNTgwOCkiLz48ZWxsaXBzZSBjeD0iMjU4LjgiIGN5PSIyMTIuMiIgZmlsbD0iI0Y0QzVBMiIgaWQ9IlhNTElEXzE5NF8iIHJ4PSIxMjMuMiIgcnk9IjE0My43Ii8+PGcgaWQ9IlhNTElEXzE4M18iPjxnIGlkPSJYTUxJRF8xODlfIj48cGF0aCBkPSJNMjgyLjEsMTc1YzIuOC01LDcuMy04LjgsMTIuMy0xMS42YzUtMi44LDEwLjgtNC40LDE2LjgtNC41YzMtMC4yLDYsMC4zLDguOSwwLjggICAgICBjMi45LDAuOSw1LjcsMS43LDguMiwzLjNjMi42LDEuMyw0LjksMy4yLDcsNS4yYzEuMSwwLjksMS45LDIuMSwyLjgsMy4zYzAuOCwxLjIsMS42LDIuMywyLjMsMy42Yy0yLjktMC42LTUuMy0xLjctNy44LTIuMyAgICAgIGMtMi41LTAuNi00LjgtMS40LTcuMi0xLjdjLTIuMy0wLjYtNC43LTAuNy02LjktMS4xYy0yLjMsMC00LjYtMC4zLTYuOS0wLjFjLTQuNiwwLjEtOS4yLDAuNy0xNC4xLDEuNiAgICAgIEMyOTIuNiwxNzIuNCwyODcuNiwxNzMuNiwyODIuMSwxNzV6IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTkzXyIvPjxnIGlkPSJYTUxJRF8xOTBfIj48Y2lyY2xlIGN4PSIzMTEuMiIgY3k9IjE5Ny40IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTkyXyIgcj0iMTQuOCIvPjxjaXJjbGUgY3g9IjMxMy43IiBjeT0iMTg2LjYiIGZpbGw9IiNGMkYyRjIiIGlkPSJYTUxJRF8xOTFfIiByPSIzLjciLz48L2c+PC9nPjxnIGlkPSJYTUxJRF8xODRfIj48cGF0aCBkPSJNMTc3LjMsMTc1YzIuOC01LDcuMy04LjgsMTIuMy0xMS42YzUtMi44LDEwLjgtNC40LDE2LjgtNC41YzMtMC4yLDYsMC4zLDguOSwwLjggICAgICBjMi45LDAuOSw1LjcsMS43LDguMiwzLjNjMi42LDEuMyw0LjksMy4yLDcsNS4yYzEuMSwwLjksMS45LDIuMSwyLjgsMy4zYzAuOCwxLjIsMS42LDIuMywyLjMsMy42Yy0yLjktMC42LTUuMy0xLjctNy44LTIuMyAgICAgIGMtMi41LTAuNi00LjgtMS40LTcuMi0xLjdjLTIuMy0wLjYtNC43LTAuNy02LjktMS4xYy0yLjMsMC00LjYtMC4zLTYuOS0wLjFjLTQuNiwwLjEtOS4yLDAuNy0xNC4xLDEuNiAgICAgIEMxODcuNywxNzIuNCwxODIuOCwxNzMuNiwxNzcuMywxNzV6IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTg4XyIvPjxnIGlkPSJYTUxJRF8xODVfIj48Y2lyY2xlIGN4PSIyMDYuNCIgY3k9IjE5Ny40IiBmaWxsPSIjMzMzMzMzIiBpZD0iWE1MSURfMTg3XyIgcj0iMTQuOCIvPjxjaXJjbGUgY3g9IjIwOC44IiBjeT0iMTg2LjYiIGZpbGw9IiNGMkYyRjIiIGlkPSJYTUxJRF8xODZfIiByPSIzLjciLz48L2c+PC9nPjwvZz48cGF0aCBkPSJNMjEzLjgsMjc4LjRjNy40LDMuMiwxNC44LDUuNiwyMi4zLDcuMmM3LjUsMS41LDE1LDIuNSwyMi42LDIuM2MxLjksMC4xLDMuOC0wLjIsNS42LTAuMyAgICBjMS45LTAuMSwzLjgtMC4yLDUuNi0wLjVjMS45LTAuMywzLjctMC42LDUuNi0wLjhsNS42LTEuMmwyLjgtMC42YzAuOS0wLjIsMS44LTAuNiwyLjgtMC44bDUuNi0xLjZjMy44LTEuMSw3LjQtMi43LDExLjQtMy43ICAgIGMtMy4xLDIuNi02LjMsNS4yLTkuNyw3LjRjLTMuNiwxLjktNy4xLDQuMi0xMSw1LjVjLTEuOSwwLjctMy45LDEuNS01LjgsMi4xYy0yLDAuNS00LDAuOS02LjEsMS40Yy0yLDAuNS00LjEsMC43LTYuMiwwLjkgICAgYy0yLjEsMC4yLTQuMiwwLjUtNi4yLDAuNGMtOC40LDAuMi0xNi43LTEuNC0yNC41LTQuNEMyMjYuNiwyODguNywyMTkuMywyODQuNCwyMTMuOCwyNzguNHoiIGZpbGw9IiNGNEE1NkUiIGlkPSJYTUxJRF8xODJfIi8+PHBhdGggZD0iTTIzOCwyNDYuNWM0LDEuMSw3LjUsMiwxMC45LDIuNmMzLjQsMC43LDYuNywxLDEwLDEuMWMzLjIsMCw2LjUtMC4yLDkuOS0xICAgIGMxLjctMC4yLDMuNC0wLjgsNS4yLTEuMmMxLjgtMC40LDMuNi0xLjIsNS43LTEuNWMtMSwxLjgtMi4yLDMuNS0zLjYsNWMtMS41LDEuNC0zLjEsMi44LTUsMy44Yy0zLjYsMi4yLTgsMy4yLTEyLjMsMy4yICAgIGMtNC4zLDAtOC41LTEuMi0xMi4yLTMuMkMyNDMsMjUzLDIzOS45LDI1MC4yLDIzOCwyNDYuNXoiIGZpbGw9IiNGNEE1NkUiIGlkPSJYTUxJRF8xODFfIi8+PHBhdGggZD0iTTI1OC44LDk2LjZjMCwwLDI3LjEsNTMuOCw4OS43LDU4LjVjMCwwLDE3LjksMzcuOSw4LjMsNTdsMjEuNy0zNGMwLDAsMTkuMS01LjEsMjkuOSw4LjQgICAgYzAsMCwyNS44LTExNS44LTU1LjItMTYxLjRjMCwwLDE0LjMtOS41LDE2LjMtOS41YzIsMC0yMS43LDEuNC0yOS4yLDUuNFYwbC0xNC4zLDE3LjdjMCwwLTg1LjYtNDguMi0xODQuMywxNy44ICAgIGMwLDAtNjguNSw1NS44LTM1LjMsMTU3LjVjMCwwLDEwLjgtMjMuMiwzMS45LTEwLjRjMCwwLDExLjgsMjMuMywyMi4yLDM0LjdjMCwwLTE0LjgtNTYsMTMuMS05MGMwLDAsMy4xLDI0LjEsMTcuOSwyNy45ICAgIGMwLDAtOC42LTE5LjMsMy44LTQ2LjVjMCwwLDkuOSw1My4yLDU0LjQsNTRDMjQ5LjksMTYyLjYsMjE4LjksMTE3LjEsMjU4LjgsOTYuNnoiIGZpbGw9IiMzRjI4MjAiIGlkPSJYTUxJRF8xODBfIi8+PC9nPjwvZz48L3N2Zz4=", 40, 40, 'Вы', data, checkCenter=true)
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

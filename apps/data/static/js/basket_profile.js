function showInfoWorkPlace(id){
    var id_city = $("#id_city").val();
    var id_education = $("#id_education").val();
    var id_profession = $("#id_profession").val();
    var id_skill = $("#id_skills").val();
    data={"id": id, "id_city": id_city, "id_education": id_education, "id_profession": id_profession, "id_skill": id_skill}
    $.ajax({
        type : 'GET',
        url :  '/personal_area/profile/basket/show_info',
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
                            <button type="button" class="btn btn-primary"  onclick='saveLike(${id}, 3)'>Ок</button>
                        </div>
                    </div>
                </div>`

            let Modal = document.createElement('div')
            Modal.className = "modal fade"
            Modal.id = "myModalBox"
            Modal.innerHTML = tempStr 
            document.getElementById("blockWorkPlaceFirm").after(Modal)
            $('#myModalBox').modal('show')
            console.log(response)
        },
        error : function(response){
            console.log(response)
        }
    })
};


$(document).ready(function(){
    console.log(work_places)
    $.each(work_places, function(key,data) {
        console.log(data)
        let block_work_place = document.createElement('div')
        block_work_place.id = "boxWork"
        block_work_place.className = "row border border-success mt-1"
        approach = ""

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
                                                <input type="checkbox" name="options" autocomplete="off" checked> Подробнее\
                                            </label>\
                                            </div>\
                                        </div>
                                            `
        if (data["checkPlace"] == 1){
            document.getElementById("blockWorkPlaceMutual").after(block_work_place)
        } else if(data["checkPlace"] == 2){
            document.getElementById("blockWorkPlaceProfile").after(block_work_place)
        } else if(data["checkPlace"] == 3){
            document.getElementById("blockWorkPlaceFirm").after(block_work_place)
        }
                
    });

    var counter = 0
    $.each(tabl1, function(key,data) {
        counter += 1
        
        if (data['checkLProfileLike']){
            checkLProfileLike = "✓"
        } else{
            checkLProfileLike = "✗"
        }

        if (data['checkLikeByProfile']){
            checkLikeByProfile = "✓"
        } else{
            checkLikeByProfile = "✗"
        }

        if (data['checkDoubleLike']){
            checkDoubleLike = "✓"
        } else{
            checkDoubleLike = "✗"
        }

        block_profile = document.createElement('tr')
        block_profile.innerHTML =    `<th scope="row">${counter}</th>\
                                        <td>${data['profession']}</td>\
                                        <td>${data['work']}</td>\
                                        <td>${checkLProfileLike}</td>\
                                        <td>${checkLikeByProfile}</td>\
                                        <td>${checkDoubleLike}</td>\
                                        <td>${data['firm']}</td>\
                                        <td>${data['upPlaces']}</td>
                                        `
        document.getElementById("tabl1").append(block_profile)
    });
});
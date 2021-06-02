function deleteWorkplace(id){
    data = {'id': id}
    $.ajax({
        type : 'GET',
        url :  '/delete/workplace',
        data : data,
        success : function(response){
        },
        error : function(response){
            console.log(response)
        }
    })
}

function showInfoWorkPlace(id){
    $.each(work_places, function(key,data){
        if (data["place_id"] == id){
            console.log(data)

            list_skill = data['skill']
            ul_list_skill = `<ul>`
            $.each(list_skill, function(key,skill){
                ul_list_skill +=`<li>${skill}</li>`
            });
            ul_list_skill +=`</ul>`


            list_disability = data['disability']
            ul_list_disability = `<ul>`
            $.each(list_disability, function(key,disability){
                ul_list_disability +=`<li>${disability}</li>`
            });
            ul_list_disability +=`</ul>`


            list_profile_liked_names = data['profile_liked_names']
            ul_list_profile_liked_names = `<ul>`
            $.each(list_profile_liked_names, function(key,profile){
                ul_list_profile_liked_names +=`<li>${profile}</li>`
            });
            ul_list_profile_liked_names +=`</ul>`

            list_liked_by_profile_names = data['liked_by_profile_names']
            ul_list_liked_by_profile_names = `<ul>`
            $.each(list_liked_by_profile_names, function(key,profile){
                ul_list_liked_by_profile_names +=`<li>${profile}</li>`
            });
            ul_list_liked_by_profile_names +=`</ul>`

            list_mutual_liked_names = data['mutual_liked_names']
            ul_list_mutual_liked_names = `<ul>`
            $.each(list_mutual_liked_names, function(key,profile){
                ul_list_mutual_liked_names +=`<li>${profile}</li>`
            });
            ul_list_mutual_liked_names +=`</ul>`

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
                                                        Рабочее место
                                                    </th>
                                                    <td>${data['name']}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Должность
                                                    </th>
                                                    <td>${data['profession']}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Город
                                                    </th>
                                                    <td>${data['city']}</td>
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
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Тип занятости
                                                    </th>
                                                    <td>${data['employment_type']}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        График работы
                                                    </th>
                                                    <td>${data['schedule']}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Ключевые компетенции
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
                                                        Зарплата
                                                    </th>
                                                    <td>От ${data['min_salary']} до ${data['max_salary']} </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Пользователи, которых вы лайкнули
                                                    </th>
                                                    <td>${ul_list_profile_liked_names}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Пользователи, которые лайкнули
                                                    </th>
                                                    <td>${ul_list_liked_by_profile_names}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        Обоюдно лайкнутые пользователи
                                                    </th>
                                                    <td>${ul_list_mutual_liked_names}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary">Изменить</button>
                                            <form action="/delete/workplace" method="post">
                                                <input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}">
                                                <input id="id" type="hidden" name="id" value="${id}">
                                                <input type="submit" class="btn btn-primary" value="Удалить">

                                        </div>
                                    </div>
                                </div>`
            document.getElementById("blockWorkPlace").after(Modal)
            $('#myModalBox').modal('show')
        }
    }); 
};


$(document).ready(function(){
    console.log(work_places)
    $.each(work_places, function(key,data) {
        console.log(data)
        block_work_place = document.createElement('div')
        block_work_place.className = "row border border-primary mt-1"
        block_work_place.id = "blockWorkPlace"

        block_work_place.innerHTML =    `<div class='col'><text id=_${data['place_id']}>${data['name']}</text></div>\
                                                        
                                                        <div class='w-100'></div>\
                                                        <div class='col'>\
                                                            ${data['profession']}\
                                                        </div>\
                                                        <div class='col'>\
                                                            <p class='text-right'>Адрес: ${data['position']}</p>\
                                                        </div>\
                                                        <div class='col'>\
                                                            <div class="btn-group btn-group-toggle" data-toggle="buttons" onclick='showInfoWorkPlace(${data['place_id']})'>\
                                                                <label class="btn btn-primary active">\
                                                                    <input type="checkbox" name="options" autocomplete="off" checked > Подробнее\
                                                                </label>\
                                                            </div>\
                                                        </div>
                                                        `




        // block_work_place.innerHTML = `<table class="table">
        //                                 <tbody>
        //                                     <th scope="row">
        //                                         Рабочее место:
        //                                     </th>
        //                                     <td><text id=place_${data['place_id']} onclick='showInfoWorkPlace(${data['place_id']})'>${data['name']}</text></td>
        //                                     <th scope="row">
        //                                         Пользователи, которых вы лайкнули:
        //                                     </th>
        //                                     <td>${ul_list_profile_liked_names}</td>
        //                                 </tbody>
        //                             </table>`


        document.getElementById("blockWorkPlace").after(block_work_place)
    });
});
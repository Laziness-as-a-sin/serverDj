$(document).ready(function(){
    console.log(courses)
    $.each(courses, function(key,data) {
        block_course = document.createElement('div')
        block_course.className = "row border border-primary mt-1"
        block_course.id = `blockCourses${data['id']}`

        block_course.innerHTML =    `<div class='col'><text id=_${data['id']}>${data['name']}</text></div>\                 
                                        <div class='col'>\
                                            ${data['profession']}\
                                        </div>\
                                        <div class='col'>\
                                            <div class="btn-group btn-group-toggle" data-toggle="buttons" onclick='showInfoCourse(${data['id']})'>\
                                                <label class="btn btn-primary active">\
                                                    <input type="checkbox" name="options" autocomplete="off" checked > Подробнее\
                                                </label>\
                                            </div>\
                                        </div>
                                        `
        document.getElementById("blockCourses").after(block_course)
    });
});


function deleteCourse(id){
    data = {'id': id}
    $.ajax({
        type : 'GET',
        url :  'delete_course',
        data : data,
        success : function(response){
            $(`#blockCourses${id}`).remove();
        },
        error : function(response){
            console.log(response)
        }
    })
}

function showInfoCourse(id){
    $.each(courses, function(key,data){
        if (data["id"] == id){
            console.log(data)

            
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
                                                            Профессия
                                                        </th>
                                                        <td>${data['name']}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">
                                                            Описание
                                                        </th>
                                                        <td>${data['description']}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">
                                                            Набор
                                                        </th>
                                                        <td>${data['count']}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">
                                                            Цена на человека
                                                        </th>
                                                        <td>${data['price']}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">
                                                            Подтвержденные участники
                                                        </th>
                                                        <td>${data['confirmed_profile']}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary">Изменить</button>
                                            <button type="button" class="btn btn-primary" onclick="deleteCourse(${id})" data-dismiss="modal">Удалить</button>
                                        </div>
                                    </div>
                                </div>`
            document.getElementById("blockCourses").after(Modal)
            $('#myModalBox').modal('show')
        }
    }); 
};
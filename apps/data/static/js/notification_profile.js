$(document).ready(function(){
    console.log(courses_recomm)
    counter = 0
    $.each(courses_recomm, function(key,data) {
        counter += 1
        block_work_recomm_courses = document.createElement('tr')
        block_work_recomm_courses.id = `recomm_courses_row_${counter}`
        block_work_recomm_courses.innerHTML =    `<th id=${counter} scope="row">
                                                        <button id=course_button_confirmation type="button" class="btn btn-primary">Согласиться</button>
                                                </th>\
                                        <td>${data['name']}</td>\
                                        <td>${data['profession']}</td>\
                                        <td>${data['univer']}</td>\
                                        <td>${data['count']}</td>\
                                        <td>${data['price']}</td>\
                                        `
        document.getElementById("table_courses_recomm_body").append(block_work_recomm_courses)
    })

    console.log(courses_confirmed)
    counter = 0
    $.each(courses_confirmed, function(key,data) {
        counter += 1
        block_work_confirmed_courses = document.createElement('tr')
        block_work_confirmed_courses.id = `confirmed_courses_row_${counter}`
        block_work_confirmed_courses.innerHTML =    `<th id=${counter} scope="row">${counter}</th>\
                                        <td>${data['name']}</td>\
                                        <td>${data['profession']}</td>\
                                        <td>${data['univer']}</td>\
                                        <td>${data['count']}</td>\
                                        <td>${data['price']}</td>\
                                        `
        document.getElementById("table_courses_confirmed_body").append(block_work_confirmed_courses)
    })



    $('#table_courses_recomm_body').on("click", "BUTTON", function(event){
            var target = event.target.parentNode
            row = $(`#recomm_courses_row_${target.getAttribute("id")}`)
            tempdata =  row.children('td').map(function (index, val) {
                return $(this).text();
            }).toArray();
            console.log(tempdata)

            data = {'name': tempdata[0], 'profession': tempdata[1], 'univer': tempdata[2]}
            $.ajax({
                type : 'GET',
                url :  'notification/confirmation',
                data : data,
                success : function(response){
                    row.appendTo('#table_courses_confirmed_body')
                },
                error : function(response){
                    console.log(response)
                }
            })     
    })
})
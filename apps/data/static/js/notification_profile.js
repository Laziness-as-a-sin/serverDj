$(document).ready(function(){
    console.log(courses)
    counter = 0
    $.each(courses, function(key,data) {
        counter += 1
        block_work_recomm_courses = document.createElement('tr')
        block_work_recomm_courses.innerHTML =    `<th id=${counter} scope="row">${counter}</th>\
                                        <td>${data['name']}</td>\
                                        <td>${data['profession']}</td>\
                                        <td>${data['univer']}</td>\
                                        <td>${data['count']}</td>\
                                        <td>${data['price']}</td>\
                                        `
        document.getElementById("table_courses_body").append(block_work_recomm_courses)
        
    })
})
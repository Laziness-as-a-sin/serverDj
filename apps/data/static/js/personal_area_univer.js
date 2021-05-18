function ShowHideTable(id_table, id_button, number_table){
    var x = document.getElementById(id_table);
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById(id_button).innerHTML = `Скрыть таблицу ${number_table}` 
    } else {
        x.style.display = "none";
        document.getElementById(id_button).innerHTML = `Показать таблицу ${number_table}` 
    }
}


$(document).ready(function(){
    console.log(tabl1)
    var counter = 0
    $.each(tabl1, function(key,data) {
        counter += 1
        
        if (data['checkLProfileLike']){
            checkLProfileLike = "+"
        } else{
            checkLProfileLike = "-"
        }

        if (data['checkLikeByProfile']){
            checkLikeByProfile = "+"
        } else{
            checkLikeByProfile = "-"
        }

        if (data['checkDoubleLike']){
            checkDoubleLike = "+"
        } else{
            checkDoubleLike = "-"
        }

        block_profile = document.createElement('tr')
        block_profile.innerHTML =    `<th scope="row">${counter}</th>\
                                        <td>${data['name']}</td>\
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

    console.log(tabl2)
    var counter = 0
    $.each(work_places, function(key,data) {
        counter += 1

        list_liked_by_profile_names = data['liked_by_profile_names']
        ul_list_liked_by_profile_names = `<ul>`
        $.each(list_liked_by_profile_names, function(key,like){
            ul_list_liked_by_profile_names +=`<li>${like}</li>`
        });
        ul_list_liked_by_profile_names +=`</ul>`


        list_profile_liked_names = data['profile_liked_names']
        ul_list_profile_liked_names = `<ul>`
        $.each(list_profile_liked_names, function(key,like){
            ul_list_profile_liked_names +=`<li>${like}</li>`
        });
        ul_list_profile_liked_names +=`</ul>`

        

        list_worckplace_double_like = data['worckplace_double_like']
        ul_list_worckplace_double_like = `<ul>`
        $.each(list_worckplace_double_like, function(key,like){
            ul_list_worckplace_double_like +=`<li>${like}</li>`
        });
        ul_list_worckplace_double_like +=`</ul>`


        block_work_place = document.createElement('tr')
        block_work_place.innerHTML =    `<th scope="row">${counter}</th>\
                                        <td>${data['name']}</td>\
                                        <td>${data['city']}</td>\
                                        <td>${data['profession']}</td>\
                                        <td>${ul_list_profile_liked_names}</td>\
                                        <td>${ul_list_liked_by_profile_names}</td>\
                                        <td>${ul_list_worckplace_double_like}</td>\
                                        <td>${data['firm']}</td>\
                                        <td>${data['place_count']}</td>\
                                        `
        document.getElementById("work_places").append(block_work_place)
    });


    console.log(work_places)
    var counter = 0
    $.each(tabl2, function(key,data) {
        counter += 1

        list_skill = data['skill']
        ul_list_skill = `<ul>`
        $.each(list_skill, function(key,skill){
            ul_list_skill +=`<li>${skill}</li>`
        });
        ul_list_skill +=`</ul>`


        list_work_experience = data['work_experience']
        ul_list_work_experience = `<ul>`
        $.each(list_work_experience, function(key,exp){
            ul_list_work_experience +=`<li>${exp}</li>`
        });
        ul_list_work_experience +=`</ul>`


        list_liked_vacancies = data['liked_vacancies']
        ul_list_liked_vacancies = `<ul>`
        $.each(list_liked_vacancies, function(key,vac){
            ul_list_liked_vacancies +=`<li>${vac}</li>`
        });
        ul_list_liked_vacancies +=`</ul>`


        list_firm_liked = data['firm_liked']
        ul_list_firm_liked = `<ul>`
        $.each(list_firm_liked, function(key,vac){
            ul_list_firm_liked +=`<li>${vac}</li>`
        });
        ul_list_firm_liked +=`</ul>`

        

        list_user_doublelikes = data['user_doublelikes']
        ul_list_user_doublelikes = `<ul>`
        $.each(list_user_doublelikes, function(key,like){
            ul_list_user_doublelikes +=`<li>${like}</li>`
        });
        ul_list_user_doublelikes +=`</ul>`


        block_work_place = document.createElement('tr')
        block_work_place.innerHTML =    `<th scope="row">${counter}</th>\
                                        <td>${data['name']}</td>\
                                        <td>${data['sex']}</td>\
                                        <td>${data['city']}</td>\
                                        <td>${data['age']}</td>\
                                        <td>${data['profession']}</td>\
                                        <td>${ul_list_work_experience}</td>\
                                        <td>${ul_list_skill}</td>\
                                        <td>${data['desired_position']}</td>\
                                        <td>${ul_list_liked_vacancies}</td>\
                                        <td>${ul_list_firm_liked}</td>\
                                        <td>${ul_list_user_doublelikes}</td>\
                                        <td>${data['work_places']}</td>\
                                        <td>${data['work_places_near']}</td>\
                                        `
        document.getElementById("tabl2").append(block_work_place)
    });

    console.log(courses)
    var counter = 0
    $.each(courses, function(key,data) {
        counter += 1

        block_work_course = document.createElement('tr')
        block_work_course.innerHTML =    `<th scope="row">${counter}</th>\
                                        <td>${data['name']}</td>\
                                        <td>${data['skill']}</td>\
                                        <td>${data['univer']}</td>\
                                        <td>${data['count']}</td>\
                                        <td>${data['price']}</td>\
                                        <td>${data['price_per_person']}</td>\
                                        <td>${data['forecast']}</td>\
                                        `
        document.getElementById("courses").append(block_work_course)
    });

});
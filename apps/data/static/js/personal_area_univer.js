
$(document).ready(function(){
    // console.log(info)
    // console.log(work_places)
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


    // var counter = 0
    // $.each(work_places, function(key,data) {
    //     counter += 1

    //     liked_by_profile = data['liked_by_profile_names']
    //     ul_liked_by_profile = `<ul>`
    //     $.each(liked_by_profile, function(key,profile){
    //         ul_liked_by_profile +=`<li>${profile}</li>`
    //     });
    //     ul_liked_by_profile +=`</ul>`


    //     profile_liked = data['profile_liked_names']
    //     ul_profile_liked = `<ul>`
    //     $.each(profile_liked, function(key,profile){
    //         ul_profile_liked +=`<li>${profile}</li>`
    //     });
    //     ul_profile_liked +=`</ul>`

    //     list_skill = data['skill']
    //     ul_list_skill = `<ul>`
    //     $.each(list_skill, function(key,skill){
    //         ul_list_skill +=`<li>${skill}</li>`
    //     });
    //     ul_list_skill +=`</ul>`


    //     block_work_place = document.createElement('tr')
    //     block_work_place.innerHTML =    `<th scope="row">${counter}</th>\
    //                                     <td>${data['name']}</td>\
    //                                     <td>${data['firm']}</td>\
    //                                     <td>${data['city']}</td>\
    //                                     <td>${ul_list_skill}</td>\
    //                                     <td>${ul_profile_liked}</td>\
    //                                     <td>${ul_liked_by_profile}</td>\
    //                                     `
    //     document.getElementById("tableWorkPlace").append(block_work_place)
    // });

});
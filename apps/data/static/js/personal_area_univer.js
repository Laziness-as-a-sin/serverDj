// function showInfoWorkPlace(id){
//     $.each(work_places, function(key,data){
//         if (data["place_id"] == id){
//             console.log(data)

//             list_skill = data['skill']
//             ul_list_skill = `<ul>`
//             $.each(list_skill, function(key,skill){
//                 ul_list_skill +=`<li>${skill}</li>`
//             });
//             ul_list_skill +=`</ul>`


//             list_disability = data['disability']
//             ul_list_disability = `<ul>`
//             $.each(list_disability, function(key,disability){
//                 ul_list_disability +=`<li>${disability}</li>`
//             });
//             ul_list_disability +=`</ul>`


//             list_profile_liked_names = data['profile_liked_names']
//             ul_list_profile_liked_names = `<ul>`
//             $.each(list_profile_liked_names, function(key,profile){
$(document).ready(function(){
    // console.log(info)
    // console.log(work_places)
    console.log(tabl1)
    var counter = 0
    // $.each(info[0].profiles, function(key,data) {
    //     console.log(data)
    //     counter += 1
    //     list_desired_position = data['desired_position']
    //     ul_list_desired_position = `<ul>`
    //     $.each(list_desired_position, function(key,desired_position){
    //         ul_list_desired_position +=`<li>${desired_position}</li>`
    //     });
    //     ul_list_desired_position +=`</ul>`

    //     list_disability = data['disability']
    //     ul_list_disability = `<ul>`
    //     $.each(list_disability, function(key,disability){
    //         ul_list_disability +=`<li>${disability}</li>`
    //     });
    //     ul_list_disability +=`</ul>`

    //     list_education = data['education']
    //     ul_list_education = `<ul>`
    //     $.each(list_education, function(key,education){
    //         ul_list_education +=`<li>${education}</li>`
    //     });
    //     ul_list_education +=`</ul>`

    //     list_profession= data['profession']
    //     ul_list_profession = `<ul>`
    //     $.each(list_profession, function(key,profession){
    //         ul_list_profession +=`<li>${profession}</li>`
    //     });
    //     ul_list_profession +=`</ul>`

    //     list_skill = data['skill']
    //     ul_list_skill = `<ul>`
    //     $.each(list_skill, function(key,skill){
    //         ul_list_skill +=`<li>${skill}</li>`
    //     });
    //     ul_list_skill +=`</ul>`

    //     list_work_experience = data['work_experience']
    //     ul_list_work_experience = `<ul>`
    //     $.each(list_work_experience, function(key,work_experience){
    //         ul_list_work_experience +=`<li>${work_experience}</li>`
    //     });
    //     ul_list_work_experience +=`</ul>`

    //     block_profile = document.createElement('tr')
    //     block_profile.innerHTML =    `<th scope="row">${counter}</th>\
    //                                     <td>${data['name']}</td>\
    //                                     <td>${data['sex']}</td>\
    //                                     <td>${data['city']}</td>\
    //                                     <td>${data['age']}</td>\
    //                                     <td>${ul_list_profession}</td>\
    //                                     <td>${ul_list_work_experience}</td>\
    //                                     <td>${ul_list_skill}</td>\
    //                                     <td>${ul_list_desired_position}</td>\
    //                                     <td>${data['work_places_near']}</td>\
    //                                     <td>${data['work_places']}</td>\
    //                                     `
    //     document.getElementById("tableProfile").append(block_profile)
    // });


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
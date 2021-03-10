$(document).ready(function(){
    document.getElementById('id_region_relocation').style.display = "none";
    $("#users").change(function(e){
        e.preventDefault();
        var username = $(this).val();
        var data = {username};
    
        $.ajax({
            type : 'GET',
            url :  'get_user_info/',
            data : data,
            success : function(response){
                $("#user_info table tbody").html(`<tr>
                    <td>${response.user_info.first_name || "-"}</td>
                    <td>${response.user_info.last_name || "-"}</td>
                    <td>${response.user_info.email || "-"}</td>
                    <td>${response.user_info.is_active}</td>
                    <td>${response.user_info.joined}</td>
                    </tr>`)
            },
            error : function(response){
                console.log(response)
            }
        })
    })

    $(":input").on("change", function(e){
        e.preventDefault();

        var id_edu_professioprof = $("#id_edu_profession").val();
        var id_disability = $("#id_disability").val();
        var id_region = $("#id_region").val();
        var id_region_or_location = $("#id_region_or_location").val();
        var id_region_relocation = $("#id_region_relocation").val();
        var id_choices_edu_level = $("#id_choices_edu_level").val()
        var id_experience = $("#id_experience").val()
        var id_edu_level = $("#id_edu_level").val();
        var id_edu_profession = $("#id_edu_profession").val();

        var data = {id_edu_professioprof, id_disability, id_region, id_region_or_location, id_region_relocation, id_choices_edu_level, id_experience, id_edu_level, id_edu_profession};
        $.ajax({
            type : 'GET',
            url :  'get_user_info/',
            data : data,
            success : function(response){
                $("#index_users_list").html(`
                ${response.user_info.prof_name || "-"}</br>
                ${response.user_info.prof_desc || "-"}</br>
                ${response.user_info.suitable_people || "-"}</br>
                `)
                    
            },
            error : function(response){
                console.log(response)
            }
        })

    })


    $("#id_relocation_check").click(function(e){
        var vis = (this.checked) ? "block" : "none";
        document.getElementById('id_region_relocation').style.display = vis;
    })


 })


 
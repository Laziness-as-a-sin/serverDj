function addData(chart, label, data) {
    // chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();  
}

$(document).ready(function(){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ограничения', 'Город', 'Образование', 'Профессия', 'Навыки'],
            datasets: [{
                label: 'Подходите',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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


    $(":input").on("change", function(e){
        e.preventDefault();

        var id_disability = $("#id_disability").val();
        var id_city = $("#id_city").val();
        var id_education = $("#id_education").val();
        var id_profession = $("#id_profession").val();
        var id_skill = $("#id_skills").val();

        var data = {id_disability, id_city, id_education, id_profession, id_skill};
        console.log(data)
        $.ajax({
            type : 'GET',
            url :  '/personal_area/profile/',
            data : data,
            success : function(response){
                tempDict = [];
                console.log(response);
                addData(myChart, 0, response.place_info.prof_desc)
                Object.keys(response.place_info.target_mismatches).forEach(function(key) {
                    tempDict.push(response.place_info.target_mismatches[key]);
                });
                addData(myChart, 0, tempDict)

                while(document.getElementById("idtest")){
                    document.getElementById("idtest").remove()
                }

                $.each(response.place_info.work_places_info,function(key,data) {
                    console.log(data);

                    
                    let block_user_workplace = document.createElement('div')
                    block_user_workplace.className = "row border border-primary"
                    block_user_workplace.id = "idtest"
                    block_user_workplace.innerHTML =    `<div class='col'><text>${data['work_place_name']}</text></div>\
                                                        <div class='col'>\
                                                            <p class='text-right'>${data['work_place_min_salary']} - ${data['work_place_max_salary']}</p>\
                                                        </div>\
                                                        <div class='w-100'></div>\
                                                        <div class='col'>\
                                                            ${data['work_place_profession']}\
                                                        </div>\
                                                        <div class='col'>\
                                                            <p class='text-right'>Процент совпадения: ${data['work_place_coincidence']}%</p>\
                                                        </div>
                                                        `
                    

                    document.getElementById("chart_div").after(block_user_workplace)
                });

                


                // <div class="col">
                //                 <text>Название рабочего места </text>
                //             </div>
                //             <div class="col">
                //                 <p class="text-right">10000 - 15000</p>
                //             </div>
                //             <div class="w-100"></div>
                //             <div class="col">
                //                 Профессия
                //             </div>
                //             <div class="col">
                //                 <p class="text-right">Процент совпадения: 75%</p>
                //             </div>


            },
            error : function(response){
                console.log(response)
            }
        })
    })    
 })

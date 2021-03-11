function addData(chart, label, data) {
    // chart.data.labels = label;

    chart.data.datasets[0].data = data;
    chart.update();  
}

$(document).ready(function(){
    document.getElementById('div_id_region_relocation').style.display = "none";
    function addData(chart, label, data) {
        // chart.data.labels = label;

        chart.data.datasets[0].data = data;
        chart.update();  
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0', '1', '2', '3', '4', '5'],
            datasets: [{
                label: 'Неподходят',
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


    var ctx1 = document.getElementById('myChart1').getContext('2d');
    var myChart1 = new Chart(ctx1, {
        type: 'horizontalBar',
        data: {
            labels: ['Город', 'Образование', 'Профессия', 'Навыки', 'Ограничения'],
            datasets: [{
                label: 'Неподходят',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
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
        var id_region = $("#id_region").val();
        var id_region_or_location = $("#id_region_or_location").val();
        var id_region_relocation = $("#id_region_relocation").val();
        var id_choices_edu_level = $("#id_choices_edu_level").val()
        var id_experience = $("#id_experience").val()
        var id_edu_level = $("#id_edu_level").val();
        var id_edu_profession = $("#id_edu_profession").val();
        var id_skills = $("#id_skills").val();

        var data = {id_disability, id_region, id_region_or_location, id_region_relocation, id_choices_edu_level, id_experience, id_edu_level, id_edu_profession, id_skills};
        console.log(data)
        $.ajax({
            type : 'GET',
            url :  'get_user_info/',
            data : data,
            success : function(response){
                tempDict = [];
                console.log(response.user_info);
                addData(myChart, 0, response.user_info.prof_desc)
                Object.keys(response.user_info.target_mismatches).forEach(function(key) {
                    tempDict.push(response.user_info.target_mismatches[key]);
                 });
                 addData(myChart1, 0, tempDict)
                // addData(myChart, ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], [1, 0, 22, 5, 0, 10])
                // $("#index_users_list").html(`
                //     // ${response.user_info.prof_name || "-"}</br>
                //     // ${response.user_info.prof_desc || "-"}</br>
                //     // ${response.user_info.suitable_people || "-"}</br>
                // `)    
            },
            error : function(response){
                console.log(response)
            }
        })

    })


    $("#id_relocation_check").click(function(e){
        var vis = (this.checked) ? "block" : "none";
        document.getElementById('div_id_region_relocation').style.display = vis;
    })


 })


//  var ctx = document.getElementById('myChart').getContext('2d');
//  var myChart = new Chart(ctx, {
//      type: 'bar',
//      data: {
//          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//          datasets: [{
//              label: '# of Votes',
//              data: [12, 19, 3, 5, 2, 3],
//              backgroundColor: [
//                  'rgba(255, 99, 132, 0.2)',
//                  'rgba(54, 162, 235, 0.2)',
//                  'rgba(255, 206, 86, 0.2)',
//                  'rgba(75, 192, 192, 0.2)',
//                  'rgba(153, 102, 255, 0.2)',
//                  'rgba(255, 159, 64, 0.2)'
//              ],
//              borderColor: [
//                  'rgba(255, 99, 132, 1)',
//                  'rgba(54, 162, 235, 1)',
//                  'rgba(255, 206, 86, 1)',
//                  'rgba(75, 192, 192, 1)',
//                  'rgba(153, 102, 255, 1)',
//                  'rgba(255, 159, 64, 1)'
//              ],
//              borderWidth: 1
//          }]
//      },
//      options: {
//          scales: {
//              yAxes: [{
//                  ticks: {
//                      beginAtZero: true
//                  }
//              }]
//          }
//      }
//  });
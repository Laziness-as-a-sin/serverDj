function addData(chart, label, data) {
    // chart.data.labels = label;

    chart.data.datasets[0].data = data;
    chart.update();  
}

$(document).ready(function(){

    $("#id_profession").on("change", function(e){
        e.preventDefault();

        var id_profession = $("#id_profession").val();

        var data = {id_profession};
        console.log(data)
        $.ajax({
            type : 'GET',
            url :  'test_update/',
            data : data,
            success : function(response){
                tempDict = [];
                console.log(response.user_info);
                $('#id_disability option:selected').removeAttr('selected');
                for (i in response.user_info){
                    $("#id_disability option[value=" + response.user_info[i] + "]").attr('selected','selected');
                }
            },
            error : function(response){
                console.log(response)
            }
        })

    })

 })

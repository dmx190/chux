$(document).ready(function() {
    setInterval(recargar, 3000);

    //LINE chart
    $.getJSON('/ajax/charity/line-chart')
        .done(function(data) {
            var lineChartData = {
                labels: data.labels,
                datasets: [
                    {
                        label: "income last 12 months",
                        fillColor: "transparent",
                        strokeColor: "#2795EA",
                        pointColor: "#2795EA",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: data.data
                    }
                ]
            };
            var lineChartCtx = document.getElementById("line-chart").getContext("2d");
            var lineChart = new Chart(lineChartCtx).Line(lineChartData, {
                bezierCurve: false,
                scaleShowGridLines: true,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: false
            });
        })

});

function recargar(){

    $.get('/ajax/temperatura/load').success(function(response) {
        $("#temp").html(response['temperatura'] + '°C');
        $('#rangeTemp').val(response['temperatura']);
    }).error(function() {

    });
}

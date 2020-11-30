// to show the chart
function clicked(recieved_data) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: recieved_data[0],
            datasets: [{
                label: '# of Votes',
                data: recieved_data[1],
                backgroundColor: colors(recieved_data[0].length, 0.2),
                borderColor: colors(recieved_data[0].length, 0.7),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Top something'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Movie'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Votes'
                    }
                }]
            }
        }
    });

}

function colors(num, a) {
    var COLORS = [];
    while (COLORS.length < num) {
        COLORS.push(`rgba(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}, ${a})`);
    }
    return COLORS
}
// random number generator
function rand(frm, to) {
    return ~~(Math.random() * (to - frm)) + frm;
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

var color = random_rgba();

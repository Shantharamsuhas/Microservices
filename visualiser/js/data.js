// to show the chart
function clicked(recieved_data) {
    var ctx = document.getElementById("chart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: recieved_data[0],
            datasets: [{
                label: 'Average Rating',
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
                text: 'Top Movies'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Votes'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Movie'
                    }
                }]
            }
        }
    });


    // dummy 2
    var ctx2 = document.getElementById("chart2").getContext('2d');
    var myChart2 = new Chart(ctx2, {
        type: 'horizontalBar',
        data: {
            labels: recieved_data[2],
            datasets: [{
                label: "Average Rating",
                data: recieved_data[3],
                backgroundColor: colors(recieved_data[2].length, 0.2),
                borderColor: colors(recieved_data[3].length, 0.7),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Least Popular Movies'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Rating'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Movie'
                    }
                }]
            }
        }
    });

    // dummy 3
    var ctx3 = document.getElementById("chart3").getContext('2d');
    var myChart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: recieved_data[4],
            datasets: [{
                label: '# of Votes',
                data: recieved_data[5],
                backgroundColor: colors(recieved_data[4].length, 0.2),
                borderColor: colors(recieved_data[5].length, 0.7),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Movies made per year'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Year'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '# of Movies'
                    }
                }]
            }
        }
    });


    // dummy 2
    var ctx4 = document.getElementById("chart4").getContext('2d');
    var myChart4 = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: recieved_data[6],
            datasets: [{
                label: '# of Votes',
                data: recieved_data[7],
                backgroundColor: colors(recieved_data[6].length, 0.2),
                borderColor: colors(recieved_data[7].length, 0.7),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Movies made by genres'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Genre'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '# of Movies'
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

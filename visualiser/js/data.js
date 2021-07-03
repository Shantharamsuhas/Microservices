// to show the chart

var myChart
var myChart1
var myChart2
var myChart3

function top_chart(data, update){
    var ctx = document.getElementById("chart").getContext('2d');
    // ctx.clearRect(0, 0, ctx.width, ctx.height);
    if(!update)
    {
        myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: data[0],
                datasets: [{
                    label: 'Average Rating',
                    data: data[1],
                    backgroundColor: colors(data[0].length, 0.2),
                    borderColor: colors(data[0].length, 0.7),
                    borderWidth: 1,
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
    }else{
        for (let i = 0; i < data[0].length; i++) {
            //removing old elements
            myChart.data.labels.pop();
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
            myChart.update();
        }
        for (let index = 0; index < data[0].length; index++) {
           
            myChart.data.labels.push(data[0][index]);
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(data[1][index]);
            });
            myChart.update()

        }
       
        
    }

}

function bottom_chart(data, update){
    var ctx2 = document.getElementById("chart2").getContext('2d');
    if(!update){
        myChart2 = new Chart(ctx2, {
            type: 'horizontalBar',
            data: {
                labels: data[0],
                datasets: [{
                    label: "Average Rating",
                    data: data[1],
                    backgroundColor: colors(data[0].length, 0.2),
                    borderColor: colors(data[1].length, 0.7),
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

    }else{
        console.log(data)
        for (let i = 0; i < data[0].length; i++) {
            //removing old elements
            myChart2.data.labels.pop();
            myChart2.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
            myChart2.update();
        }
        for (let index = 0; index < data[0].length; index++) {
           
            myChart2.data.labels.push(data[0][index]);
            myChart2.data.datasets.forEach((dataset) => {
                dataset.data.push(data[1][index]);
            });
            myChart2.update()

        }
    }

}

function range_chart(data, update){
    var ctx3 = document.getElementById("chart3").getContext('2d');
    if(!update){

        myChart3 = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: data[0],
                datasets: [{
                    label: '# of Votes',
                    data: data[1],
                    backgroundColor: colors(data[0].length, 0.2),
                    borderColor: colors(data[1].length, 0.7),
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
    }else{
        console.log(data)
        for (let i = 0; i < data[0].length; i++) {
            //removing old elements
            myChart3.data.labels.pop();
            myChart3.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
            myChart3.update();
        }
        for (let index = 0; index < data[0].length; index++) {
           
            myChart3.data.labels.push(data[0][index]);
            myChart3.data.datasets.forEach((dataset) => {
                dataset.data.push(data[1][index]);
            });
            myChart3.update()

        }
    }

}

function genre_chart(data, update){
    var ctx4 = document.getElementById("chart4").getContext('2d');
    if(!update){
        myChart4 = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: data[0],
                datasets: [{
                    label: '# of Votes',
                    data: data[1],
                    backgroundColor: colors(data[0].length, 0.2),
                    borderColor: colors(data[1].length, 0.7),
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
    }else{
        for (let i = 0; i < data[0].length; i++) {
            //removing old elements
            myChart4.data.labels.pop();
            myChart4.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
            myChart4.update();
        }
        for (let index = 0; index < data[0].length; index++) {
           
            myChart4.data.labels.push(data[0][index]);
            myChart4.data.datasets.forEach((dataset) => {
                dataset.data.push(data[1][index]);
            });
            myChart4.update()

        }
    }

}

function clicked() {
    data = getJSON("msg.json")
    data.then(function (recieved_data)
    {
    //    var recieved_data = result
       console.log(recieved_data[0]["alltime"])

        top_chart([recieved_data[0]["alltime"]["top_labels"].split("--"), recieved_data[0]["alltime"]["top_data"]], false)
        bottom_chart([recieved_data[0]["alltime"]["bottom_labels"].split("--"), recieved_data[0]["alltime"]["bottom_data"]], false)
        genre_chart([recieved_data[1][2020]["genre_labels"].split("--"), recieved_data[1][2020]["genre_data"]], false)
        range_chart([recieved_data[1][2020]["year_labels"].split("--"), recieved_data[1][2020]["year_data"]], false)
    })

   
}

function colors(num, a) {
    var COLORS = [];
    while (COLORS.length < num) {
        COLORS.push(`rgba(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}, 0.5)`);
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

function change_data(year){
    data = getJSON("msg.json")
    data.then(function (recieved_data)
    {
    // recieved_data = JSON.parse(data)
    switch(year){
        case "topall":
            top_chart([recieved_data[0]["alltime"]["top_labels"].split("--"), recieved_data[0]["alltime"]["top_data"]], true)
            break;

        case "top2020":
            top_chart([recieved_data[1][2020]["top_labels"].split("--"), recieved_data[1][2020]["top_data"]], true)
            break;

        case "top2019":
            top_chart([recieved_data[2][2019]["top_labels"].split("--"), recieved_data[2][2019]["top_data"]], true)
            break;

        case "top2018":
            top_chart([recieved_data[3][2018]["top_labels"].split("--"), recieved_data[3][2018]["top_data"]], true)
            break;

        case "top2017":
            top_chart([recieved_data[4][2017]["top_labels"].split("--"), recieved_data[4][2017]["top_data"]], true)
            break;
            
        case "top2016":
            top_chart([recieved_data[5][2016]["top_labels"].split("--"), recieved_data[5][2016]["top_data"]], true)
            break;

        case "bottomall":
            bottom_chart([recieved_data[0]["alltime"]["bottom_labels"].split("--"), recieved_data[0]["alltime"]["bottom_data"]], true)
            break;

        case "bottom2020":
            bottom_chart([recieved_data[1][2020]["bottom_labels"].split("--"), recieved_data[1][2020]["bottom_data"]], true)
            break;

        case "bottom2019":
            bottom_chart([recieved_data[2][2019]["bottom_labels"].split("--"), recieved_data[2][2019]["bottom_data"]], true)
            break;

        case "bottom2018":
            bottom_chart([recieved_data[3][2018]["bottom_labels"].split("--"), recieved_data[3][2018]["bottom_data"]], true)
            break;
            
        case "bottom2017":
            bottom_chart([recieved_data[4][2017]["bottom_labels"].split("--"), recieved_data[4][2017]["bottom_data"]], true)
            break;
            
        case "bottom2016":
            bottom_chart([recieved_data[5][2016]["bottom_labels"].split("--"), recieved_data[5][2016]["bottom_data"]], true)
            break;
            
        case "range1996":
            range_chart([recieved_data[5][2016]["year_labels"].split("--"), recieved_data[0]["alltime"]["year_data"]], true)
            break;

        case "range2020":
            range_chart([recieved_data[1][2020]["year_labels"].split("--"), recieved_data[1][2020]["year_data"]], true)
            break;

        case "range2011":
            range_chart([recieved_data[2][2019]["year_labels"].split("--"), recieved_data[2][2019]["year_data"]], true)
            break;

        case "range2006":
            range_chart([recieved_data[3][2018]["year_labels"].split("--"), recieved_data[3][2018]["year_data"]], true)
            break;
            
        case "range2001":
            range_chart([recieved_data[4][2017]["year_labels"].split("--"), recieved_data[4][2017]["year_data"]], true)
            break;
            
        case "genre2020":
            genre_chart([recieved_data[1][2020]["genre_labels"].split("--"), recieved_data[1][2020]["genre_data"]], true)
            break;
        
        case "genre2019":
            genre_chart([recieved_data[2][2019]["genre_labels"].split("--"), recieved_data[2][2019]["genre_data"]], true)
            break;
            
        case "genre2018":
            genre_chart([recieved_data[3][2018]["genre_labels"].split("--"), recieved_data[3][2018]["genre_data"]], true)
            break;
            
        case "genre2017":
            genre_chart([recieved_data[4][2017]["genre_labels"].split("--"), recieved_data[4][2017]["genre_data"]], true)
            break;
            
        case "genre2016":
            genre_chart([recieved_data[5][2016]["genre_labels"].split("--"), recieved_data[5][2016]["genre_data"]], true)
            break;    
    }
})
}

function getJSON(path) {
    return fetch(path).then(response => response.json());
}
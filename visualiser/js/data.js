// to show the chart

var myChart
var myChart1
var myChart2
var myChart3
var current_top_data = []
var current_bottom_data = []

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
                legend: {
                    display: false
                },
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
                },onClick: function(c,i) {
                    e = i[0];
                    get_details(current_top_data[2][e._index])
                    // var x_value = this.data.labels[e._index];
                    // var y_value = this.data.datasets[0].data[e._index];
                    // console.log(x_value);
                    // console.log(y_value);
                }
                // onClick: function(c,i) {
                //     // c is pointer event
                //     // if (i.length === 0) return

                //     e = c[0];
                //     console.log(e._datasetIndex)
                //     var x_value = myChart.data.labels[e._index];
                //     var y_value = myChart.data.datasets[0].data[e._index];
                //     console.log(x_value);
                //     console.log(y_value);
                // }
                // onClick: function(evt) {
                //     var activePoints = myChart.getElementsAtEvent(evt)[0]._datasetIndex.label;
                //     console.log(activePoints);
                // }
            }
        
        
        
        });
    }else{
        myChart.destroy()
        top_chart(data, false)
        // for (let i = 0; i < data[0].length; i++) {
        //     //removing old elements
        //     myChart.data.labels.pop();
        //     myChart.data.datasets.forEach((dataset) => {
        //         dataset.data.pop();
        //     });
        //     myChart.update();
        // }
        // for (let index = 0; index < data[0].length; index++) {

        //     myChart.data.labels.push(data[0][index]);
        //     myChart.data.datasets.forEach((dataset) => {
        //         dataset.data.push(data[1][index]);
        //     });
        //     myChart.update()

        // }

        
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
                legend: {
                    display: false
                },
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
                },onClick: function(c,i) {
                    e = i[0];
                    get_details(current_bottom_data[2][e._index])
                }
            }
        });

    }else{
        myChart2.destroy()
        bottom_chart(data, false)
        // console.log(data)
        // for (let i = 0; i < data[0].length; i++) {
        //     //removing old elements
        //     myChart2.data.labels.pop();
        //     myChart2.data.datasets.forEach((dataset) => {
        //         dataset.data.pop();
        //     });
        //     myChart2.update();
        // }
        // for (let index = 0; index < data[0].length; index++) {
           
        //     myChart2.data.labels.push(data[0][index]);
        //     myChart2.data.datasets.forEach((dataset) => {
        //         dataset.data.push(data[1][index]);
        //     });
        //     myChart2.update()

        // }
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
                    // label: '# of Movies',
                    data: data[1],
                    backgroundColor: colors(data[0].length, 0.2),
                    borderColor: colors(data[1].length, 0.7),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Movies made per year'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines: {
                            offsetGridLines: data[0].length > 1 ? false : true 
                        },
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

        myChart3.destroy()
        range_chart(data, false)

        // console.log(data)
        // for (let i = 0; i < data[0].length; i++) {
        //     //removing old elements
        //     myChart3.data.labels.pop();
        //     myChart3.data.datasets.forEach((dataset) => {
        //         dataset.data.pop();
        //     });
        //     myChart3.update();
        // }
        // for (let index = 0; index < data[0].length; index++) {
        //     myChart3.data.labels.push(data[0][index]);
        //     myChart3.data.datasets.forEach((dataset) => {
        //         dataset.data.push(data[1][index]);
        //     });
        //     myChart3.update()

        // }
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
                    // label: '# of Movies',
                    data: data[1],
                    backgroundColor: colors(data[0].length, 0.2),
                    borderColor: colors(data[1].length, 0.7),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
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
        console.log(data)
        myChart4.destroy()
        genre_chart(data, false)
        // for (let i = 0; i < data[0].length; i++) {
        //     //removing old elements
        //     myChart4.data.labels.pop();
        //     myChart4.data.datasets.forEach((dataset) => {
        //         dataset.data.pop();
        //     });
        //     myChart4.update();
        // }
        // for (let index = 0; index < data[0].length; index++) {
           
        //     myChart4.data.labels.push(data[0][index]);
        //     myChart4.data.datasets.forEach((dataset) => {
        //         dataset.data.push(data[1][index]);
        //     });
        //     myChart4.update()

        // }
    }

}

function clicked() {
    data = getJSON("msg.json")
    data.then(function (recieved_data)
    {
    //    var recieved_data = result
        // console.log(recieved_data[0]["alltime"])

        get_data(5, "alltime", "top", false)
        get_data(5, "alltime", "bottom", false)
        get_genre_data(2020, false)
        get_range_data(2016, 2020, false)
        // top_chart([recieved_data[0]["alltime"]["top_labels"].split("--"), recieved_data[0]["alltime"]["top_data"]], false)
        // bottom_chart([recieved_data[0]["alltime"]["bottom_labels"].split("--"), recieved_data[0]["alltime"]["bottom_data"]], false)
        // genre_chart([recieved_data[1][2020]["genre_labels"].split("--"), recieved_data[1][2020]["genre_data"]], false)
        // range_chart([recieved_data[1][2020]["year_labels"].split("--"), recieved_data[1][2020]["year_data"]], false)
    })
}

function get_data(limit, year, chart, update = true){
    if(limit < 1 || !limit){
        limit = 5
    }
    // console.log(limit, year)
    data = {limit : limit, year : year, desc : true}
    if (chart == "bottom"){
        data = {limit : limit, year : year, desc : false}
    }
    fetch("http://localhost:8080/get_data", {
    method: "POST",headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
    }).then(response => response.json()).then(res => {
    console.log("Request complete! response:", res.res, res.labels, res.data, res.tconst);
    if(res.res == "success"){
        if(chart == "top"){
            current_top_data = [res.labels.split("--"), res.data, res.tconst]
            top_chart([res.labels.split("--"), res.data], update)
        }else if(chart == "bottom"){
            current_bottom_data = [res.labels.split("--"), res.data, res.tconst]
            bottom_chart([res.labels.split("--"), res.data], update)
        }
    }else{
        console.log("Error recieving data")
    }
    });
}

function get_genre_data(year, update = true){
    data = {year : year}
    console.log(data)
    fetch("http://localhost:8080/get_genre_data", {
    method: "POST",headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
    }).then(response => response.json()).then(res => {
    console.log("Request complete! response:", res.res, res.labels, res.data);
    if(res.res == "success"){
        genre_chart([res.labels.split("--"), res.data], update)
    }else{
        console.log("Error recieving data")
    }
    });
}

function get_range_data(startYear, endYear, update = true){
    if(startYear > endYear){
        data = {startYear : endYear, endYear : startYear}
    }else{
        data = {startYear : startYear, endYear : endYear}
    }
    console.log(data)
    fetch("http://localhost:8080/get_range_data", {
    method: "POST",headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
    }).then(response => response.json()).then(res => {
    console.log("Request complete! response:", res.res, res.labels, res.data);
    if(res.res == "success"){
        range_chart([res.labels.split("--"), res.data], update)
    }else{
        console.log("Error recieving data")
    }
    });
}

function get_details(tconst){
    window.open("https://www.imdb.com/title/" + tconst + "/", "_blank")
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
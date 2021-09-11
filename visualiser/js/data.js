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
                    
                }
                
            }
        
        
        
        });
    }else{
        myChart.destroy()
        top_chart(data, false)
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

function on_load() {
    get_data(5, "alltime", "top", false)
    get_data(5, "alltime", "bottom", false)
    get_genre_data(2020, false)
    get_range_data(2016, 2020, false)
}

// function to load another page given tconst 
function load_detailed_page(tconst){
    tconst = tconst.split("/").at(-1)
    console.log(tconst)
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
    window.location.href = "details_page/"+tconst
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
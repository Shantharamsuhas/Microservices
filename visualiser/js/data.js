// to show the chart

var my_top_chart
var my_genre_chart
var my_bottom_chart
var my_range_chart
var current_top_data = []
var current_bottom_data = []

function top_chart(data, update){
    var top_ctx = document.getElementById("top_chart").getContext('2d');
    // top_ctx.height = get_height(data[0].length);
    var min_val = Math.min.apply(Math, data[1].map(i=>Number(i)));
    var max_val = Math.max.apply(Math, data[1].map(i=>Number(i)));
    if(!update)
    {
        my_top_chart = new Chart(top_ctx, {
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
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top Movies'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            min: min_val - 0.5 > 0 ? min_val - 0.5 : 0,
                            max: max_val + 0.5 < 10 ? max_val + 0.5 : 10,
                            stepSize:0.5
                        },
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
                    get_details(current_top_data[0][e._index], current_top_data[2][e._index])
                    
                }
                
            }
        });
    }else{
        my_top_chart.destroy()
        top_chart(data, false)
    }
    // var can = document.getElementById("top_container");
    // console.log("top chart ", can.height)
    // window.addEventListener("resize", function() {
    //     var new_height = get_height(data[0].length);
    //     can.height = new_height;
    //     console.log("new height is ", new_height)
    // });
    // can.height = get_height(data[0].length);
    // console.log("top chart updated", can.height)
    // document.getElementById("top_chart").height = get_height(data[0].length);
}

function bottom_chart(data, update){
    // document.getElementById("bottom_chart").height = get_height(data[0].length);
    var bottom_ctx = document.getElementById("bottom_chart");
    var min_val = Math.min.apply(Math, data[1].map(i=>Number(i)));
    var max_val = Math.max.apply(Math, data[1].map(i=>Number(i)));
    if(!update){
        my_bottom_chart = new Chart(bottom_ctx.getContext('2d'), {
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
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Least Popular Movies'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            min: min_val - 0.5 > 0 ? min_val - 0.5 : 0,
                            max: max_val + 0.5 < 10 ? max_val + 0.5 : 10,
                            stepSize:0.5
                        },
                        display: true,
                        beginAtzero: true,
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
                    get_details(current_bottom_data[0][e._index], current_bottom_data[2][e._index])
                }
            }
        });

    }else{
        my_bottom_chart.destroy()
        bottom_chart(data, false)
    }
    // alert("bottom chart ", bottom_ctx.height)
    var can = document.getElementById("bottom_chart");
    console.log("bottom chart ", can.height)
    // window.addEventListener("resize", function() {
    //     var new_height = get_height(data[0].length);
    //     can.height = new_height;
    //     console.log("new height is ", new_height)
    // });
    can.height = get_height(data[0].length);
    console.log("bottom chart updated", can.height)
}

function range_chart(data, update){
    var range_ctx = document.getElementById("range_chart").getContext('2d');
    if(!update){

        my_range_chart = new Chart(range_ctx, {
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
        my_range_chart.destroy()
        range_chart(data, false)
    }

}

function genre_chart(data, update){
    var genre_ctx = document.getElementById("genre_chart").getContext('2d');
    if(!update){
        my_genre_chart = new Chart(genre_ctx, {
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
        my_genre_chart.destroy()
        genre_chart(data, false)
       
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
    fetch("http://localhost:1311/get_data", {
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
    fetch("http://localhost:1311/get_genre_data", {
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
    fetch("http://localhost:1311/get_range_data", {
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

function get_details(title, tconst){
    console.log(title)
    window.open(`details_page/${tconst}##${title}`, '_blank')
}

function get_height(data_points){
    if(data_points/5 > 2){
        height = (data_points/5 - 2).toFixed() * 100 + 150;
        console.log("height is ",height )
        return height
    }else
        console.log("height is not added")
        return 150;
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
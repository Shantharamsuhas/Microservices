var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs')
var fetch = require("cross-fetch");
app.use(express.json());




function openPort(app) {
    app.use(express.static(path.join(__dirname, 'js')));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    });
    
    app.engine('html', require('ejs').renderFile);
    app.get('/details_page/:tconst', function(req, res){
        res.sendFile(path.join(__dirname + '/details_page.html'));
    })

    app.post('/get_genre_data',async function(req, res) {
        try {
            year = req.body.year
            await client.query("select genre, count(year) from genre_table where year = '" + year + "' group by year, genre order by count(year) desc limit 5").then
            (function(result) {
                console.log(result.rows)
                res_data = toRows(result.rows, result.rowCount)
                if (typeof res_data === "undefined")
                {
                    res.send({res : "error retriving data"})
                }else{
                    if(res_data.length != 0){
                        res.send({res : "success", labels: res_data[0].join("--"), data: res_data[1]})
                    }else{
                        res.send({res : "error retriving data"})
                    }
                }
            })
        }catch(err) {
            console.log(err)
            res.send({res : "error retriving data"})
        }
    })

    app.post('/get_range_data', async function(req, res) {
        try {
            startYear = req.body.startYear
            endYear = req.body.endYear
    
            await client.query("select * from year_table where year between "  + startYear + " and " + endYear + " order by year desc ").then
            (function(result) {
                res_data = toRows(result.rows, result.rowCount)
                if (typeof res_data === "undefined")
                {
                    res.send({res : "error retriving data"})
                }else{
                    if(res_data.length != 0){
                        res.send({res : "success", labels: res_data[0].join("--"), data: res_data[1]})
    
                    }else{
                        res.send({res : "error retriving data"})
                    }
                }
            })
        }catch(err){
            console.log(err)
            res.send({res : "error retriving data"})
        }
        
    })
    
    app.post('/get_data', async function (req, res) {
        try {
            console.log(req.body.table)
            // process the request
            limit = req.body.limit
            year = req.body.year
            desc = ""
            if (req.body.desc) {
                desc = "desc"
            }
            if (year === "alltime")
            {
                query = "select primarytitle, averagerating, tconst from movie_table order by averagerating " + desc +  " limit " + limit
            }else
            {
                query = "select primarytitle, averagerating, tconst from movie_table where startyear = '" + year + ".0' order by averagerating " + desc +  " limit " + limit
            }
            await client.query(query).then(function (result) {
                res_data = toRows(result.rows, result.rowCount, true)
                if (typeof res_data === "undefined")
                {
                    res.send({res : "error retriving data"})
                }else{
                    if(res_data.length != 0){
                        res.send({res : "success", labels: res_data[0].join("--"), data: res_data[1], tconst : res_data[2]})
                    }else{
                        res.send({res : "error retriving data"})
                    }
                }
            })
        } catch (err) {
            console.log(err)
            res.send({res : "error retriving data"})
        }
    })

    app.get('/api/check-status', async function(req, res){
        try {
            res.send({status : "success"})
        }
        catch(err) {
            console.log(err)
            res.send({res : "error retriving status"})
        }
    })

    app.listen(8080);
}


const { Pool } = require('pg')
const client = new Pool({
    user: "admin",
    password: "admin",
    host: "database",
    port: 5432,
    database: "dummy"
})




// var top_movies
// var idresult
// var label
// var bar_data
// var years = [2020,2019,2018,2017,2016]
// var year_range = ["2016 and 2020", "2011 and 2015", "2006 and 2010", "2001 and 2005", "1996 and 2000"]
// var all_data = []
loadData().then(() => {
    openPort(app)}).catch(err => {
        console.log(err)
    })

// async function execute(app) {
//     try {
    

//         openPort(app)
//         // await client.connect()
        
//         // console.log("Connected successfully")
//         // console.log(years)
//         // // to add alltime data
//         // top_movies = await client.query("select primarytitle, averagerating from movie_table order by averagerating desc limit 5")
//         // bottom_movies = await client.query("select primarytitle, averagerating from movie_table order by averagerating limit 5")
//         // by_year = await client.query("select * from year_table order by movies_made desc limit 5")
//         // by_genre = await client.query("select * from genre_table order by movies_made desc limit 5")
//         // top_data = toRows(top_movies.rows, top_movies.rowCount)
//         // bottom_data = toRows(bottom_movies.rows, bottom_movies.rowCount)
//         // year_data = toRows(by_year.rows, by_year.rowCount)
//         // genre_data = toRows(by_genre.rows, by_genre.rowCount)

//         // all_data.push({"alltime" : { "top_labels" : top_data[0].join("--"), "top_data" : top_data[1],
//         // "bottom_labels" : bottom_data[0].join("--"), "bottom_data" : bottom_data[1],
//         // "year_labels" : year_data[0].reverse().join("--"), "year_data" : year_data[1].reverse(),
//         // "genre_labels" : genre_data[0].join("--"), "genre_data" : genre_data[1] }})
        
//         // for (year in years)
//         // {
//         //     top_movies = await client.query("select primarytitle, averagerating from movie_table where startyear = '"+ years[year] + ".0' order by averagerating desc limit 5")
//         //     bottom_movies = await client.query("select primarytitle, averagerating from movie_table where startyear = '"+ years[year] + ".0' order by averagerating limit 5")
//         //     by_year = await client.query("select * from year_table where year between "  + year_range[year] + " order by movies_made desc")
//         //     by_genre = await client.query("select genre, count(movies_made) from genre_table where movies_made = " +years[year]+ " group by movies_made, genre order by count(movies_made) desc limit 5")
//         //     top_data = toRows(top_movies.rows, top_movies.rowCount)
//         //     bottom_data = toRows(bottom_movies.rows, bottom_movies.rowCount)
//         //     year_data = toRows(by_year.rows, by_year.rowCount)
//         //     genre_data = toRows(by_genre.rows, by_genre.rowCount)
//         //     all_data.push({ [years[year]] : { "top_labels" : top_data[0].join("--"), "top_data" : top_data[1],
//         //     "bottom_labels" : bottom_data[0].join("--"), "bottom_data" : bottom_data[1],
//         //     "year_labels" : year_data[0].reverse().join("--"), "year_data" : year_data[1].reverse(),
//         //     "genre_labels" : genre_data[0].join("--"), "genre_data" : genre_data[1] }})
//         // }
//         // toJSON(all_data)
//         // // await client.end()
//         // console.log("Client disconnected")
//     }
//     catch (ex) {
//         console.log("Error : " + ex)
//     }
//     // finally {
//     //     // client.end()
//     //     // console.log("client disconnected")
//     // }
// }

async function loadData() {
    try {
        const result = await fetch("http://collector:4321/api/load-data/MOVIES").then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log("data loaded")
            } else {
                console.log("data not loaded")
            }
        }).catch(err => {   
            console.log(err)
        })
        return result
    }
    catch (ex) {
        console.log(ex)
    }
}

// returns an array of integers
function toRows(data, rowCount, hastconst = false) {
    // console.log("data")
    // console.log(Object.values(data[0])[0])
    var arr1 = new Array()
    for (let i = 0; i < rowCount; i++) {
        arr1.push(Object.values(data[i])[0])
    }
    arr1 = [].concat.apply([], arr1)

    var arr2 = new Array()
    for (let i = 0; i < rowCount; i++) {
        arr2.push(parseFloat(Object.values(data[i])[1]).toFixed(1))
    }
    arr2 = [].concat.apply([], arr2)

    if (hastconst) {
        var tconst = new Array()
        for (let i = 0; i < rowCount; i++) {
            movie_id = Object.values(data[i])[2]
            len = 7 - movie_id.toString().length
            console.log(len)
            if(len > 0){
                tconst.push("tt" + "0".repeat(len) + movie_id)
            }else
                tconst.push("tt" + movie_id)
        }
        tconst = [].concat.apply([], tconst)
        return [arr1, arr2, tconst]
    }
    // console.log(arr1)
    // console.log(arr2)
    // returns labels and data
    return [arr1, arr2]

}


// function toJSON(data) {
    
//     fs.writeFile(__dirname + "/js/msg.json", JSON.stringify(data), function (err) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(" JS file created" + data)
//         }
//     })
// }
module.exports = toRows;

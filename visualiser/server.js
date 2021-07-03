var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs')




function openPort(app) {
    app.use(express.static(path.join(__dirname, 'js')));
    app.get('/', function (req, res) {
        execute()
        res.sendFile(path.join(__dirname + '/index.html'));
    });
    app.listen(8080);
}
const { Client } = require('pg')
const client = new Client({
    user: "admin",
    password: "admin",
    host: "database",
    port: 5432,
    database: "dummy"
})




var top_movies
var idresult
var label
var bar_data
var years = [2020,2019,2018,2017,2016]
var year_range = ["2016 and 2020", "2011 and 2015", "2006 and 2010", "2001 and 2005", "1996 and 2000"]
var all_data = []

execute(app)
async function execute(app) {
    try {
        openPort(app)
        await client.connect()
        
        console.log("Connected successfully")
        console.log(years)
        // to add alltime data
        top_movies = await client.query("select primarytitle, averagerating from movie_table order by averagerating desc limit 5")
        bottom_movies = await client.query("select primarytitle, averagerating from movie_table order by averagerating limit 5")
        by_year = await client.query("select * from year_table order by movies_made desc limit 5")
        by_genre = await client.query("select * from genre_table order by movies_made desc limit 5")
        top_data = toRows(top_movies.rows, top_movies.rowCount)
        bottom_data = toRows(bottom_movies.rows, bottom_movies.rowCount)
        year_data = toRows(by_year.rows, by_year.rowCount)
        genre_data = toRows(by_genre.rows, by_genre.rowCount)

        all_data.push({"alltime" : { "top_labels" : top_data[0].join("--"), "top_data" : top_data[1],
        "bottom_labels" : bottom_data[0].join("--"), "bottom_data" : bottom_data[1],
        "year_labels" : year_data[0].reverse().join("--"), "year_data" : year_data[1].reverse(),
        "genre_labels" : genre_data[0].join("--"), "genre_data" : genre_data[1] }})
        
        for (year in years)
        {
            top_movies = await client.query("select primarytitle, averagerating from movie_table where startyear = '"+ years[year] + ".0' order by averagerating desc limit 5")
            bottom_movies = await client.query("select primarytitle, averagerating from movie_table where startyear = '"+ years[year] + ".0' order by averagerating limit 5")
            by_year = await client.query("select * from year_table where year between "  + year_range[year] + " order by movies_made desc")
            by_genre = await client.query("select genre, count(movies_made) from genre_table where movies_made = " +years[year]+ " group by movies_made, genre order by count(movies_made) desc limit 5")
            top_data = toRows(top_movies.rows, top_movies.rowCount)
            bottom_data = toRows(bottom_movies.rows, bottom_movies.rowCount)
            year_data = toRows(by_year.rows, by_year.rowCount)
            genre_data = toRows(by_genre.rows, by_genre.rowCount)
            all_data.push({ [years[year]] : { "top_labels" : top_data[0].join("--"), "top_data" : top_data[1],
            "bottom_labels" : bottom_data[0].join("--"), "bottom_data" : bottom_data[1],
            "year_labels" : year_data[0].reverse().join("--"), "year_data" : year_data[1].reverse(),
            "genre_labels" : genre_data[0].join("--"), "genre_data" : genre_data[1] }})
        }
        // toJS([top_data, bottom_data, year_data, genre_data])
        toJSON(all_data)
        await client.end()
        console.log("Client disconnected")
    }
    catch (ex) {
        console.log("Error : " + ex)
    }
    finally {
        client.end()
        console.log("client disconnected")
    }
}


// returns am array of integers
function toRows(data, rowCount) {
    // console.log("data")
    // console.log(Object.values(data[0])[0])
    var arr1 = new Array()
    for (let i = 0; i < rowCount; i++) {
        arr1.push(Object.values(data[i])[0])
    }
    arr1 = [].concat.apply([], arr1)

    var arr2 = new Array()
    for (let i = 0; i < rowCount; i++) {
        arr2.push(parseFloat(Object.values(data[i])[1]))
    }
    arr2 = [].concat.apply([], arr2)
    // console.log(arr1)
    // console.log(arr2)
    return [arr1, arr2]

}


// function toJson(data, fileName) {
//     var fs = require('fs')
//     fs.writeFile(fileName + ".json", data, function (err) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(fileName + " JSON file created")
//         }
//     })
// }

function toJSON(data) {
    // console.log(data)
    // var dataa = "{2021 :  { \"var top_labels\" : [" + "\"" + data[0][0].join("\",\"") + "\"" + "], \"top_data\" : [" + data[0][1] + "], \"bottom_labels\" : [" + "\"" + data[1][0].join("\",\"") + "\"" + "], \"bottom_data\" : [" + data[1][1] + "], \"year_labels\" : [" + "\"" + data[2][0].reverse().join("\",\"") + "\"" + "], \"year_data\" : [" + data[2][1].reverse() + "], \"genre_labels\" : [" + "\"" + data[3][0].join("\",\"") + "\"" + "], \"genre_data\" : [" + data[3][1] + "] }}"
    
    fs.writeFile(__dirname + "/js/msg.json", JSON.stringify(data), function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(" JS file created" + data)
        }
    })

}
function toJS(data) {
    console.log('arrived')
    // console.log(data)
    var dataa = "var top_labels = [" + "\"" + data[0][0].join("\",\"") + "\"" + "], top_data = [" + data[0][1] + "], bottom_labels = [" + "\"" + data[1][0].join("\",\"") + "\"" + "], bottom_data = [" + data[1][1] + "], year_labels = [" + "\"" + data[2][0].reverse().join("\",\"") + "\"" + "], year_data = [" + data[2][1].reverse() + "], genre_labels = [" + "\"" + data[3][0].join("\",\"") + "\"" + "], genre_data = [" + data[3][1] + "]"

    fs.writeFile(__dirname + "/js/msg.js", dataa, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(" JS file created" + data)
        }
    })

}
module.exports = toRows;

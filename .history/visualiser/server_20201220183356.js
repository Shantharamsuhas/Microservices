var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs')





app.use(express.static(path.join(__dirname, 'js')));
app.get('/', function (req, res) {
    console.log("it worked")
    execute()
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.listen(8080);

const { Client } = require('pg')
const client = new Client({
    user: "admin",
    password: "admin",
    host: "database",
    port: 5432,
    database: "dummy"
})




var tconst2result
var idresult
var label
var bar_data

execute()
async function execute() {
    try {
        await client.connect()
        console.log("Connected successfully")
        tconst2result = await client.query("select primarytitle, averagerating from cleaned_movie_rating_table order by averagerating desc limit 5")
        // idresult = await client.query("select tconst2 from movie_table")
        // label = toRows(idresult.rows, tconst2result.rowCount, true)
        bar_data = toRows(tconst2result.rows, tconst2result.rowCount)
        toJS([label, bar_data])
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
    console.log("data")
    console.log(Object.values(data[0])[0])
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
    console.log(arr1)
    console.log(arr2)
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

function toJS(data) {
    console.log()
    var dataa = "var labels = [" + "\"" + data[1][0].join("\",\"") + "\"" + "], data = [" + data[1][1] + "]"

    fs.writeFile(__dirname + "/js/msg.js", dataa, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(" JS file created" + data)
        }
    })

}

module.exports = toRows;

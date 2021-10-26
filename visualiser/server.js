var express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");
var app = express();
var path = require('path');
var fs = require('fs')
var fetch = require("cross-fetch");
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



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

    app.post('/get_titles', async function (req, res) {
        try{
            tconst = req.body.tconst
            await fetchPlotTitle(tconst).then(function(data) {
                res.send(JSON.stringify({res: "success", title: data['movie_title']['title'], synopsis: data['Plot']['plot']}))
            })
        } catch (err) {
            console.log(err)
            res.send({res : "error retriving title and synopsis"})
        }
    })

    // app.post('/get_movie_title', async function (req, res) {
    //     try{
    //         tconst = req.body.tconst
    //         console.log("tconstant received by api", tconst)
    //         await fetachMvieTitles(tconst).then(function(movie_title) {
    //             res.send(JSON.stringify({res : "success", movietitle : movie_title}))
    //         })
    //     } catch (err) {
    //         console.log(err)
    //         res.send({res : "error retriving movie title"})
    //     }
    // })

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





loadData().then(() => {
    openPort(app)}).catch(err => {
        console.log(err)
    })

async function loadData() {
    try {
        const result = await fetch("http://vis_collector:4321/api/load-data/MOVIES").then(response => response.json()).then(data => {
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
    return [arr1, arr2]

}

module.exports = toRows;


// SCRAPER 
// const fetchTitles = async () => {
//     try {
//     // get current page url
//      let current_page = 'http://localhost:8080/details_page/tt0068646' 
//     //  let current_page = window.location.href
//     // extract tconst id
//      let tconst = current_page.match(/(?<!\w)tt\w+/g);
//      const response = await        
//      axios.get('https://www.imdb.com/title/'+tconst+'/plotsummary?ref_=tt_stry_pl#synopsis');
       
//         const html = response.data;
  
//      const $ = cheerio.load(html);
//     //  console.log(pretty($.html()));
//      const synopsys = [];
   
//      $('#plot-synopsis-content').each((_idx, el) => {
//       const title = $(el).text()
//     //   console.log(title)
//       synopsys.push(title)
//      });
   
//      return synopsys;
//     } catch (error) {
//      throw error;
//     }
//    };
  
    
//    async function call_scraper() {
//     let abc = await fetchTitles();
//     // console.log(abc);
//     return abc
//   }

// async function fetchTitles(tconst){
//     try {
//         // get current page url
//         // let current_page = 'http://localhost:8080/details_page/tt0068646' 
//         //  let current_page = window.location.href
//         // extract tconst id
//         // let tconst = current_page.match(/(?<!\w)tt\w+/g);
//         const response = await axios.get('https://www.imdb.com/title/'+tconst+'/plotsummary?ref_=tt_stry_pl#synopsis');
//         const html = response.data;
//         const $ = cheerio.load(html);
//         //  console.log(pretty($.html()));
//         const synopsys = [];
    
//         $('#plot-synopsis-content').each((_idx, el) => {
//         const title = $(el).text()
//         //   console.log(title)
//         synopsys.push(title)
//         });
//         return synopsys[0];
//     }catch (error) {
//         throw error;
//     }
// };

async function fetchPlotTitle(tconst){
    try {
        // get current page url
        // let current_page = 'http://localhost:8080/details_page/tt0068646' 
        //  let current_page = window.location.href
        // extract tconst id
        // let tconst = current_page.match(/(?<!\w)tt\w+/g);
        var data = new Array();
        const response = await axios.get('https://www.imdb.com/title/'+tconst +'/plotsummary?ref_=tt_stry_pl#synopsis', {headers: {
            locale: 'en'
        }});
        const html = response.data;
        const $ = cheerio.load(html);
        const synopsis = [];
        const title = [];
        $('h3 a').each((_idx, el) => {
        var movie_title = $(el).text();
        title.push({"title": movie_title});
        console.log(title)
        data['movie_title'] = title[0]
        });
        $('#plot-synopsis-content').each((_idx, el) => {
        var plot = $(el).text();
        console.log(plot)
        synopsis.push({"plot": plot});
        data['Plot'] = synopsis[0]
        });
        return data
    }catch (error) {
        throw error;
    }
};



// async function fetachMvieTitles(tconst){
//     try {
//         // get current page url
//         // let current_page = 'http://localhost:8080/details_page/tt0068646' 
//         //  let current_page = window.location.href
//         // extract tconst id
//         // let tconst = current_page.match(/(?<!\w)tt\w+/g);
//         const response = await axios.get('https://www.imdb.com/title/'+tconst);
//         console.log(response)
//         const html = response.data;
//         const $ = cheerio.load(html);
//         console.log(pretty($.html()));
//         const movietitle = [];
//         $('h1').each((_idx, el) => {
//         const title = $(el).text()
//         console.log(title)
//         movietitle.push(title)
//         console.log(movietitle)
//         });
//         return movietitle[0];
//     }catch (error) {
//         throw error;
//     }
// };

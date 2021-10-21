const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");

const fetchTitles = async () => {
    try {
    // get current page url
     let current_page = 'http://localhost:8080/details_page/tt0068646' 
    //  let current_page = window.location.href
    // extract tconst id
     let tconst = current_page.match(/(?<!\w)tt\w+/g);
     const response = await        
     axios.get('https://www.imdb.com/title/'+tconst+'/plotsummary?ref_=tt_stry_pl#synopsis');
       
        const html = response.data;

     const $ = cheerio.load(html);
    //  console.log(pretty($.html()));
     const synopsys = [];
   
     $('#plot-synopsis-content').each((_idx, el) => {
      const title = $(el).text()
    //   console.log(title)
      synopsys.push(title)
     });
   
     return synopsys;
    } catch (error) {
     throw error;
    }
   };
   
   fetchTitles().then((synopsys) => console.log(synopsys));
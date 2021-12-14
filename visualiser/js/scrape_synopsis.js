function fetchTitles(){
  var url = window.location.href
  movie_id = url.split("/").at(-1).split("##").at(0)
  movie_title = url.split("/").at(-1).split("##").at(1).replaceAll("%20", " ")
  data = {tconst : movie_id}
  document.getElementById("main_title").innerHTML = movie_title
  document.getElementById("title").innerHTML = movie_title
  fetchRecommendations(movie_id)
  for_tag = ""
  fetch("http://localhost:1311/get_titles", {
      method: "POST",  headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
      }).then(response => response.json()).then(res => {
      console.log("Request complete! response:", res.res);
      console.log("Request complete! synopsis:", res.synopsis);
      console.log("Request complete! title:", res.title);
      if(res.res == "success"){
      for_tag = res.synopsis.replaceAll("\"", "\\\"")
      fetchTags(for_tag)
      document.getElementById('synpsis_text_area').value = res.synopsis.trim()
      document.getElementById('p1').innerHTML = "If you liked \" " + movie_title + " \" you might also like:" 
      }else{
      document.getElementById('synpsis_text_area').value = "Error recieving synopsis"
      console.log("Error recieving data")
      }
      });
  };

  function fetchTags(for_tag){
  
    data = {data : for_tag}
    document.getElementById('h1').innerHTML = "Loading Tags..."
    if (for_tag.trim().startsWith("It looks like we don't have a Synopsis")){
      document.getElementById('h1').innerHTML = "No Tags Available"
    }else{
      setTimeout(function() {
        fetch("http://localhost:3311/get-synopsis", {
          method: "POST", headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify(data)
        }).then(response => response.json()).then(res => {
          console.log("Requested completed: ", res.res, res.tags);
          if(res.res == "success"){
            document.getElementById('h1').innerHTML = res.tags.trim()
            console.log(res.tags.trim())
          }
          else {
            document.getElementById('h1').innerHTML = "Error recieving data"
            console.log("Error recieving data")
          }      
        }).catch(err => {
          document.getElementById('h1').style.color = "red"
          document.getElementById('h1').innerHTML = "Tags Prediction Service is down. Tags cannot be loaded"
        });
      }, 40);
    }
    };

function fetchRecommendations(tconst){
  fetch("http://localhost:2211/get-recommendation/id/" + tconst).then(response => response.json()).then(res => {
      console.log("Request complete! response:", res.res, res.movies);
      if(res.res == "success"){
        if(res.movies.split("),").length > 1){
          process_response(res.movies.trim())
          console.log(res.tconst)
        }else{
          document.getElementById("rec_error_txt").innerHTML = "Could not find any recommendations for this Movie"
        }
      }else{
        // process_response(res.movies.trim())
        console.log("Error recieving data")
      }
      }).catch(err => {
        console.log(err)
        document.getElementById("rec_error_txt").innerHTML = "Recommender Service Down. Cannot Load Recommendations"
      })
  };

function process_response(recommendation) {
  var list = recommendation.split("),")
  var display = document.getElementById("loop")
  display.innerHTML = ""
  var display2 = document.getElementById("loop")
  list.forEach(function (item, index) {
      var entry = document.createElement('li');
      entry.setAttribute("id", "show")
      entry.appendChild(document.createTextNode(item+")"));
      display2.appendChild(entry);
      console.log(item)
  });
}


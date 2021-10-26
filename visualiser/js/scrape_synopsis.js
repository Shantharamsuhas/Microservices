function fetchTitles(){
  var url = window.location.href
  movie_id = url.split("/").at(-1)
  data = {tconst : movie_id}
  console.log(movie_id) 
  fetchRecommendations(movie_id)
  fetch("http://localhost:8080/get_titles", {
      method: "POST",  headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
      }).then(response => response.json()).then(res => {
      console.log("Request complete! response:", res.res);
      console.log("Request complete! synopsis:", res.synopsis);
      console.log("Request complete! title:", res.title);
      if(res.res == "success"){
      document.getElementById('synpsis_text_area').value = res.synopsis
      document.getElementById('p1').innerHTML = "If you liked \" " + res.title + " \" you might also like:" 
      }else{
      document.getElementById('synpsis_text_area').value = "Error recieving synopsis"
      console.log("Error recieving data")
      }
      });
  };

  function fetchTags(){
    data = {data : document.getElementById('synpsis_text_area').value}
    fetch("http://localhost:3311/get-synopsis", {
      method: "POST", headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
      }).then(response => response.json()).then(res => {
      console.log("Requested completed: ", res.res, res.tags);
      if(res.res == "success"){
        document.getElementById('h1').innerHTML = res.tags.trim()
      }
      else {
        document.getElementById('h1').innerHTML = "Error recieving data"
        console.log("Error recieving data")
      }      
    });
  };

function fetchRecommendations(tconst){
  fetch("http://localhost:2211/get-recommendation/id/" + tconst).then(response => response.json()).then(res => {
      console.log("Request complete! response:", res.res, res.movies);
      if(res.res == "success"){
        if(res.movies != "failed"){
          // document.getElementById('p2').innerHTML = res.movies.trim()
          process_response(res.movies.trim())
          
          $(document).ready(function() {
              myFunc($("#show"));
          });

        }else{
          document.getElementById('p2').innerHTML = "No recommendations found for this movie"
        }
      }else{
      document.getElementById('p2').innerHTML = "Error recieving data"
      console.log("Error recieving data")
      }
      });
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


function myFunc(oEle)
{
	oEle.fadeOut('slow', function(){
		if (oEle.next().length)
		{
			oEle.next().fadeIn('slow', function(){
				myFunc(oEle.next());
			});
		}
		else
		{
			oEle.siblings(":first").fadeIn('slow', function(){
				myFunc(oEle.siblings(":first"));
			});
		}
	});
}

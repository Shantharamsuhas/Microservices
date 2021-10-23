function fetchTitles(){
  var url = window.location.href
  movie_id = url.split("/").at(-1)
  data = {tconst : movie_id}
  fetch("http://localhost:8080/get_titles", {
      method: "POST",headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
      }).then(response => response.json()).then(res => {
      console.log("Request complete! response:", res.res, res.synopsys);
      if(res.res == "success"){
      document.getElementById('synpsis_text_area').value = res.synopsys.trim()
      }else{
      document.getElementById('synpsis_text_area').value = "Error recieving data"
      console.log("Error recieving data")
      }
      });
  };



  function fetchTags(){
    data = {data : document.getElementById('synpsis_text_area').value}
    fetch("http://localhost:3311/get_synopsis", {
      method: "POST", headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
      }).then(response => response.json()).then(res => {
      console.log("Requested completed: ", res.res, res.tags);
      if(res.res == "success"){
      document.getElementById('h1').value = res.tags.trim()
      }
      else {
      document.getElementById('h1').value = "Error recieving data"
      console.log("Error recieving data")
      }      
    });
  };
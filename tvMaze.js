// initialize page after HTML loads
var cont = false;

window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// get data from TV Maze
function searchTvShows() {
  document.getElementById("backbutton").style.display = "none";
  cont = false;
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage

  if(cont == false){
    for (let tvshow in data) {
      createTVShow(data[tvshow]);
      console.log(data[tvshow])
    } // for
  }else{
    createTVShow(data);
  }
   
  
  


} //showSerchResults



// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<br>";
   if(genres.length > 0){
    for (g in genres) {
      output += genres[g] + "<br> " ; 
   } // for    
   }else{
    output = "No Genres"
   }
     
 
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    var elemImage = document.createElement("img");
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    var elemRating = document.createElement("div");
    var elemSummary = document.createElement("div");
    
    // add JSON data to elements
  var showId;
  var showName;
  
   if(cont == false){
    console.log(cont);
  elemImage.src = tvshowJSON.show.image.medium;

  elemShowTitle.innerHTML = tvshowJSON.show.name;
  elemGenre.innerHTML = "<strong>" + "Genres: " + "</strong>" + showGenres(tvshowJSON.show.genres);
  elemImage.style.margin = "40px";
  elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
  elemDiv.setAttribute('class', "elem2");
  elemGenre.style.display = "block";
  //elemSummary.innerHTML = tvshowJSON.show.summary;
  showId = tvshowJSON.show.id;
   showName = tvshowJSON.show.name;
  }else{
    console.log(tvshowJSON.id)
    console.log(cont);
    elemImage.src = tvshowJSON.image.medium;
    elemImage.setAttribute('id',"image");
    elemShowTitle.innerHTML = tvshowJSON.name;
    elemShowTitle.setAttribute('id',"title");

    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.genres);
    elemGenre.setAttribute('id',"genre");

    elemRating.innerHTML = "Rating: " + tvshowJSON.rating.average;
    elemRating.setAttribute('id',"rating");

    elemSummary.innerHTML = tvshowJSON.summary;
    elemSummary.setAttribute('id',"summary");
    

    showId = tvshowJSON.id;
   showName = tvshowJSON.name;
   fetchEpisodes(showId, elemDiv);
   elemDiv.style.display ="grid";
   elemDiv.setAttribute('id', "elem")
   
  }
   
  elemGenre.setAttribute('class', "genre")
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemImage);
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
   
    
    // get id of show and add episode list
   
   
     // add this tv show to main
    elemMain.appendChild(elemDiv);
   
   
    

    if(cont == false){
      elemDiv.setAttribute('id', showId);
      document.getElementById(showId).addEventListener('click', function() {
        cont = true; 
        document.getElementById("main").innerHTML = "";
       fetch('https://api.tvmaze.com/shows/' + showId)
      .then(response => response.json())
      .then(data =>  showSearchResults(data)
      );
      document.getElementById("backbutton").style.display = "block";
      console.log(showName);
      elemDiv.style.transition = "500ms liner"
      });
      
       
    }
   
    
} // createTVShow



// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    var elemEpisodes = document.createElement("div");  // creates a new div tag
    var output = "<ol>";
    for (episode in data) {
        output += "<li><a href='javascript:fetchsummary(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";

    }
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
    elemEpisodes.setAttribute('id',"episodes");
} // showEpisodes

function fetchsummary(episodeId){
  fetch('https://api.tvmaze.com/episodes/' + episodeId)  
    .then(response => response.json())
    .then(data => showLightBox(data));
}

// open lightbox and display episode info
function showLightBox(data){
     document.getElementById("lightbox").style.display = "block";
     console.log(data);

     // show episode info in lightbox

     document.getElementById("message").innerHTML = "<h3>" + data.name + "</h3>";
     if(data.summary != null && data.image.medium != null && data.summary != "" ){
      document.getElementById("message").innerHTML += data.summary; 
      console.log(data.image.medium)
      document.getElementById("episodeimg").src = data.image.medium;
      document.getElementById("episodeimg").style.display = "block";
     }else{
      document.getElementById("message").innerHTML += "Sorry No Summary and Image for this Episode"
      document.getElementById("episodeimg").style.display = "none";
     }
    
    

     
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 





function backPage(){
  searchTvShows(); 
  document.getElementById("backbutton").style.display = "none";
}

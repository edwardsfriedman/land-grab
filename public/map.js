
window.addEventListener('load', function(){
  /****** MAP *******/
  /** Create a map in the div #map
  var bounds = new L.LatLngBounds(new L.LatLng(85.00542734823001, 214.62890625),
           new L.LatLng(-85.035941506574, -194.4140625));
  var map = L.mapbox.map('map', 'friedboy.hml0l3kn', {
      minZoom: 2,
      maxBounds: bounds
  });**/
  //map.zoomControl.setPosition('bottomleft');
  //L.mapbox.markers.icon();
  //var layer = L.mapbox.tileLayer('examples.map-9ijuk24y');
  //layer.on('ready', function() {
    // the layer has been fully loaded now, and you can
    // call .getTileJSON and investigate its properties
  //});

  /****** SEARCH BOX *******/
  document.getElementById('actionBox').style.display = "none";
  //$(actionBox).hide();
  //document.getElementById('search').addEventListener('onclick', srchButton);
}, false);


function srchButton(){
  var actionBox = document.getElementById('actionBox');
  var searchBox = document.getElementById('searchBox');
  var searchBut = document.getElementById('search');
  var shareBox = document.getElementById('shareBox');
  var shareBut = document.getElementById('share');
  if (actionBox.style.display === "none") { //if all hidden
    shareBox.style.display = "none";
    searchBox.style.display = "block";
    $(actionBox).slideToggle();
    searchBut.innerHTML = "hide";
  } else {
    if (searchBox.style.display === "none") { //if share is up
        $(actionBox).slideToggle(100, function(){
          shareBox.style.display = "none";
          searchBox.style.display = "block";
          searchBut.innerHTML = "hide";
          shareBut.innerHTML = "share";
          $(actionBox).slideToggle();
        });
    } else { //if search is already up
      searchBut.innerHTML = "search";
      $(actionBox).slideToggle(100, function(){
        searchBox.style.display = "none";
      });
    }
  }
};

function shareButton(){
  var actionBox = document.getElementById('actionBox');
  var searchBox = document.getElementById('searchBox');
  var searchBut = document.getElementById('search');
  var shareBox = document.getElementById('shareBox');
  var shareBut = document.getElementById('share');
  if (actionBox.style.display === "none") { //if all hidden
    shareBox.style.display = "block";
    searchBox.style.display = "none";
    $(actionBox).slideToggle();
    shareBut.innerHTML = "hide";
  } else {
    if (shareBox.style.display === "none") { //if search is up
        $(actionBox).slideToggle(100, function(){
          shareBox.style.display = "block";
          searchBox.style.display = "none";
          shareBut.innerHTML = "hide";
          searchBut.innerHTML = "search";
          $(actionBox).slideToggle();
        });
    } else { //if share is already up
      shareBut.innerHTML = "share";
      $(actionBox).slideToggle(100, function(){
        shareBox.style.display = "none";
      });
    }
  }
}

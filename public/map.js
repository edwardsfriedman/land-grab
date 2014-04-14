
window.addEventListener('load', function(){
 /****** MAP SETUP *******/
  var bounds = new L.LatLngBounds(new L.LatLng(85.00542734823001, 214.62890625),
           new L.LatLng(-85.035941506574, -194.4140625));
  var map = L.mapbox.map('map', 'friedboy.hml0l3kn', {
      minZoom: 2,
      maxBounds: bounds
  });
  map.zoomControl.setPosition('bottomleft');

  /****** SEARCH BOX *******/
  document.getElementById('actionBox').style.display = "none";
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

function addDrop(buttonId, parentId, dataPointer, max) {
    var thisButton = document.getElementById(buttonId);
    var removeButton;
    var parentDiv = document.getElementById(parentId);
    var data = ["a","b","c"];//TODO: get data here
    var dataLen = data.length;
    var selector = document.createElement('select');
    var i;
    var option;
    var br = document.createElement('br');
    selector.className="dropdown";
    //Create remove button
    removeButton = document.createElement('button');
    removeButton.className= 'dropRemover';
    removeButton.type ="button";
    removeButton.innerHTML = '-';
    removeButton.onclick = function(){
        parentDiv.removeChild(selector);
        parentDiv.removeChild(removeButton);
        parentDiv.removeChild(br);
        if(!countSelectors(parentDiv, max)){
          thisButton.style.visibility = "visible";
        }
    };

    //Put data in list
    for (i=0; i < dataLen; i++) {
      option = document.createElement('option');
      option.value = data[i];
      option.innerHTML = data[i];
      selector.appendChild(option);
    }
    parentDiv.appendChild(removeButton);
    parentDiv.appendChild(selector);
    parentDiv.appendChild(br);

    //Check here if it's maxed out.
    if(countSelectors(parentDiv, max)){
        thisButton.style.visibility = "hidden";
    };
}

function countSelectors(parent, max){
    var children = parent.children;
    var childLen = children.length;
    var childCount = 0
    for (i=0; i<childLen; i++){
        if (children[i].nodeName === "SELECT"){
            childCount += 1;
        }
    }
    if (childCount >= max){
        return true
    } else {
        return false;
    }
}

/** Wrapper for JSON request to the server to get results
 *  for a search.
 */
function doSearch() {
    console.log("hit search!");







    /**var url = document.URL + "/search.json";
    var cb = function(mensaje){
        //TODO: callback here
    }
    request(url, cb, chatWindow);**/
}
/**
// prevent the page from redirecting
    e.preventDefault();

    //message components
    var name = document.getElementById('nicknameField').value;
    var message = document.getElementById('messageField').value;

    // create a FormData object from our form
    var fd = new FormData()
    fd.append('nickname', name);
    fd.append('message', message);
    document.getElementById('messageField').value = "";

    // send it to the server
    var req = new XMLHttpRequest();
    req.open('POST', '/' + meta('roomName') + '/messages', true);
    req.send(fd);**/

/** Request function for querying server.
 *
 */
function request(url, callback, container) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.addEventListener('load', function(e){
        if (request.status == 200) {
            container.innerHTML = "";
            var content = request.responseText;
            var data = JSON.parse(content)
            var i;
            var dataLen = data.length;
            for (i=0; i < dataLen; i++){
                callback(data[i]);
            }
            scrollBottom();
        } else {
            console.log(request.status);
        }
    }, false);

    request.send(null);
}

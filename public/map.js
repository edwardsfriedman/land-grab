
window.addEventListener('load', function(){
 /****** MAP SETUP *******/
  var bounds = new L.LatLngBounds(new L.LatLng(85.00542734823001, 214.62890625),
           new L.LatLng(-85.035941506574, -194.4140625));
  var map = L.mapbox.map('map', 'friedboy.hml0l3kn', {
      minZoom: 2,
      maxBounds: bounds
  });
  map.zoomControl.setPosition('topright');
  //map.dragging.disable();
  //map.touchZoom.disable();
  //map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  /****** Load DATA ******/
  names = [];
  locations = [];
  grabbers = [];
  resistance = [];
  var mydata = data;
  var datalen = mydata.length
  var i;
  var grabsublen;
  var resistsublen;
  var j;
  for (i=0; i<datalen; i++){
      //grab names
      if ($.inArray(mydata[i].name, names) == -1){
        names.push(mydata[i].name);
      }
      //grab locations
      if ($.inArray(mydata[i].location, locations) == -1){
        locations.push(mydata[i].location);
      }
      //grab offenders
      if (mydata[i].grabbers){
        grabsublen = mydata[i].grabbers.length;
        for (j=0; j<grabsublen; j++){
          if ($.inArray(mydata[i].grabbers[j], grabbers) == -1){
            grabbers.push(mydata[i].grabbers[j]);
          }
        }
      }
      //grab resistance
      if (mydata[i].resistance){
        resistsublen = mydata[i].resistance.length;
        for (j=0; j<resistsublen; j++){
          if ($.inArray(mydata[i].resistance[j], resistance) == -1){
            resistance.push(mydata[i].resistance[j]);
          }
        }
      }
  }
  populateDrops();
  /****** SEARCH BOX *******/
  document.getElementById('actionBox').style.display = "none";
}, false);

function populateDrops(){
  var nameDrop = document.getElementById("nameDrop").children[2];
  var locDrop = document.getElementById("locDrop").children[2];
  var grabDrop = document.getElementById("entitiesDrop").children[2];
  var resistDrop = document.getElementById("resistanceDrop").children[2];
  //Put data in list
  var nameslen = names.length;
  var loclen = locations.length;
  var grablen = grabbers.length;
  var resistlen = resistance.length;
  var i;
  for (i=0; i < nameslen; i++) {
    option = document.createElement('option');
    option.value = names[i];
    option.innerHTML= names[i];
    nameDrop.appendChild(option);
  }
  for (i=0; i < loclen; i++) {
    option = document.createElement('option');
    option.value = locations[i];
    option.innerHTML = locations[i];
    locDrop.appendChild(option);
  }
  for (i=0; i < grablen; i++) {
    option = document.createElement('option');
    option.value = grabbers[i];
    option.innerHTML = grabbers[i];
    grabDrop.appendChild(option);
  }
  for (i=0; i < resistlen; i++) {
    option = document.createElement('option');
    option.value = resistance[i];
    option.innerHTML = resistance[i];
    resistDrop.appendChild(option);
  }

}

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

function assignData(parentId){
  var data;
  switch(parentId){
  case "nameDrop":
      data = names;
      break;
  case "locDrop":
      data = locations;
      break;
  case "entitiesDrop":
      data = grabbers;
      break;
  case "resistanceDrop":
      data = resistance;
      break;
  }
  return data;
}

function addDrop(buttonId, parentId, dataPointer, max) {
    var thisButton = document.getElementById(buttonId);
    var removeButton;
    var parentDiv = document.getElementById(parentId);
    var data = assignData(parentId);

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
    var resultCont = document.getElementById("resultsContain");
    var dataLen = data.length;
    var i;
    var div;
    var nameCrit = document.getElementById("nameDrop").children[2].value;
    var locationCrit = document.getElementById("locDrop").children[2].value
    var grabCrit = document.getElementById("entitiesDrop").children[2].value
    var resistCrit = document.getElementById("resistanceDrop").children[2].value
    var name;
    var loc;
    var grabs;
    var resists;
    var url;
    var descrip;
    resultCont.innerHTML = "";
    for (i=0; i<dataLen; i++){
      name = data[i].name;
      loc = data[i].location;
      if (data[i].grabbers){
        grabs = data[i].grabbers;
      }
      resists = data[i].resistance;
      url = data[i].url;
      descrip = data[i].desc;
      //include?
      if (name === nameCrit || loc === locationCrit || $.inArray(resistCrit,resists) > -1){
        div = document.createElement('div');
        div.className= "result";
        div.innerHTML = buildResult(url, name, descrip, grabs, resists);
        resultCont.appendChild(div);
      } else if (grabbers) {
        if ($.inArray(grabCrit, grabs) > -1){
          div = document.createElement('div');
          div.className= "result";
          div.innerHTML = buildResult(url, name, descrip, grabs, resists);
          resultCont.appendChild(div);
        }
      }
    }
    if (resultCont.innerHTML===""){
      resultCont.innerHTML = "No Results Matched Your Search"
    }
    if(resultCont.style.display === "none" || resultCont.style.display ===""){
      $(resultsContain).slideToggle();
    }
}

function buildResult(url, name, descrip, grabs, resists){
  var grabberString;
  var grablen;
  var resString
  var reslen;
  var j;
  var inner;
  if (grabs){
    grablen = grabs.length;
    grabberString = "";
    for (j=0; j<grablen; j++){
      grabberString += grabs[j];
      grabberString += ", ";
    }
  }
  //resitance string
  reslen = resists.length;
  resString = "";
  for (j=0; j<reslen; j++){
    resString += resists[j];
    resString += ", ";
  }
  inner = "<a href='"+ url +"'><h3>" + name + "</h3></a>" +
  "<p><span class='under'>Description:</span> " + descrip + "</p>" +
  "<p><span class='under'>Culpable governments, companies & individuals:</span> " + grabberString + "</p>" +
  "<p><span class='under'>Forms of resistance:</span> " + resString + "</p>";
  return inner;
}


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

function hideresults(){
  $(resultsContain).slideToggle();
}

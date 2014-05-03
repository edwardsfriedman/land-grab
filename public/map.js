
window.addEventListener('load', function(){
 /****** MAP SETUP *******/
  var bounds = new L.LatLngBounds(new L.LatLng(85.00542734823001, 214.62890625),
           new L.LatLng(-85.035941506574, -194.4140625));
  map = L.mapbox.map('map', 'friedboy.hml0l3kn', {
      minZoom: 2,
      maxBounds: bounds
  });
  map.zoomControl.setPosition('topright');
  map.scrollWheelZoom.disable();

  //***GEOCODER*****/
  geodude = L.mapbox.geocoder('friedboy.hml0l3kn');

  featureLayer = L.mapbox.featureLayer();
  /****** Load DATA ******/
  names = [];
  locations = [];
  grabbers = [];
  resistance = [];
  var mydata = theta;
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
  var resultsBox = document.getElementById('resultsContain');
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
    if (shareBox.style.display !== "none") { //if share is up
        $(actionBox).slideToggle(100, function(){
          shareBox.style.display = "none";
          searchBox.style.display = "block";
          searchBut.innerHTML = "hide";
          shareBut.innerHTML = "share";
          $(actionBox).slideToggle();
        });
    } else if (resultsBox.style.display !== "none"){ //if results is up
        $(actionBox).slideToggle(100, function(){
          resultsBox.style.display = "none";
          searchBut.innerHTML = "search";
          resultsBox.innerHTML = "";
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
    var resultsBox = document.getElementById('resultsContain');
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
      if (searchBox.style.display !== "none") { //if search is up
          $(actionBox).slideToggle(100, function(){
            shareBox.style.display = "block";
            searchBox.style.display = "none";
            shareBut.innerHTML = "hide";
            searchBut.innerHTML = "search";
            $(actionBox).slideToggle();
          });
      } else if (resultsBox.style.display !== "none"){ //if results is up
          $(actionBox).slideToggle(100, function(){
            resultsBox.style.display = "none";
            searchBut.innerHTML = "search";
            resultsBox.innerHTML = "";
            shareBox.style.display = "block";
            shareBut.innerHTML = "hide";
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

function collectSelections(id) {
    var i;
    var selections = [];
    var children = document.getElementById(id).children;
    var chillen = children.length;
    var child;
    for (i=0; i<chillen; i++){
        child = children[i];
        if (child.tagName === "SELECT"){
            selections.push(child.value);
        }
    }
    return selections;
}


/** Collects user search selections and submites JSON request
 *to the server to get results.
 */
function doSearch() {
    var resultCont = document.getElementById("resultsContain");
    var name = collectSelections("nameDrop");
    var location = collectSelections("locDrop");
    var grabbers = collectSelections("entitiesDrop");
    var resistance = collectSelections("resistanceDrop");

    var url = document.URL + "/search.json";
    var cb = function(data){
      resultCont.innerHTML = "<span class='bolder'>results:</span> <button class='container' type='button' id='resultsBack' onclick='back()'> <-- </button><br>";
      /** geoJSON **/
      var geojson = [];
      var datalen = data.length;
      var i, datum, geo, ltlng;
      for (i=0; i< datalen; i++){
        datum = data[i];
        div = document.createElement('div');
        div.className = "result";
        div.id = datum._id;
        div.data = datum;
        div.innerHTML = buildResult(datum.url, datum.name, datum.desc, datum.grabbers, datum.resistance, datum.location);
        div.onclick= function(e){
          var parent = e.target;
          while (parent.className !== 'result'){
            parent = parent.parentNode;
          }
          var data = parent.data;
          $(parent.children[1]).slideToggle();

          geodude.query(data.location, function(error, result){
            map.setView([result.latlng[0], result.latlng[1]+3], 7);
          });
        };
        resultCont.appendChild(div);
        // geoJSON
        geodude.query(datum.location, function(error, result){
          ltlng = result.latlng.slice();
          ltlng.reverse();
          geo = { "type": "Feature",
                  "geometry": { "type": "Point", "coordinates": ltlng },
                  "properties": { "id": datum._id, "marker-color": "#fc4353"} };
          geojson.push(geo);
          if (geojson.length === datalen) {
            console.log('duh fuck?');
            console.log(geojson);
            featureLayer.setGeoJSON(geojson).addTo(map);
            featureLayer.on('click', function(e) {
              ltlng = e.layer.getLatLng();
              map.setView([ltlng.lat,ltlng.lng+3], 7);
            });
          }
        });
      }



    }
    var fd = new FormData();
    buildForm(name, "name", fd);
    buildForm(location, "location", fd);
    buildForm(grabbers, "grabbers", fd);
    buildForm(resistance, "resistance", fd);
    // send it to the server
    var req = new XMLHttpRequest();
    req.open('POST', '/search.json', true);
    req.addEventListener('load', function(e){
      $(actionBox).slideToggle(function(){
        map.setView([55, 10], 2);
        document.getElementById("searchBox").style.display = 'none';
        resultCont.style.display = 'block';
        var content = req.responseText;
        var data = JSON.parse(content);
        cb(data);
        if (resultCont.innerHTML===""){
          resultCont.innerHTML = "No Results Matched Your Search";
          //$(resultsContain).slideToggle();
        }
        if(resultCont.style.display === "none" || resultCont.style.display ==="block"){
          //$(resultsContain).slideToggle();
        }
        $(actionBox).slideToggle();
      });
    }, false);
    req.send(fd);
}

function zoomTo(e){
    var data = e.target.data;
    console.log('zooming to ' + data.location);
    geodude.query(data.location, function(error, result){
      console.log("arrived at " + result.latlng);
      map.setView([result.latlng[0], result.latlng[1]+3], 7);
    });

}

function postData() {
  var fd = new FormData();
  var req = new XMLHttpRequest();
  fd.append("name", getVal("postName"));
  fd.append("location", getVal("postLoc"));
  fd.append("url", getVal('postLink'));
  fd.append("desc", getVal('postDescrip'));
  fd.append("grabbers", getVal('postGrabbers'));
  fd.append("resistance", getVal('postResistance'));
  //TODO: this is right now sending to public insert
  req.open('POST', '/publicInsert', true);
  req.send(fd);
}


/** currently unused **/
function request(url, callback, container) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.addEventListener('load', function(e){
        if (request.status == 200) {
            //container.innerHTML = "";
            var content = request.responseText;
            var data = JSON.parse(content);
            callback(data);
        } else {
            console.log(request.status);
        }
    }, false);

    request.send(null);
}


function buildForm(selections, criteria, form){
  var selectlen = selections.length;
  var i, datum, tag;
  for (i=0; i<selectlen; i++){
      tag = criteria + String(i+1);
      form.append(tag, selections[i]);
  }
  return form;
}

function getVal(id){
  var field = document.getElementById(id);
  return field.value;
}

function buildResult(url, name, descrip, grabs, resists, location){
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
  inner = "<p>" + name + "<br>"+ location +"</p>"+
  "<div class=fullResult>" +
  "<p><span class='under'>Description</span>: " + descrip + "</p>" +
  "<p><span class='under'>url</span>:   <a href='" + url + "'>" + url.split('/')[2] + "</a></p>" +
  "<p><span class='under'>Culpable governments, companies & individuals:</span> " + grabberString + "</p>" +
  "<p><span class='under'>Forms of resistance:</span> " + resString + "</p></div>";
  return inner;
}

function hideresults(){
  $(resultsContain).slideToggle();
}

function back(){
  var results = document.getElementById("resultsContain");
  var searchBox = document.getElementById("searchBox");
  $(actionBox).slideToggle(100, function(){
    results.innerHTML="";
    results.style.display = "none";
    searchBox.style.display = "block";
    $(actionBox).slideToggle();
  });
}

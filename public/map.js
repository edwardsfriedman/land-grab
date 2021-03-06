/** Prelimenary setup: loads map, calls for data
 * to populate dropdowns in search, populates
 * dropdowns, expands search window.
 */
window.addEventListener('load', function(){
  /****** ACTION BOX *******/
  document.getElementById('actionBox').style.display = "none";
  /****** MAP SETUP *******/
  var bounds = new L.LatLngBounds(new L.LatLng(85.00542734823001, 214.62890625),
           new L.LatLng(-85.035941506574, -194.4140625));
  map = L.mapbox.map('map', 'friedboy.hml0l3kn', {
      minZoom: 2,
      maxBounds: bounds
  });
  map.zoomControl.setPosition('topright');
  map.scrollWheelZoom.disable();
  //only allow geo search not at the top two levels of zoom.
  map.on('zoomend', function(){
    var box = document.getElementById('check');
    if (map.getZoom() >= 4){
      box.style.visibility = "visible";
    } else {
      box.style.visibility = "hidden";
    }
  });

  //***GEOCODER, FEATURELAYER*****/
  geodude = L.mapbox.geocoder('friedboy.hml0l3kn');
  featureLayer = L.mapbox.featureLayer();
  /****** Load DATA ******/
  //request for data to populate drops
  var req = new XMLHttpRequest();
  req.open('GET', '/populateMap.json', true);
  req.addEventListener('load', function(e){
  //error_handle
    if(e.currentTarget.status != 200){
        window.alert(e.srcElement.response);
        return;
    }
    names = [];
    locations = [];
    grabbers = [];
    resistance = [];
    var content = req.responseText;
    var mydata = JSON.parse(content);
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
      if ($.inArray(mydata[i].city, locations) == -1){
        locations.push(mydata[i].city);
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
    //loads data into dropdowns
    populateDrops(names, locations, grabbers, resistance);
    //expands search button when dropdowns are populated
    srchButton();
  });
  req.send();
}, false);

/** Passed arrays of names, locations, grabbers, resistance.
 *  Adds data to respective dropdown menus.
 */
function populateDrops(names, locations, grabbers, resistance){
  var nameDrop = document.getElementById("nameDrop").children[2];
  var locDrop = document.getElementById("locDrop").children[2];
  var grabDrop = document.getElementById("entitiesDrop").children[2];
  var resistDrop = document.getElementById("resistanceDrop").children[2];
  var nameslen = names.length;
  var loclen = locations.length;
  var grablen = grabbers.length;
  var resistlen = resistance.length;
  var i;
  //Put data in list
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

/** Onclick function for 'search' button beside header.
 *  Hides or displays actionbox's contents accordingly.
 */
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
        });
    } else { //if search is already up
      searchBut.innerHTML = "search";
      $(actionBox).slideToggle(100, function(){
        searchBox.style.display = "none";
      });
    }
  }
};

/** Onclick function for 'share' button beside header.
 *  Hides or displays actionbox's contents accordingly.
 */
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
      } else if (resultsBox.style.display != "none"){ //if results is up
          $(actionBox).slideToggle(100, function(){
            resultsBox.style.display = "none";
            searchBut.innerHTML = "search";
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

/** Helper for parsing data from call.
 */
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

/** function for adding additional dropdown under designated criterion.
 */
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

/** Helper for determining whether there are already maximum
 * selectors for given criterion.
 */
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

/** Collects and returns selections from a group of dropdowns
 */
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
    var geobox = document.getElementById('geosearch');

    var url = document.URL + "/search.json";
    //call back for creating search results
    var cb = resultsCb;
    var fd = new FormData();
    buildForm(name, "name", fd);
    buildForm(location, "location", fd);
    buildForm(grabbers, "grabbers", fd);
    buildForm(resistance, "resistance", fd);
    // if geo-bounded search: grab bounds from map and include them in form;
    if (geobox.checked && map.getZoom() >= 4){
      var bounds = map.getBounds();
      var boundsobj = {};
      boundsobj.ne = {lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng};
      boundsobj.nw = {lat: bounds.getNorthWest().lat, lng: bounds.getNorthWest().lng};
      boundsobj.sw = {lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng};
      boundsobj.se = {lat: bounds.getSouthEast().lat, lng: bounds.getSouthEast().lng};
      fd.append('bounds', JSON.stringify(boundsobj));
    }
    // send it to the server
    var req = new XMLHttpRequest();
    req.open('POST', '/search.json', true);
    req.addEventListener('load', function(e){
      //error_handle
      if(e.currentTarget.status != 200){
          window.alert(e.srcElement.response);
          return;
      } else {
        //hide box, then load content;
        $(actionBox).slideToggle(function(){
          if(!geobox.checked){
              map.setView([55, 10], 2);
          }
          if(req.responseText) {
              document.getElementById("searchBox").style.display = 'none';
              resultCont.style.display = 'block';
              var content = req.responseText;
              var data = JSON.parse(content);
              cb(data);
          }
          else {
              window.alert("No results found");
              //$(actionBox).slideToggle(100, function(){
              searchBox.style.display = "block";
              //});
          }
          $(actionBox).slideToggle();
        });
      }
    }, false);
    req.send(fd);
}

/** Callback for search results. For each result builds div to display
 * and adds geojson object to a layer to be displayed on the map.
 */
function resultsCb(data){
  var resultCont = document.getElementById("resultsContain");
  resultCont.innerHTML = "<span class='bolder'>results:</span> <button class='container' type='button' id='resultsBack' onclick='back()'> <-- </button><br>";
  /** geoJSON **/
  //build div and geojson object for each search Result.
  var geojson = [];
  var datalen = data.length;
  var i, datum, geo, ltlng, geodata;
  for (i=0; i< datalen; i++){
    datum = data[i];
    div = document.createElement('div');
    div.className = "result";
    div.id = datum._id;
    div.data = datum;
    div.innerHTML = buildResult(datum.url, datum.name, datum.desc, datum.grabbers, datum.resistance, datum.city);
    //onclick for compressed div, makes sure node is selected, then calls expand with result.
    div.onclick= function(e){
      var parent = e.target;
      while (parent.className !== 'result' && parent.className !== 'selectRes'){
        parent = parent.parentNode;
      }
      expandResult(parent.id);
    };
    resultCont.appendChild(div);
    // geoJSON
    geodata = datum.location;
    ltlng = [geodata[1], geodata[0]];
    ltlng.reverse();
    geo = { "type": "Feature",
            "geometry": { "type": "Point", "coordinates": ltlng },
            "properties": { "id": datum._id, "marker-color": "#fc4353"} };
    geojson.push(geo);
  }
  //add geojson features to map, and assign their functionality.
  featureLayer.setGeoJSON(geojson).addTo(map);
  featureLayer.on('click', markerClick);
};

/** onclick function for mapbox marker. expands map-point's
 * description and sets mapview to view it.
 */
function markerClick(e){
  expandResult(e.layer.feature.properties.id, true);
  ltlng = e.layer.getLatLng();
  map.setView([ltlng.lat,ltlng.lng+3], 7);
}

/** shows full info for search result, by finding it and
 * changing display from none. calls helper to close any other
 * open search results.
 */
function expandResult(id, marker){
  var node = document.getElementById(id);
  if (node){
    var nodeheight = node.offsetTop - 10;
    var heightstring = nodeheight + "px";
    var data = node.data;
    var results = document.getElementById('resultsContain');
    var actionBox = document.getElementById('actionBox');
    node.className = 'selectRes';
    if(marker){
      var child = node.children[1];
      if (child.style.display === "none"){
        map.setView([data.location[1], data.location[0]+3], 7);
        child.style.display = "block";
        closeResults(node);
      }
      if (actionBox.style.display === "none"){ //action box is hidden
        results.style.display='block';
        $(actionBox).slideToggle();
      }
    } else {
      $(node.children[1]).slideToggle();
      map.setView([data.location[1], data.location[0]+3], 7);
      closeResults(node);
      $(resultsContain).animate({ scrollTop: nodeheight+ 5});
    }
  }
}

/** Helper function that goes through results and closes any open
 * ones by hiding the 'fullResult' div.
 */
function closeResults(node){
  var results = document.getElementById('resultsContain');
  var kids = results.children;
  var len = kids.length;
  var i, j, grandkids, gklen;
  for (i=0; i<len; i++){
    if (kids[i] !== node && (kids[i].className === 'result' || kids[i].className === 'selectRes')){
      kids[i].className = 'result';
      grankids = kids[i].children;
      gklen = grankids.length;
      for (j=0; j<gklen; j++){
        if (grankids[j].className === 'fullResult'){
          grankids[j].style.display = "none";
        }
      }
    }
  }
}

/** Collects data from sharing form and submits a post call with
 * a form data object that contains it. This is all on a callback
 * from mapbox's geocoder query, which verifies that the location
 * the user submitted is valid, and provides lat and lng coordinates
 * for it.
 */
function postData() {
  geodude.query(getVal('postLoc'), function(error, result){
    if (!error){
      var location = {lat: result.latlng[1], lng: result.latlng[0]};
      var fd = new FormData();
      var req = new XMLHttpRequest();
      fd.append("name", getVal("postName"));
      fd.append("location", JSON.stringify(location));
      fd.append("city", getVal('postLoc'));
      fd.append("url", getVal('postLink'));
      fd.append("desc", getVal('postDescrip'));
      fd.append("grabbers", getVal('postGrabbers'));
      fd.append("resistance", getVal('postResistance'));
      fd.append("user", getVal('postEmail'));
      //TODO: this is right now sending to public insert - whenever admin insert is handled it's slightly different and published needs to be validated
      req.open('POST', '/publicInsert', true);
      req.addEventListener('load', function(e){
        //error_handle
        if(e.currentTarget.status == 200){
          window.alert("Thank you for your submission");
          clearVal('postName');
          clearVal('postLink');
          clearVal('postLoc');
          clearVal('postDescrip');
          clearVal('postGrabbers');
          clearVal('postResistance');
          clearVal('postEmail');
          document.getElementById("share").innerHTML = "share";
          $(actionBox).slideToggle(100, function(){
            document.getElementById('shareBox').style.display = "none";
          });

        } else {
            window.alert(e.srcElement.response);
            return;
        }
      });
      req.send(fd);
    } else {
      console.log(error);
      window.alert('Please enter a valid location');
      document.getElementById('postLoc').value = "";
    }
  });
}

/** Adds data from an array to a form.
 * e.g. from names array, appends names[1] to "name1" in the form.
 */
function buildForm(selections, criteria, form){
  var selectlen = selections.length;
  var i, datum, tag;
  for (i=0; i<selectlen; i++){
      tag = criteria + String(i+1);
      form.append(tag, selections[i]);
  }
  return form;
}

/** Gets a html element's 'value', passed its id.
 */
function getVal(id){
  var field = document.getElementById(id);
  return field.value;
}

/** Clears an html element's 'value', passed its id.
 */
function clearVal(id){
  document.getElementById(id).value = "";
}

/** Builds html to display a data point, whose info it's passed.
 */
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
  "<div class=fullResult style='display: none's>" +
  "<p><span class='under'>Description</span>: " + descrip + "</p>" +
  "<p><span class='under'>url</span>:   <a href='" + url + "' target='_blank'>" + url.split('/')[2] + "</a></p>" +
  "<p><span class='under'>Culpable governments, companies & individuals:</span> " + grabberString + "</p>" +
  "<p><span class='under'>Forms of resistance:</span> " + resString + "</p></div>";
  return inner;
}

/** onclick function for back button from search results.
 * clears markers from the map, clears the search results,
 * and re-expands search div
 */
function back(){
  var results = document.getElementById("resultsContain");
  var searchBox = document.getElementById("searchBox");
  featureLayer.clearLayers();
  $(actionBox).slideToggle(100, function(){
    results.innerHTML="";
    results.style.display = "none";
    searchBox.style.display = "block";
    $(actionBox).slideToggle();
  });
}

/**defunct
 */
function hideresults(){
  $(resultsContain).slideToggle();
}

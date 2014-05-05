var newAdminForm;

window.addEventListener('load', function(){
  loadlist();

  newAdminForm = document.getElementById('newAdminForm');
  newAdminForm.addEventListener('submit', sendAdmin, false);
}, false);

function sendAdmin(e){
  e.preventDefault();

  var fd = new FormData(newAdminForm);
  var req = new XMLHttpRequest();
  req.open('POST', '/createAdmin', true);
  req.send(fd);
  //handle errors
  newAdminForm.reset();
}

function loadlist(){
  var request = new XMLHttpRequest();
  request.open('GET', '/adminList.json', true);
  console.log('killin it');
  request.addEventListener('load', function(e){
      if (request.status == 200) {
          var content = request.responseText;
          var pub = document.getElementById('published');
          var unpub = document.getElementById('unpublished');
          var data = JSON.parse(content);
          var datalen = data.length;
          var i, entry;
          for (i=0; i<datalen; i++){
            entry = buildEntry(data[i]);
            if (data[i].published){
              entry.className = 'pubber';
              pub.appendChild(entry);
            } else {
              entry.className = 'unpubber';
              unpub.appendChild(entry);
            }
          }
      } else {
          console.log(request.status);
      }
  }, false);
  request.send(null);
}

function buildEntry(data){
  var j, full, grablen, grabbers, reslen, resistance, edit
  var entry = document.createElement('div');
  entry.data = data;
  entry.innerHTML = '<h3>' + data.name + '</h3><p> ' + data.location + '</p>';
  entry.onclick = function(e) {
    var node = e.target;
    while (node.className !== 'pubber' && node.className !== 'unpubber'){
      node = node.parentNode;
    }
    expand(node);
  };
  //fullentry;
  full = document.createElement('div');
  full.className = 'full';
  full.style.display = 'none';
  full.innerHTML = "<p> id: " + data._id +"<br>"+
                   "<p> url: " + data.url + "<br>"+
                   "<p> description: <br><br>" + data.desc + "<br>"+
                   "<p> grabbers: ";
  //grabbers
  if(data.grabbers){
    grabbers = data.grabbers;
    grablen = grabbers.length;
    for (j=0; j<grablen; j++){
      full.innerHTML += grabbers[j];
      if (j<grablen-1){
        full.innerHTML += ", ";
      } else {
        full.innerHTML += "<br>";
      }
    }
  }
  full.innerHTML += "<p> forms of resistance:"
  //resistance
  if(data.resistance){
    resistance = data.resistance;
    reslen = resistance.length;
    for (j=0; j<reslen; j++){
      full.innerHTML += resistance[j];
      if(j<reslen-1){
        full.innerHTML += ", ";
      } else {
        full.innerHTML += "<br>";
      }
    }
  }
  full.innerHTML += "<p>submitter: " + data.user+
                    "<p>published: " + data.published;
  edit = document.createElement('button');
  edit.innerHTML = "edit";
  edit.onclick = function(e){
    var j, full, grablen, grabbers, reslen, resistance, edit;
    var node = e.target;
    while (node.className !== 'pubber' && node.className !== 'unpubber'){
      node = node.parentNode;
    }
    openEditor(node, node.data);
    //node.innerHTML = '<form>'+
      //'name: <input class="textField" id="postName" type="text" name="name" value="'+data.name+'"><br>';
  }//openEditor(edit.data, entry);
  full.appendChild(edit);
  entry.sub = full;
  entry.appendChild(full);
  return entry;
}

function closeAll(node){
  var pubs = document.getElementsByClassName('pubber');
  var uns = document.getElementsByClassName('unpubber');
  var publen = pubs.length;
  var unlen = uns.length;
  var i, other;
  for (i=0; i<publen; i++){
      if(pubs[i] !== node && pubs[i].sub.style.display !== "none"){
      $(pubs[i].sub).slideToggle();
    }
  }
  for (i=0; i<unlen; i++){
    if(uns[i] !== node && uns[i].sub.style.display !== "none"){
      $(uns[i].sub).slideToggle();
    }
  }
}

function openEditor(node, data){
  var j, full, grablen, grabbers, reslen, resistance, edit, saver;
  var publish = data.published;
  var grabberstr = "";
  var resstr = "";
  var form = document.createElement('form');
  form.innerHTML = 'name: <input class="textField" id="postName" type="text" name="name" value="'+data.name+'"><br>'+
    'location: <input class="textField" id="postLoc" type="text" name="location" value="'+data.location+'"><br>'+
    'id: <input class="textField" id="postLink" type="text" name="link" value="'+data._id+'"><br>'+
    'url: <input class="textField" id="postLink" type="text" name="link" value="'+data.url+'"><br>'+
    'description: <input class="textField" id="postDescrip" type="text" name="desc" value="'+data.desc+'">';
    //grabbers
    if(data.grabbers){
      grabbers = data.grabbers;
      grablen = grabbers.length;
      for (j=0; j<grablen; j++){
        grabberstr += grabbers[j];
        if (j<grablen-1){
          grabberstr += ", ";
        }
      }
    }
    form.innerHTML += 'culpable entities: <input class="textField" id="postGrabbers" type="text" name="grabbers" value="'+grabberstr+'"><br>';
    //resistance
    if(data.resistance){
      resistance = data.resistance;
      reslen = resistance.length;
      for (j=0; j<reslen; j++){
        resstr += resistance[j];
        if(j<reslen-1){
          resstr += ", ";
        }
      }
    }
    form.innerHTML += 'forms of resistance: <input class="textField" id="postResistance" type="text" name="resistance" value="'+resstr+'"><br>'+
    'your email: <input class="textField" id="postEmail" type="text" name="email" value="'+data.user+'"><br>';
    if (!publish) {
      form.innerHTML += 'published: <input class="checkbox" type="checkbox" id="postPublished" name="pub" value="published"></br>';
    } else {
      form.innerHTML += 'published: <input class="checkbox" type="checkbox" id="postPublished" name="pub" value="published" checked="true"></br>';
    }
    saver = document.createElement('button');
    saver.innerHTML = 'save';
    saver.id="post";
    saver.onclick = function(e){
      var node = e.target;
      while (node.className !== 'pubber' && node.className !== 'unpubber'){
        node = node.parentNode;
      }
      saveEntry(node);
    }
    form.appendChild(saver);
    node.innerHTML = "";
    node.appendChild(form);
}

function saveEntry(node){
  console.log(node);
}



function expand(node){
  //var child = node.sub;
  closeAll(node);
  node.sub.style.display = "block";//$(node.sub).slideToggle()

}

function closeAll(node){
  var pubs = document.getElementsByClassName('pubber');
  var uns = document.getElementsByClassName('unpubber');
  var publen = pubs.length;
  var unlen = uns.length;
  var i, other;
  for (i=0; i<publen; i++){
    if(pubs[i] !== node && pubs[i].sub.style.display !== "none"){
      $(pubs[i].sub).slideToggle();
    }
  }
  for (i=0; i<unlen; i++){
    if(uns[i] !== node && uns[i].sub.style.display !== "none"){
      $(uns[i].sub).slideToggle();
    }
  }
}

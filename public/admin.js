
window.addEventListener('load', function(){
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
          var i, j, entry, full, grablen, grabbers, reslen, resistance, edit;
          for (i=0; i<datalen; i++){
            entry = document.createElement('div');
            entry.innerHTML = '<h3>' + data[i].name + '</h3><p> ' + data[i].location + '</p>';
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
            full.innerHTML = "<p> id: " + data[i]._id +"<br>"+
                             "<p> url: " + data[i].url + "<br>"+
                             "<p> description: <br><br>" + data[i].desc + "<br>"+
                             "<p> grabbers: ";
            //grabbers
            if(data[i].grabbers){
              grabbers = data[i].grabbers;
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
            if(data[i].resistance){
              resistance = data[i].resistance;
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
            full.innerHTML += "<p>submitter: " + data[i].user+
                              "<p>published: " + data[i].published;
            edit = document.createElement('button');
            edit.innerHTML = "edit";
            edit.data = data[i];
            edit.onclick = openEdit(edit.data, entry);
            full.appendChild(edit);
            entry.sub = full;
            entry.appendChild(full);
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
}, false);

function expand(node){
  console.log(node);
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
    console.log('pub: ' + pubs[i] + ' ' + pubs[i].sub);
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

function openEdit(node){

}

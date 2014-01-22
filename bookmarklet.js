javascript:

var tracks = document.evaluate( '//ul[contains(@class,"track ") or @class="track"]' ,document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ); 
var output = "<h1>Tracklist-Output</h1><br>"; 
var d = document;
for (var i = 0; i < tracks.snapshotLength; i++){
  var track = tracks.snapshotItem(i);
  /*output += document.evaluate( './/li[@class="track_number"]/text()' ,track, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).textContent; output += ' - ';*/
  if (document.evaluate( './/li[@class="artist_name"]/a/@title' ,track, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0) == null) {
    artist = document.evaluate( '//div[@class="product"]//a[contains(@class, "album_artist_name")]/text()' , document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).textContent; 
  } else { 
    artist = document.evaluate( './/li[@class="artist_name"]/a/@title' ,track, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).textContent; 
  }
  output += artist.trim(); 
  output += ','; 
  output += document.evaluate( './/span[@class="title"]/text()' ,track, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).textContent.trim(); 
  output += '<br>\r\n'; 
} 
var mydiv = document.createElement('div');
mydiv.setAttribute('id', 'mydiv');
mydiv.setAttribute('style', 'position: absolute;top:0;left:0;z-index:9999;width:auto;height:auto;padding:1em;background: white;border:1px solid black;opacity:0.9;');
mydiv.innerHTML = output;
var outputarea = document.getElementsByTagName("body")[0];
outputarea.appendChild(mydiv);
return false;
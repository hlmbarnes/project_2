var map;
var infowindow;
var service;

function initialize() {
  var Seattle = new google.maps.LatLng(47.6062, -122.335167);

  map = new google.maps.Map(document.getElementById('map'), {
    center: Seattle,
    zoom: 15,
    scrollwheel: false
  });

  // Specify location, radius and place types for your Places API search.
  var request = {
    location: Seattle,
    radius: '800',
    keyword: 'Brewery, Brewery'
  };
   
  infowindow = new google.maps.InfoWindow();

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  service = new google.maps.places.PlacesService(map);

  service.radarSearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {
        var request = {placeId: results[i].place_Id};
             createMarker(results[i]);     
        }
 
  }
  else{ alert(status)};
}

function favoriteClick(){
 var placeinfo=infowindow.getContent();
 $.ajax({
 	url: '/favorites',
 	method: 'POST',
 	data: {
 		name: $('#marker-heading').text(),
 		address: $('#brewery_info').text(),
 		phone: $('#strong').text()
 	}, 
 	success: function(){
 		console.log("Success");
	}
 })
// alert('you clicked ' + $("#marker-heading").html());

};

//Content structure of info Window for the Markers


function createMarker(placeOK){
  
  var marker = new google.maps.Marker({
        map: map,
        position: placeOK.geometry.location
      });


      google.maps.event.addListener(marker, 'click', function() {
        service.getDetails({placeId: placeOK.place_id}, function(place, status){
        if (status === google.maps.places.PlacesServiceStatus.OK){
var contentString = '<div class="marker-info-win">'+
        '<div class="marker-inner-win"><span class="info-content">'+
        '<h3 id="marker-heading">'+place.name+'</h3>'+
        '<span id="brewery_info">'+ place.formatted_address +'</span>'+ '<br>'+'<strong id="strong">'+place.formatted_phone_number+'</strong><br>'+
        '</span>'+
           '<br /><button id="favoriteButton" onclick="favoriteClick()" class="make-hidden" title="make Favorite">Make Favorite</button></div></div>'
            infowindow.setContent(contentString);

              infowindow.open(map, marker);
            }
//             else{ alert(status)};
      });
    
  });


}
google.maps.event.addDomListener(window, 'load', initialize);
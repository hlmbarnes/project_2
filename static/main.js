var map;
var infowindow;
var service;
function handleLocationError(browserHasGeolocation, infoWindow, pos) {

  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
};
function initialize() {
  var Seattle = new google.maps.LatLng(47.6062, -122.335167);

  map = new google.maps.Map(document.getElementById('map'), {
    center: Seattle,
    zoom: 15,
    scrollwheel: false
  });
  infowindow = new google.maps.InfoWindow();
if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      var initialLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(initialLocation);
      doSearch();
    }, function() {
      handleLocationError(true, infowindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infowindow, map.getCenter());
  }

}
function doSearch(){
	 // Specify location, radius and place types for your Places API search.
  var request = {
     location: map.getCenter(),
    radius: '800',
    keyword: 'Brewery, Brewery'
  };
   


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

};

$('.delete').click(function(){
	var elem = $(this).parent();
	var id = elem.attr('id');
	$.ajax({
		url: '/favorites',
		method: 'DELETE',
		data: {
			id: id
		},
		success: function(){
			elem.remove();
		}
	})
});
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
      });
    
  });


}
google.maps.event.addDomListener(window, 'load', initialize);
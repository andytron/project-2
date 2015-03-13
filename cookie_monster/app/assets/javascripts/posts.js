// GOOGLE MAPS API

var map;
var service;

// add search request to include places that are only 'openNow'
function handleSearchResults(results, status){
  console.log(results);

  for (var i = 0; i < results.length; i++) {
    var marker = new google.maps.Marker({
      position: results[i].geometry.location,
      map: map,
      // icon:
    });
  }
}

function performSearch(){
  var request = {
    bounds: map.getBounds(),
    keyword: 'cookies'
  }
  service.nearbySearch(request, handleSearchResults);
}

function initialize(location) {
  console.log(location);
  // debugger;
  // lat = location.coords.latitude;
  // lng = location.coords.longitude;

  var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
  var mapOptions = {
    center: currentLocation,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var marker = new google.maps.Marker({
    position: currentLocation,
    map: map
  });

  service = new google.maps.places.PlacesService(map);

  // this ensures that we wait until the map bounds are initialized before we perform the search
  google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
}

  // var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
  // google.maps.event.addListener(marker,'click',function(e){

  //   infoWindow.open(map, marker);

  // });

// $(document).ready(function(){
//   navigator.geolocation.getCurrentPosition(initialize);
// });


// FOURSQUARE API

$(document).ready(function(){
  var lat, lng;
  var returnCoords = function(position){
    console.log("callback");
    lat = position.coords.latitude;
    lng = position.coords.longitude;
  }
  var somethingWentWrong = function(error){
    console.log("callback");
  }
  navigator.geolocation.getCurrentPosition(getVenues, somethingWentWrong)
  navigator.geolocation.getCurrentPosition(initialize);
  // debugger;
  // if (!lat) {
  // } else {
  //   getVenues();
  // }
  //
  // var keyword = "cookies"

  // getVenues( keyword );
});

// get lat & lng from google to put in url for ajax


function getVenues(location) {
  // function getLocation(location) {
  // debugger;
  var keyword = "cookies";
    var lat = location.coords.latitude;
    var lng = location.coords.longitude;

  // var coords = navigator.geolocation.getCurrentPosition(initialize);

	$.ajax({
	  url: "https://api.foursquare.com/v2/venues/explore?ll=" + lat + "," + lng + " &client_id=I34KOKW5DI2MSD12IHDY2KKYIT2UDUD2VHDC5WTBWX4TG4SJ&client_secret=1V0VGFUVO10EJ0NL03EJCIDNLVS5FTZC0WWWCSXAWY5UDHF2&v=20150301&query="+keyword,
    type: 'GET',
	  dataType: 'json',
	  success: function (data) {
	    console.log(data);

      $('#venues').show();
	    var dataobj = data.response.groups[0].items;
	    $('#venues').empty();

	    // Build markers and elements from venues returned
      $.each( dataobj, function() {
        if (this.venue.categories[0].name) {
          category = "Category: " + this.venue.categories[0].name;
        } else {
          category = "";
        }

        if (this.venue.location.formattedAddress) {
          address = "Address: " + this.venue.location.formattedAddress;
        } else {
          address = "";
        }

        if (this.venue.contact.formattedPhone) {
          phone = "Phone: " + this.venue.contact.formattedPhone;
        } else {
          phone = "";
        }

        // if (this.venue.menu.url) {
        //   menu = "Menu URL: " + this.venue.menu.url;
        // } else {
        //   menu = "";
        // }
        //
        // if (this.venue.price.message) {
        //   pricing = "Pricing: " + this.venue.price.message;
        // } else {
        //   pricing = "";
        // }

        if (this.venue.rating) {
          rating = "Rating: " + this.venue.rating;
        } else {
          rating = "";
        }

        if (this.venue.url) {
          website = "Website: " + this.venue.url;
        } else {
          website = "";
        }

      var appendDataHtml = '<div id="venues"><h2><span>' + this.venue.name + '</span></h2>' + category + address + phone + rating + website + '</div>';
      $('#venues').append(appendDataHtml);
	    });
    },
	});
}
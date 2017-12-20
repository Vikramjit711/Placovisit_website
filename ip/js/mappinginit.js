
// this is where google maps api initial function
var map, infoWindow;
        function initialMap() {
          map = new google.maps.Map(
                document.getElementById('map'),
                {
                    center: {lat: 19.004256, lng: 72.852573},
                    zoom: 13,
                    mapTypeControl: false
                }
            );
          infowindow = new google.maps.InfoWindow();
          ko.applyBindings(new viewModel());////To Activate Knockout through app.js
        }
    function googleError(){
      document.getElementById('map').innerHTML = "There is Error in Map!"//typing nd silly mistake i did thought of error and wrote error haha
    }
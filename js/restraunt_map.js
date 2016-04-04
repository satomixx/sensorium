var displayPanel;
var map, infoWindow;

google.maps.event.addDomListener(window, 'load', appInit);

function appInit(){
    displayPanel = document.getElementById("displayPanel");

    var pos = new google.maps.LatLng(35, 135);
    var mapTypeId = google.maps.MapTypeId.ROADMAP;
    var mapOptions = {zoom: 16, center: pos, mapTypeId: mapTypeId};
    map = new google.maps.Map(displayPanel, mapOptions);
    navigator.geolocation.getCurrentPosition(showLocation);
    showShop();
}


function showLocation(position){
    var pos = new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude);
    var marker = new google.maps.Marker({
        map: map,
        position: pos,
        title: "現在地"
    });
    map.setCenter(pos);
}


function showShop(){
    var name, lat, lng, url;
    var query = location.search;
    var params = query.substring(1).split("&");
    for(var i = 0; i < params.length; i++){
        var param = params[i].split("=")
        switch(param[0]){
            case "name":
                name = decodeURIComponent(param[1]);
                break;
            case "lat":
                lat = param[1];
                break;
            case "lng":
                lng = param[1];
                break;
            case "url":
                url = param[1];
        }
    }
    var pos = new google.maps.LatLng(lat,lng);
    var content = name + "<br><a href='" + url + "' target='_blank'>詳細</a>";
    var option = {map:map, position:pos,title: name,content: content};
    var marker = new google.maps.Marker(option);
    google.maps.event.addListener(marker, "click", function(event){
        if(infoWindow) infoWindow.close();
        infoWindow = new google.maps.InfoWindow(option);
    });
}

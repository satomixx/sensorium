var displayPanel;

var infoPanel;
var apikey = "d7110034028f84c5";
var serverUrl = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/"
    + "?range=3&format=jsonp&callback=createShopList";

window.onload = appInit;

function appInit(){
    displayPanel = document.getElementById("displayPanel");
    infoPanel = document.getElementById("infoPanel");
    var locationOption = {enableHighAccuracy:true};
    navigator.geolocation.getCurrentPosition(showLocation, locationError, locationOption);
}


function showLocation(position){

    infoPanel.textContent = "現在位置(" + position.coords.latitude + "-" +
        position.coords.longitude + ") 付近のお店";

    var uri = serverUrl + "&key=" + apikey;
    uri += "&lat=" + position.coords.latitude
    uri += "&lng=" + position.coords.longitude

    var script = document.createElement("script");
    script.src = uri;
    displayPanel.appendChild(script)
}


function locationError(error){
    infoPanel.textContent = error.message
}


function createShopList(json){

    if(json.results.results_returned == 0){
        displayPanel.textContent = "お店が見つかりませんでした。";
        return;
    }

    var shops = json.results.shop;

    for(var i=0; i < shops.length; i++){

        var shop = shops[i];
        var shopName = shop.name;
        var genreName = shop.genre.name;
        var budget = shop.budget.name;
        var access = shop.access;
        var shopUrl = shop.urls.pc;
        var imageUrl = shop.photo.pc.s;
        var coupon = shop.ktai_coupon;
        var latitude = shop.lat;
        var longitude = shop.lng;

        var panel = document.createElement("div");
        var photobox = document.createElement("div");
        var infobox = document.createElement("div");
        var namebox = document.createElement("div");
        var description = document.createElement("div");
        var image = document.createElement("img");
        var link = document.createElement("a");

        if(coupon == "0") panel.className = "shopview pink";
        else panel.className = "shopview blue";
        photobox.className = "photobox";
        namebox.className = "namebox";
        description.className = "description";
        image.className = "thumbnail";

        image.src = imageUrl;
        link.href = shopUrl;
        link.target = "_blank"

        namebox.appendChild(document.createTextNode(shopName));
        photobox.appendChild(link);
        link.appendChild(image);

        description.appendChild(
            document.createTextNode(genreName+" / 予算: "+budget));

        description.appendChild(document.createElement("br"));
        description.appendChild(document.createTextNode(access));

        panel.appendChild(photobox)
        panel.appendChild(infobox)
        infobox.appendChild(namebox);
        infobox.appendChild(description);
        displayPanel.appendChild(panel);

        maplink = document.createElement("a");
        maplink.href = "map.html?name="
            + encodeURIComponent(shopName)
            + "&lat=" + latitude + "&lng=" + longitude + "&url=" + shopUrl;
        maplink.target = "_blank";

        maplink.appendChild(document.createTextNode("view map"));
        description.appendChild(document.createTextNode(" ("));
        description.appendChild(maplink);
        description.appendChild(document.createTextNode(")"));
    }

    displayPanel.appendChild(
        document.createTextNode("【画像提供：ホットペッパー グルメ】"));
}

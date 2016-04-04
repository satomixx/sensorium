var cards, card1, card2;
var places, matched;
var clickEvent;
var time0 = -1, timer, bestRecord;
var timeView, bestView;
var restartButton;
var moveEment, controlPanel;
var images;

window.onload = appInit;

function appInit(){

    images = [[], []];
    var imageNames = [
        "ikura1.jpg", "ikura2.jpg", "ikura3.jpg", "ikura4.jpg", "ikura5.jpg",
        "ikura6.jpg", "ikura7.jpg", "ikura8.jpg", "ikura9.jpg", "ikura0.jpg"
    ];

    for(var i = 0; i < 10; i++){
        var image =  new Image();
        image.src = "../../img/card/concentration/" + imageNames[i];
        var image2 = image.cloneNode(true);
        images[0].push(image);
        images[1].push(image2);
    }

    if(typeof document.ontouchstart == "undefined"){
        clickEvent="mousedown";
        moveEvent = "mousemove";
    }else{
        clickEvent="touchstart";
        moveEvent = "touchmove";
    };

    var gamePanel = document.getElementById("gamePanel");
    places = gamePanel.getElementsByTagName("div");
    matched = document.getElementsByClassName("card matched");

    timeView = document.getElementById("time");
    bestView = document.getElementById("best");

    restartButton =  document.getElementById("restartButton");
    restartButton.addEventListener("click", replayGame);

    controlPanel = document.getElementById("controlPanel");
    // var filePicker = document.getElementById("filePicker");
    var fileButton = document.getElementById("fileButton");

    // fileButton.addEventListener("click",
    //     function(){filePicker.click()},
    //     false);
    //
    // filePicker.addEventListener("change", setBackground);

    hideControlPanel();

    initCards();
    deal();
    loadSettings();
}


function initCards(){

    cards = [];
    var gamePanel = document.getElementById("gamePanel");

    for(var i = 1; i <= 20; i++){
        var div = document.createElement("div");
        gamePanel.appendChild(div);
        cards.push(Math.ceil(i/2));
    };
}


function deal(){

    card1 = null;
    card2 = null;

    var shuffled=[];

    for(var i = 0; i < places.length; i++){

        var num = Math.floor(Math.random() * cards.length);
        var card = cards[num];
        shuffled.push(card);

        var set1 = cards.slice(0, num);
        var set2 = cards.slice(num + 1);
        cards = set1.concat(set2);

        places[i].className = "card back";

        if(places[i].firstChild)
            places[i].removeChild(places[i].firstChild);

        places[i].addEventListener(clickEvent, openCard, false);
    };

    cards = shuffled;
    shuffled = null;

    restartButton.disabled = true;
    restartButton.textContent = "終了";
    timeView.textContent = "-";
}


function openCard(event){

    event.preventDefault();
    if(card2 != null) return;

    var index = -1;
    var i = 0;

    while(i < places.length){
        if(places[i] == event.target){
            index = i;
            break;
        }
        i++;
    };

    event.target.className="card face";
    var cardset = card1 == null ? 0 : 1;
    event.target.appendChild(images[cardset][cards[index]-1]);
    event.target.removeEventListener(clickEvent, openCard);

    if(card1 == null){
        card1 = index;
    }else{
        if(cards[index] == cards[card1]){
            card2 = index;
            setTimeout(keepCard, 400)
        }else{
            card2 = index;
            setTimeout(flipBack, 400);
        }
    }

    if(time0 == -1){
        var date=new Date();
        time0 = date.getTime();
        tick();
        restartButton.disabled = false;
    }
}


function flipBack(){

    var place1 = places[card1];
    var place2 = places[card2];

    place1.className = "card back";
    place2.className = "card back";

    place1.removeChild(place1.firstChild);
    place2.removeChild(place2.firstChild);

    place1.addEventListener(clickEvent, openCard, false);
    place2.addEventListener(clickEvent, openCard, false);

    card1 = null;
    card2 = null;
}


function keepCard(){

    var place1 = places[card1];
    var place2 = places[card2];

    place1.className = "card matched";
    place2.className= " card matched";

    place1.removeChild(place1.firstChild);
    place2.removeChild(place2.firstChild);

    card1 = null;
    card2 = null;

    if(matched.length == places.length){

        clearTimeout(timer);
        var date = new Date();
        var time = date.getTime();
        var newRecord = time - time0;
        timeView.textContent = getTimeString(newRecord);

        if(bestRecord == null || bestRecord > newRecord){
            bestRecord = newRecord;
            saveData("BestRecord", bestRecord);
            bestView.textContent = getTimeString(newRecord);
        }

        var audio = document.getElementById("soundClear");
        audio.play();
        alert("Congratulations!");
        audio.load();

        time0 = -1;
        restartButton.disabled = false;
        restartButton.textContent = "リプレイ";
    }
}


function tick(){
    clearTimeout(timer);
    var date = new Date();
    var time = date.getTime();
    timeView.textContent = getTimeString(time - time0);
    timer = setTimeout(tick, 100);
}


function getTimeString(value){
    var date = new Date(value);
    var m = fixDigits(date.getUTCMinutes());
    var s = fixDigits(date.getUTCSeconds());
    var ms = fixDigits(Math.floor(date.getUTCMilliseconds() / 10));
    return m + ":" + s + "." + ms;
}


function fixDigits(number){
    string = number.toString();
    if(string.length == 1) string = "0" + string;
    return string;
}


function replayGame(){
    if(time0 == -1){
        deal();
    }else{
        if(confirm("ゲームを終了します。よろしいですか。")){
            clearTimeout(timer);
            time0 = -1;
            deal();
        }
    }
}


function loadSettings(){

    var storage = localStorage;
    if(typeof storage == "undefined") return;

    bestRecord = storage.getItem("BestRecord");
    if(bestRecord){
        bestRecord = parseInt(bestRecord);
        bestView.textContent = getTimeString(bestRecord);
    }

    var image = storage.getItem("PanelImage");
    if(image){
        gamePanel.style.backgroundImage = "url('"+image+"')";
    }
}


function saveData(name, data){
    var storage = localStorage;
    if(typeof storage == "undefined") return;
    storage.setItem(name, data);
}


function setBackground(event){

    var file = event.target.files[0];
    window.URL= window.URL||window.webkitURL;
    var url = window.URL.createObjectURL(file);
    gamePanel.style.backgroundImage = "url('"+url+"')";

    var canvas = document.createElement("canvas");
    var image = new Image();
    canvas.width = 400;
    canvas.height = 500;
    var context = canvas.getContext("2d");

    image.onload = function(){
        var w = image.naturalWidth;
        var h = image.naturalHeight;
        var offset;
        if(w > h){
            var width = w / h * canvas.height;
            offset = 0;
            if(width > canvas.width) offset = (canvas.width - width) / 2;
            context.drawImage(image, offset, 0, width, canvas.height);
        }else{
            var height = h / w * canvas.width;
            context.drawImage(image, 0, 0, canvas.width, height);
        }
        saveData("PanelImage", canvas.toDataURL());
    }
    image.src = url;
}


function hideControlPanel(event){
    controlPanel.style.visibility="hidden";
    document.addEventListener(moveEvent, showControlPanel);
}


function showControlPanel(event){
    var pageY;
    if(event.type == "touchmove"){
        pageY = event.touches[0].pageY;
    }else{
        pageY = event.pageY;
    }
    if(pageY < 580) return;

    controlPanel.style.visibility="visible";
    setTimeout(hideControlPanel, 3000);
    document.removeEventListener(moveEvent, showControlPanel);
}

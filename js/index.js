// Initialize Firebase
var config = {
    apiKey: "AIzaSyBmADetH3q9sOwUHKQJOiZzBA4az-mXzEI",
    authDomain: "ssplayer-4f58c.firebaseapp.com",
    databaseURL: "https://ssplayer-4f58c.firebaseio.com",
    projectId: "ssplayer-4f58c",
    storageBucket: "ssplayer-4f58c.appspot.com",
    messagingSenderId: "332347624393"
};
firebase.initializeApp(config);    
 


//autoplay再生イベント
let recclick = true;//クリックカウント
var keys = [];//連想配列をkeysに入れる
var currentIndex = 0;//鳴り終わったら
var playing = false;//鳴っているかどうか
var tv = document.getElementById("tv");
var audio = document.getElementById("oto");
var title = document.getElementById("title");

// var autoplay = $("#btn_autoplay").offset().top;

audio.autoplay = true;//再生中

firebase.database().ref('users').orderByChild("photo").on('value',
            function(snapshot){
                let objects = snapshot.val()
                keys.push(...Object.keys(objects).map(key => objects[key]));
});

audio.addEventListener("play", function() {
    var data = keys[currentIndex];
    tv.src= data.photo;
    title.textContent= data.koment+"/"+data.username;
}, false);

audio.addEventListener("ended", function() {
    if (playing) {
        currentIndex = (currentIndex + 1) % keys.length;//再生が終わったら
        audio.src = keys[currentIndex].mp3;//１から再生
    }
}, false);

$("#btn_autoplay").on("click",function(){
    if (!playing) {//再生していなければ
        playing = true;
        $("#btn_autoplay").offset(function(index, coords){
            return {
                top: coords.top + -25,
                };
            });
        if (!audio.src) {
            audio.src = keys[currentIndex].mp3;
            console.log("hakka");
        } else {
            audio.play();
        }
    } else {
        playing = false;
        audio.pause();
        $("#btn_autoplay").offset(function(index, coords){
            return {
                top: coords.top + 25,
                };
        });
        // $('btn_autoplay').offset({top: -25});
    }
})

    
    
    
//音量調整ボタン
var volume = document.getElementById('volume');

volume.addEventListener('change', function () {
    var volumeValue = (volume.value.length == 1) ? '0.0' + volume.value : '0.' +
    volume.value;
    v.volume = volumeValue;
}, false);
    
    
    
    
    
//REC投稿イベント
$("#btn_rec").on("click",function(){
    if(recclick==true){
        $("#btn_rec").offset(function(coords){
        return {
            top: coords.top + -25,
            };
        });
        recclick = false;
        getPosition();
        //leftの値 = (ウィンドウ幅 -コンテンツ幅) ÷ 2
        var leftPosition = (($(window).width() - $("#sample-dialog").outerWidth(true)) / 2);
        //CSSを変更
        $("#sample-dialog").css({"left": leftPosition + "px"});
        //ダイアログを表示する
        $("#sample-dialog").show();
        
        //閉じるボタンで非表示
        $(".dialog-close").on("click", function(){
        $(this).parents(".dialog").hide();
        });
    }else{
        $("#btn_rec").offset(function(coords){
        return {
            top: coords.top + 25,
            };
        });
        recclick = true;
    }
});












    

//firebaseへデータ送信
function addContact(){
//users参照
    firebase.database().ref('users/').push({
        ido:ido,
        keido:keido,
        username: $('#name').val(),
        koment:$('#koment').val(),
        mp3:mp3url,
        photo:PhotoUrl
    });
};


let PhotoUrl = "";
console.log(PhotoUrl);
    
    
    
    
// Firebaseにアップロードする
var uploader = document.getElementById("uploader");
var photofileButton = document.getElementById("photofileButton");
var mp3fileButton = document.getElementById("mp3fileButton");


// Firebaseに画像をアップロードする
photofileButton.addEventListener("change", function(e){
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref("sweet_gifs/"+file.name);
    var task = storageRef.put(file);
    task.on("state_changed",
    
    function progress(snapshot){
        var percentage = (snapshot.bytesTransferred /
        snapshot.totalBytes) * 100;
        uploader.value = percentage;
    },
    function error(err){
    },
    function complete(){
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            PhotoUrl = downloadURL;
        });
    });
});

// Firebaseに音をアップロードする
mp3fileButton.addEventListener("change", function(e){
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref("sweet_gifs/"+file.name);
    var task = storageRef.put(file);
    task.on("state_changed",
    
    function progress(snapshot){
        var percentage = (snapshot.bytesTransferred /
        snapshot.totalBytes) * 100;
        otouploader.value = percentage;
    },
    function error(err){
    },
    function complete(){
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            mp3url = downloadURL;
        });
    });
});



//現在地
// var lat = 35.3622222, lon = 138.7313889;
// var map = null;
let ido = "";
let keido = "";

// 現在地取得処理
function getPosition() {
    // 現在地を取得
    navigator.geolocation.getCurrentPosition(
    // 取得成功した場合
    function(position) {
        ido = position.coords.latitude;
        keido = position.coords.longitude;
        // alert("緯度:"+position.coords.latitude+",経度"+position.coords.longitude);
        console.log(ido);
    },
    // 取得失敗した場合
    function(error) {
        switch(error.code) {
        case 1: //PERMISSION_DENIED
            alert("位置情報の利用が許可されていません");
            break;
        case 2: //POSITION_UNAVAILABLE
            alert("現在位置が取得できませんでした");
            break;
        case 3: //TIMEOUT
            alert("タイムアウトになりました");
            break;
        default:
            alert("その他のエラー(エラーコード:"+error.code+")");
            break;
        }
    });
}
    


    
// 地図にピンを立てる処理自分のピンがあるところにするとか！！！！
function GetMap() {
        map = new Microsoft.Maps.Map('#myMap', {
        center: new Microsoft.Maps.Location(35.6811, 139.6994), 
        mapTypeId: Microsoft.Maps.MapTypeId.canvasLight,//
        zoom: 16
    });
    // MAP 中 ⼼ 座 標 を 取得 
    let center = map.getCenter();
    //PushPin の 設 定 
    let pin = new Microsoft.Maps.Pushpin(center,{
        icon: "img/neko.png",
        // color: "red",
        draggable: true,
        enableClickedStyle: true,
        visible: true
    });
    map.entities.push(pin);
    // // MAP 中 ⼼ 座 標 を 取得 
    // let center = map.getCenter();
    // //PushPin の 設 定 
    // let pin = new Microsoft.Maps.Pushpin(center,{
    //     color: "red",
    //     draggable: true,
    //     enableClickedStyle: true,
    //     visible: true
    // });
    // map.entities.push(pin);
}

//ページ開いた時に地図に音声データの位置ピンを散りばめる
function init() {
    firebase.database().ref('users').orderByChild("photo").on('value',
    function(snapshot){
        let objects = snapshot.val()
        let keys = Object.keys(objects).map(key => objects[key])

        for(let i = 0; i<keys.length; i++){
            let point = new Microsoft.Maps.Location(keys[i].ido, keys[i].keido);
            let pin = new Microsoft.Maps.Pushpin(point, { color: "red",'draggable': false });
            map.entities.push(pin);
        }
    });
}
console.log(ido);
    
function beam(){
    if(keys[i].ido == newido){
        console.log("正解！")
    }
}
    
    
    // 緯度:35.6811648,経度139.6994909
    
    
    // $("#btn_y").on("click",function(){
    //     console.log("Yクリックされた");
            // );

            // v.loop = true;//これでrリピート再生が出来る！！
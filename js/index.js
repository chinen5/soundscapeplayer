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


function onn() {
    $('#tv').hide();
    $('#myMap').hide();
};

//autoplay再生イベント
let recclick = true;//クリックカウント
var keys = [];//連想配列をkeysに入れる
var currentIndex = 0;//鳴り終わったら
var autoplaying = false;//オートプレイ鳴っているかどうか
var playing = false;//通常のプレイ鳴っているかどうか
var tv = document.getElementById("tv");
var audio = document.getElementById("oto");
var title = document.getElementById("title");
let playido = "";
let playkeido = "";


audio.autoplay = true;//再生中

firebase.database().ref('users').orderByChild("photo").on('value',
            function(snapshot){
                let objects = snapshot.val()
                keys.push(...Object.keys(objects).map(key => objects[key]));
});

audio.addEventListener("play", function() {
    var data = keys[currentIndex];
    console.log(data);
    tv.src= data.photo;
    title.textContent= data.koment+"/"+data.username;

    //地図連動↓
    playido = data.ido;
    playkeido = data.keido;
    map.setView({ 
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(playido,playkeido ),
        zoom: 15
    }); 
}, false);

$("#btn_autoplay").on("click",function(){
    if (!autoplaying) {//再生していなければ
        autoplaying = true;
        playing = false;
        $("#btn_autoplay").offset(function(index, coords){
            return {
                top: coords.top + -43,
                };
            });
        if (!audio.src) {
            audio.src = keys[currentIndex].mp3;
        } else {
            audio.play();
        }
    } else {
        autoplaying = false;
        audio.pause();
        $("#btn_autoplay").offset(function(index, coords){
            return {
                top: coords.top + 43,
                };
        });
    }
})


audio.addEventListener("ended", function() {
    if (autoplaying) {
        currentIndex = (currentIndex + 1) % keys.length;//再生が終わったら
        audio.src = keys[currentIndex].mp3;//１から再生
    }
}, false);


let powerclilk = true;

$("#power_b").on("click",function(){
    if(powerclilk == true){
        init();
        $('#tv').show();
        $('#myMap').show();
        $('#title').show();
        powerclilk = false;
        audio.pause();
        $("#power_b").offset(function(index, coords){
            return {
                top: coords.top + -43,
                };
        });
    }else{
        $('#tv').hide();
        $('#myMap').hide();
        $('#title').hide();
        powerclilk = true;
        $("#power_b").offset(function(index, coords){
            return {
                top: coords.top + +43,
                };
        });
    }
});

let btnclick = 0;

//クリックして再生の場合
$("#play_b").on("click",btnclick++,function(){
    if (!playing) {//再生していなければ
        playing = true;
        autoplaying = false;
        if (!audio.src) {
            audio.src = keys[currentIndex].mp3;
            console.log(btnclick);
        } else {
            audio.play()
            $("#btn_autoplay").prop("disabled", false);
            // btnclick=2;
        }
    }else if(btnclick==2){
        audio.src = keys[curentIndex++].mp3;
    }
})

//クリックして止める
$("#pause_b").on("click",function(){
        playing = false;
        audio.pause();
});


//スキップ
$("#next_b").on("click",function(){
    currentIndex = (currentIndex + 1) % keys.length;//再生が終わったら
    audio.src = keys[currentIndex].mp3;//１から再生
});

//もどる
$("#rev_b").on("click",function(){
    currentIndex = (currentIndex - 1) % keys.length;//再生が終わったら
    audio.src = keys[currentIndex].mp3;//１から再生
});

//ループ再生
$("#repert_b").on("click",function(){
    audio.loop = true;
});

//保存ページへ転送
$("#rec").on("click",function(){
    document.location.href = "rec.html";
});


//音量調整ボタン
var volume = document.getElementById('volume');

volume.addEventListener('change', function () {
    var volumeValue = (volume.value.length == 1) ? '0.0' + volume.value : '0.' +
    volume.value;
    audio.volume = volumeValue;
}, false);


//現在地
let ido = "";
let keido = "";


    
// 最初に地図が立ち上がった時一旦富士山のとこを中心に表示！
function GetMap() {
        map = new Microsoft.Maps.Map('#myMap', {
        center: new Microsoft.Maps.Location(35.3622222, 138.7313889), 
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,//
        zoom: 4
    });
}

//ページ開いた時に地図に音声データの位置ピンを散りばめる
function init() {
    firebase.database().ref('users').orderByChild("photo").on('value',
    function(snapshot){
        let objects = snapshot.val()
        let keys = Object.keys(objects).map(key => objects[key])

        for(let i = 0; i<keys.length; i++){
            let point = new Microsoft.Maps.Location(keys[i].ido, keys[i].keido);
            let livepin = new Microsoft.Maps.Pushpin(point, { color: "red",'draggable': false });
            map.entities.push(livepin);
        }
    })
}   

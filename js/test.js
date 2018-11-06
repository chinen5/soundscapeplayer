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
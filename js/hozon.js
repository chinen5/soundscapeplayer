var config = {
    apiKey: "AIzaSyBmADetH3q9sOwUHKQJOiZzBA4az-mXzEI",
    authDomain: "ssplayer-4f58c.firebaseapp.com",
    databaseURL: "https://ssplayer-4f58c.firebaseio.com",
    projectId: "ssplayer-4f58c",
    storageBucket: "ssplayer-4f58c.appspot.com",
    messagingSenderId: "332347624393"
};
firebase.initializeApp(config);

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
        // console.log(ido);
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
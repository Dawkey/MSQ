let $audio = document.getElementById("audio");
$audio.volume = 0.2;

let $button = document.getElementById("button");
let $button_2 = document.getElementById("button_2");

let flag = true;
$button.addEventListener("click",function(){
    if(flag){
        $audio.play();
    }else{
        $audio.pause();
    }

    flag = !flag;
},false);


function get_analyser(){
    let ctx = new AudioContext();
    let analyser = ctx.createAnalyser();
    let audiosrc = ctx.createMediaElementSource($audio);
    audiosrc.connect(analyser);
    analyser.connect(ctx.destination);
    analyser.fftSize = 512;
    return analyser;
}


let array = [];
let analyser = null;
let analyser_flag = true;
$button_2.addEventListener("click",function(){
    if(analyser_flag){
        analyser_flag = false;
        analyser = get_analyser();
        array = new Uint8Array(analyser.frequencyBinCount);
    }
},false);


// canvas
/*
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cwidth = canvas.width;
var cheight = canvas.height - 2;
var meterWidth = 5; //方块的宽度
var gap = 2; //方块的间距
var minHeight = 2;
var meterNum = cwidth / (meterWidth + gap);//根据宽度和间距计算出可以放多少个方块

ctx.fillStyle = 'rgba(10,255,255,.5)';//填充

function render() {
    analyser.getByteFrequencyData(array);
    // analyser.getByteTimeDomainData(array);
    var step = Math.round(array.length / meterNum);//从频谱数据中每隔step均匀取出meterNum个数据
    ctx.clearRect(0, 0, cwidth, cheight);
    for (var i = 0; i < meterNum; i++) {
        var value = array[i * step];
        ctx.fillRect(i * (meterWidth+gap) , cheight - value + 10, meterWidth, cheight||minHeight); //绘制
    }
    requestAnimationFrame(render);
}
*/
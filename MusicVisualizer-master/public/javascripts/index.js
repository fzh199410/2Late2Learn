function $(node) {
    return document.querySelectorAll(node)
}
var xhr=new XMLHttpRequest()
var ac=new (window.AudioContext||window.webkitAudiocontext)();
var gainNode=ac[ac.createGain?'createGain':'createGainNode']();
gainNode.connect(ac.destination);
var analyser=ac.createAnalyser();
var size=128;
analyser.fftSize=size*2;
analyser.connect(gainNode)
var source=null
var count=0
var firstPlay=true;
function load(url) {
    var n=++count;
    source&&source[source.stop?'stop':'noteOff']();
    xhr.abort();
    xhr.open('GET',url)
    xhr.responseType='arraybuffer';
    xhr.onload=function () {
        if(n!=count)return
        ac.decodeAudioData(xhr.response,function (buffer) {
            if(n!=count)return
            var bufferSource=ac.createBufferSource();
            bufferSource.buffer=buffer;
            bufferSource.connect(analyser);
            // bufferSource.connect(gainNode);
            // bufferSource.connect(ac.destination);  已经连接到gainNode 所以不用连接
            bufferSource[bufferSource.start?'start':'noteOn'](0)
            source=bufferSource
            if(firstPlay&&source){
                console.log('first')
                visualizer()
            }
            firstPlay=false;
        },function (err) {
            console.log(err)
        })
    }
    xhr.send()
}
var type='column';
function visualizer() {
    var arr=new Uint8Array(analyser.frequencyBinCount); //为FFT的一般 实时得到的音频数据个数
    requestAnimationFrame=window.requestAnimationFrame||
                          window.webkitRequestAnimationFrame||
                          window.mozRequestAnimationFrame;
    function v() {
        analyser.getByteFrequencyData(arr);
        draw(arr)
        requestAnimationFrame(v)
    }
    v()
}

function changeVolume(percent) {
    gainNode.gain.value=percent*percent
}

function change(obj) {
    changeVolume(obj.value/obj.max)
}

var box=$('#box')[0];
var height,width;
var canvas=document.createElement('canvas');
box.appendChild(canvas)
var ctx=canvas.getContext('2d')
var Dots=[];

function random(m, n) {
    return Math.round(Math.random()*(n-m)+m);
}
function getDots() {
    Dots=[];
    for(var i=0;i<size;i++){
        var x=random(0,width);
        var y=random(0,height);
        var color="rgb("+random(0,255)+","+random(0,255)+","+random(0,255)+")"
        Dots.push({
            x:x,
            y:y,
            color:color
        })
    }
}

function draw(arr) {
    ctx.clearRect(0,0,width,height)
    var w=width/size
    for(var i=0;i<size;i++){
        if(type==='column'){
            var h=arr[i]/256*height;
            ctx.fillRect(w*i,height-h,w*0.7,h)
        }else if(type==='dot'){
            ctx.beginPath()
            var dot=Dots[i];
            var r=arr[i]/256*50;
            ctx.arc(dot.x,dot.y,r,0,Math.PI*2)
            var g=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,r);
            g.addColorStop(0,'#fff');
            g.addColorStop(1,dot.color)
            ctx.fillStyle=g;
            ctx.fill()
        }

    }
}
function resize() {
    height=box.clientHeight;
    width=box.clientWidth;
    canvas.width=width;
    canvas.height=height;
    var line=ctx.createLinearGradient(0,0,0,height)
    line.addColorStop(0,'red');
    line.addColorStop(0.5,'yellow');
    line.addColorStop(1,'green');
    ctx.fillStyle=line;
    getDots()
}
resize()
window.onresize=resize;

window.onload=function () {
    var types=$('#type li');
    for(var j=0;j<types.length;j++){
        types[j].onclick=function () {
            for(let k=0;k<types.length;k++){
                types[k].className=''
            }
            this.className='selected'
            type=this.getAttribute('data-type');
            resize()
        }
    }
    var list=$('#list li');
    for(var i=0;i<list.length;i++){
        list[i].onclick=function () {
            for(var j=0;j<list.length;j++){
                list[j].className='';
            }
            this.className='selected'
            load('/media/'+this.title)
        }
    }
}


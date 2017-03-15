/**
 * Created by Administrator on 2017/3/14.
 */
function $(node) {
    return document.querySelectorAll(node)
}

var size=128;
var type='column';
var box=$('#box')[0];
var height,width;
var canvas=document.createElement('canvas');
box.appendChild(canvas)
var ctx=canvas.getContext('2d')
var Dots=[];

var MV=new MusicVisualizer({
    size:size,
    visualizer:draw,

})
console.log(MusicVisualizer.prototype)
function changeVolume(percent) {
    MV.changeVolume(percent)
}
function change(obj) {
    changeVolume(obj.value/obj.max)
}

function random(m, n) {
    return Math.round(Math.random()*(n-m)+m);
}
function getDots() {
    Dots=[];
    for(var i=0;i<size;i++){
        var x=random(0,width);
        var y=random(0,height);
        var color="rgba("+random(0,255)+","+random(0,255)+","+random(0,255)+","+0+")"
        Dots.push({
            x:x,
            y:y,
            dx:random(1,2),
            color:color,
            cap:0
        })
    }
}

function draw(arr) {
    ctx.clearRect(0,0,width,height)
    var w=width/size
    var cw=w*0.7;
    var capH=cw
    for(var i=0;i<size;i++){
        var dot=Dots[i];
        if(type==='column'){
            var h=arr[i]/256*height;
            ctx.fillRect(w*i,height-h,w*0.7,h)
            ctx.fillRect(w*i,height-(capH+dot.cap),w*0.7,capH)
            dot.cap--;
            if(dot.cap<0){dot.cap=0}
            if(h>0&&dot.cap<h+40){
                dot.cap=h+40>height-capH?height-capH:h+40
            }
        }else if(type==='dot'){
            ctx.beginPath()
            var r=10+arr[i]/256*(height>width?width:height)/10;
            ctx.arc(dot.x,dot.y,r,0,Math.PI*2)
            var g=ctx.createRadialGradient(dot.x,dot.y,0,dot.x,dot.y,r);
            g.addColorStop(0,'#fff');
            g.addColorStop(1,dot.color)
            ctx.fillStyle=g;
            ctx.fill()
            dot.x+=dot.dx;
            if(dot.x-r>width){
                dot.x=0
            }
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
            MV.play('/media/'+this.title)
        }
    }
}


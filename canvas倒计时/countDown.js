/**
 * Created by Administrator on 2017/3/13.
 */
let WINDOW_WIDTH=window.innerWidth;
let WINDOW_HEIGHT=window.innerHeight;
let RADIUS=Math.round((WINDOW_WIDTH*4/5/108)-1);
let MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);
let MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
const endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000)
let curShowTimeSeconds=0
let balls=[]
const colors=['#33b5e5','#0099cc','#aa66cc','#ee735c','#99cc00','#669900','#ffbb33','#ffbb33','#ff8800','#ff4444','#cc0000']

window.onload=function () {
    let canvas=document.getElementById('canvas');
    let context=canvas.getContext('2d');

    canvas.width=WINDOW_WIDTH;canvas.height=WINDOW_HEIGHT;
    curShowTimeSeconds=getCurShowTimeSeconds();
    render(context)
    setInterval(function () {
        render(context)
        update()
    },25)
};
function getCurShowTimeSeconds() {
    let curTime=new Date()
    let ret=endTime.getTime()-curTime.getTime();
    ret=Math.round(ret/1000)
    return ret>0?ret:0;
}
function update() {
    let nextShowTimeSeconds=getCurShowTimeSeconds()
    let nextHours=parseInt(nextShowTimeSeconds/3600);
    let nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    let nextSeconds=nextShowTimeSeconds%60;

    let curHours=parseInt(curShowTimeSeconds/3600)
    let curMinutes=parseInt((curShowTimeSeconds-3600*curHours)/60);
    let curSeconds=curShowTimeSeconds%60;
    if(nextSeconds!=curSeconds){
        if(parseInt(curHours/10)!=parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10))
        }
        if(parseInt(curHours%10)!=parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10))
        }
        if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10))
        }
        if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10))
        }
        if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10))
        }
        if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10))
        }
        curShowTimeSeconds=nextShowTimeSeconds;
    }
    updateBalls()
}
function updateBalls() {
    for(let i=0;i<balls.length;i++){
        balls[i].x+=balls[i].vx;
        balls[i].y+=balls[i].vy;
        balls[i].vy+=balls[i].g;
        if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
            balls[i].y=WINDOW_HEIGHT-RADIUS
            balls[i].vy=-balls[i].vy*0.6;
            if(Math.abs(balls[i].vy)<6){
                balls[i].g=0;
                balls[i].vy=0
            }
        }
    }
    for(let i=0;i<balls.length;i++){
        if(balls[i].x-RADIUS<0||balls[i].x+RADIUS>WINDOW_WIDTH){
            balls.splice(i,1);
        }
    }
}
function addBalls(x,y,num) {
    for(let i=0;i<digit[num].length;i++) {
        for (let j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j]===1){
                let ball={
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    r:RADIUS,
                    g:1.5+Math.random(),
                    vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                }
                balls.push(ball)
            }
        }
    }
}
function render(ctx) {
    ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT)
    let hours=parseInt(curShowTimeSeconds/3600)
    let minutes=parseInt((curShowTimeSeconds-3600*hours)/60);
    let seconds=curShowTimeSeconds%60;

    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),ctx)
    renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),ctx);
    renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,ctx)
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),ctx)
    renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),ctx);
    renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,ctx)
    renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),ctx)
    renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),ctx);

    for(let i=0;i<balls.length;i++){
        ctx.fillStyle=balls[i].color;
        ctx.beginPath()
        ctx.arc(balls[i].x,balls[i].y,balls[i].r,0,2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}

function renderDigit(x,y,num,ctx) {
    ctx.fillStyle='rgb(0,102,153)'
    for(let i=0;i<digit[num].length;i++){
        for(let j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]===1){
                ctx.beginPath()
                ctx.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI)
                ctx.closePath()
                ctx.fill()
            }
        }
    }
}
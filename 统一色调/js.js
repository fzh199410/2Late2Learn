const $board = document.querySelector('board')
const $palette = document.querySelector('colors')
const $gameover = document.querySelector('game-over')
const $tally = document.querySelector('.moves')
const $cap = document.querySelector('.max-moves')
const $level = document.querySelector('.level')
const $skill = document.querySelector('.skill')
const colorArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

let maxMoves = (colors, skill) => {
    return Math.ceil((colors.length * 3.7 - (skill / 1.5)) / 5) * 5
}

let running = false;
let cell = '-x';
let moves = 0;
let skill = Math.round(colorArray.length/2) || $level.value;
let cap = maxMoves(colorArray, skill);
let color;

let shuffle = (collection) => {
    for(let i=collection.length;i;i--){
        let index=Math.floor(Math.random()*i);
        [collection[i-1],collection[index]]=[collection[index],collection[i-1]]
    }
    return collection
}

let setColors = (collection,n) => {
    // [1,2,3,4].slice(1,3) 2 3
    return n < 10 ?shuffle(collection).slice(0,n):collection
};
let builder = (container,element,colors,n,isRam) => {
    container.innerHTML='';
    n=n || colors.length;
    isRam=isRam || false;
    for(let i=0;i<n;i++){
        let ele=document.createElement(element)
        ele.className=isRam?colors[Math.floor(Math.random()*colors.length)]:colors[i]
        container.appendChild(ele)
    }

};

let checkColor= (color) => {
    let nodes=$board.childNodes;
    let nodesNumber=nodes.length;
    for(let x=0;x<nodesNumber;x++){
        if(nodes[x].className.indexOf(cell) > -1) {
            nodes[x].className = color + cell
            if (x + 1 < 100 && nodes[x + 1].className === color) {
                nodes[x + 1].className += cell
            }
            if (x + 10 < 100 && nodes[x + 10].className === color) {
                nodes[x + 10].className += cell
            }
            if (x - 1 >= 0 && x % 10 > 0 && nodes[x - 1].className === color) {
                nodes[x - 1].className += cell
            }
            if (x - 10 >= 0 && x % 10 > 0 && nodes[x - 10].className === color) {
                nodes[x - 10].className += cell
            }
        }
    }
};
let checkWin = (moves,cap) => {
    let n=0 ;
    let msg='';
    if (moves<=cap){
        if($board.childNodes[99].className.indexOf(cell)>-1){
            for(let i=0;i<$board.childNodes.length;i++){
                if($board.childNodes[i].className.indexOf(cell)>-1){
                    n++
                }
            }
        }
        if(n===100){
            msg='<i class="new-game fa fa-smile-o"></i>'
            skill++;
            running=false
        }else if(moves>=cap&&n<100){
            msg='<i class="new-game fa fa-frown-o"></i>'
            skill--;
            running=false
        }
    }else{
        msg='<i class="new-game fa fa-frown-o"></i>'
        skill--;
        running=false
    }
    if(running===false){
        $gameover.innerHTML=msg;
    }
    skill=skill<3?3:(skill>10?10:skill)
}

let newGame = () => {
    $level.value=skill;
    $skill.innerText=skill;
    let colors=setColors(colorArray,skill);
    moves=0;
    cap=maxMoves(colors,skill);
    $gameover.innerHTML='';
    $tally.innerText=moves;
    running=true;
    $cap.innerText=cap;
    builder($palette,'color',colors);
    builder($board,'tile',colors,100,true);
    color=$board.childNodes[0].className;
    $board.className=' '
    $board.childNodes[0].className=color+cell
    checkColor(color)
};

let play= (chip)=>{

    if(running&&color!==chip){
        color=chip;
        if($board.className!=='started'){
            $board.className='started'
        }
        moves++;
        $tally.innerText=moves;
        checkColor(chip);
        checkWin(moves,cap)
    }
}

document.addEventListener('DOMContentLoaded',() => {
    newGame()
},false);

$level.addEventListener('change',(e) => {
    skill=e.target.value;
    newGame()
},false)

document.addEventListener('click',(e) => {
    let css=Array.from(e.target.classList);
    if(e.target.tagName==='COLOR'){
        play(e.target.className)
    }else if(css.includes('new-game')){
        newGame()
    }

})
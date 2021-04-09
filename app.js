
document.addEventListener('DOMContentLoaded', () =>{
    const tabla=document.querySelector('.tabla');
    let dimensiune=10;
    let numarBombe=15;
    let board=document.querySelector('.board');
    board.textContent="Test your knowledge!";
    let instructions=document.querySelector('.instructions');
    instructions.textContent="You've got 15 bombs that you have to mark them in order to win.";
    let patrate=Array(dimensiune).fill(null).map(() => Array(dimensiune));
    for(var i=0;i<dimensiune;i++){
        for(var j=0;j<dimensiune;j++){
            patrate[i][j]=new Cell;
        }
    }
    let tablaGenerata=spawnBombs(patrate,numarBombe);
    function TablaJoc(){
        for(var i=0;i<dimensiune;i++){
            for(var j=0;j<dimensiune;j++){
                tablaGenerata[i][j].bombeInJur=checkBombsAround(tablaGenerata,i,j);
            }
        }
        for(let i=0; i<dimensiune;i++){
            for(let j=0; j<dimensiune;j++){
            const patrat=document.createElement('div');
            patrat.setAttribute('id',`${i},${j}`);
            patrat.addEventListener("click",function(event){
                patrat.style.backgroundColor="lightblue";
                if(tablaGenerata[i][j].nrBombe()==="B") {
                    patrat.style.backgroundImage="url('bomb.png')";
                    revealTable(tablaGenerata,dimensiune);
                }else if (tablaGenerata[i][j].nrBombe()===0)
                {
                    patrat.textContent="";
                    tablaGenerata[i][j].revealed=true;
                    revealZero(tablaGenerata,i,j);
                }else {
                    patrat.textContent=tablaGenerata[i][j].nrBombe();
                    tablaGenerata[i][j].revealed=true;
                }
            });
            patrat.addEventListener("contextmenu",function(e){
                e.preventDefault();
                if(!patrat.style.backgroundImage&&!patrat.textContent&&(tablaGenerata[i][j].nrBombe()>0||tablaGenerata[i][j].type=='bomba')){
                patrat.style.backgroundImage="url('flag.png')";
                tablaGenerata[i][j].flag=true;
                }else {
                    patrat.style.backgroundImage="";
                    tablaGenerata[i][j].flag=false;
                }
            });
            tabla.appendChild(patrat);
            }
        }
        
        

    } 
    function shuffle(sir){
        return sir.sort(()=> Math.random()-0.5);
    }
    
    function transf1Dto2D(array, part) {
        var tmp = [];
        for(var i = 0; i < array.length; i += part) {
            tmp.push(array.slice(i, i + part));
        }
        return tmp;
    }
    
    function spawnBombs(arrayTabla,numarBombe){
        var dim=arrayTabla[0].length;
        var tmp=arrayTabla.reduce((a, b) => [...a, ...b], []);
        for(var i=0; i<numarBombe;i++){
            tmp[i].type ='bomba';
        }
        return transf1Dto2D(shuffle(tmp),dim);
    }
    
    function checkBombsAround(arrayTabla, row, collumn){
        var bombeInJur=0;
        if(arrayTabla[row][collumn].type==='bomba') return "B";
        for(var i=row-1;i<=row+1;i++){
            for(var j=collumn-1;j<=collumn+1;j++){
                try{
                if(arrayTabla[i][j].type==='bomba') arrayTabla[row][collumn].bombeInJur+=1;
                }catch(e){continue;}
            }
        }
        return arrayTabla[row][collumn].bombeInJur; 
    }

    function Cell() {
        this.type='liber';
        this.bombeInJur=0;
        this.flag=false;
        this.revealed=false;
    }

    Cell.prototype.nrBombe=function(){
        return this.bombeInJur;
    }

    function revealTable(tabla,dimensiune){
        for(var i=0;i<dimensiune;i++){
            for(var j=0;j<dimensiune;j++){
                let div=document.getElementById(`${i},${j}`);
                if(tabla[i][j].nrBombe()==="B"){
                    div.style.backgroundImage="url('bomb.png')";
                    div.style.backgroundColor="red";
                }else 
                    {
                        div.style.backgroundImage="";
                        div.textContent=tabla[i][j].nrBombe();
                        if(tabla[i][j].nrBombe()===0) div.textContent="";
                    }
            }
        }
        board.textContent="Game over!";
        
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    async function revealZero(tabla,row,collumn){
        for(let i=row-1;i<=row+1;i++){
            for(let j=collumn-1;j<=collumn+1;j++){
                try{
                if(tabla[i][j].nrBombe()>=0&&tabla[i][j].revealed===false){
                    let div=document.getElementById(`${i},${j}`);
                    await sleep(50);
                    div.style.backgroundImage="";
                    div.style.backgroundColor="lightblue";
                    div.textContent=tabla[i][j].nrBombe();
                    tabla[i][j].revealed=true;
                    if(tabla[i][j].nrBombe()===0) {
                        div.textContent="";
                        revealZero(tabla,i,j);
                    }
                }
            }catch(e){continue;}
            }
        }             
    }

    let lastTime=0;
    function winCondition(timestamp){
        let merge=0;
        let deltaTime=timestamp-lastTime;
        lastTime=timestamp;
        for(var i=0;i<dimensiune;i++){
            for(var j=0;j<dimensiune;j++){
                if(tablaGenerata[i][j].type==='bomba'&&tablaGenerata[i][j].flag===true)
                    {
                        merge+=1;
                        if(merge===numarBombe){
                            board.textContent=("You won!");
                            var k=true;
                        }
                    }
            }
        }
        if(!k)  requestAnimationFrame(winCondition);
        
    }
    winCondition();

    
    TablaJoc();
   });

  function f1(){
      location.reload();
  }
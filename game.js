let c;
let ctx;

window.onload = init;

const ground = new Image();
ground.src = "ground.png";

const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

const smithImg = new Image();
smithImg.src = "smith.png";

const box = 32;

class gracz{
	
	constructor(x, y, hp, dmg, delay, lastAttack, gold, potion){
		this.x = x;
		this.y = y;
		this.hp = hp;
		this.dmg = dmg;
		this.delay = delay;
		this.lastAttack = lastAttack;
		this.gold = gold;
		this.potion = potion;
	}
	
	attack(o,ok){
			window.onkeydown = function(event) {		
			if(event.keyCode==70&&ok==true){
				o.hp -= player.dmg;
				ok = false;
			}
		}
	}
}

class enemy{
	constructor(x, y, hp, dmg, delay, lastAttack){
		this.x = x;
		this.y = y;
		this.hp = hp;
		this.dmg = dmg;
		this.delay = delay;
		this.lastAttack = lastAttack
	}
	
	attack(o){
		player.hp -= o.dmg;
	}
}

class npc{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	sell(){
		window.onkeydown = function(event){
			if(event.keyCode==66&&player.gold>=2){
				player.gold-=2;
				player.dmg+=10;
			}
		}
	}
}

let player = new gracz(1 * box, 3 * box, 100, 10, 1000, null, 0, 1);

let enemy1 = [];

let enemy1Count = 4;

let smith = new npc(13 * box,13 * box);

let currentlyLock;

function init(){
	c = document.getElementById("game");
	ctx = c.getContext("2d");
	
	makeEnemy();
	
	window.requestAnimationFrame(gameLoop);
}

function makeEnemy(){
	for(let i=0; i<enemy1Count; i++){
		enemy1[i] = new enemy(Math.floor(Math.random() * 22+1) * box, Math.floor(Math.random() * 22+1) * box, 20, 10, 1000, null);
	}
}

function drawMap(){
	ctx.drawImage(ground,0,0);
}

function draw(){
	ctx.clearRect(0,0,768,768);
	drawMap();
	ctx.drawImage(playerImg,player.x,player.y);
	
	for(let i=0; i<enemy1Count; i++){
			ctx.drawImage(enemyImg,enemy1[i].x,enemy1[i].y);
			
			ctx.font = "30px Arial";
			ctx.fillText(enemy1[i].hp,enemy1[i].x,enemy1[i].y-10);
	}
	
	ctx.drawImage(smithImg,smith.x,smith.y);
	
	ctx.fillRect(680,0,88,68);
	ctx.font = "15px Arial";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	ctx.strokeRect(680,0,88,68);
	ctx.fillText("HP: "+player.hp,685,20);
	ctx.fillText("DMG: "+player.dmg,685,40);
	ctx.fillText("GOLD: "+player.gold,685,60);
	
	ctx.fillStyle = "black";
	ctx.font = "30px Arial";
	ctx.fillText(player.x+" "+player.y,10,50);
}	

function enemyDeath(){
	for(let i=0; i<enemy1Count; i++){
		if(enemy1[i].hp<=0){
			enemy1.splice(i, 1);
			enemy1Count-=1;
			player.gold++;
		}
	}
}

function playerDeath(){
	if(player.hp<=0){
		return false;
	}else
		return true;
}

function checkCollision(a,b){
	if(
		(a.x==(b.x+box)&&a.y==(b.y-box))||
		(a.x==(b.x+box)&&a.y==b.y)||
		(a.x==(b.x+box)&&a.y==(b.y+box))||
		
		(a.x==(b.x-box)&&a.y==(b.y-box))||
		(a.x==(b.x-box)&&a.y==b.y)||
		(a.x==(b.x-box)&&a.y==(b.y+box))||
		
		(a.x==b.x&&a.y==(b.y+box))||
		(a.x==b.x&&a.y==(b.y-box))||
		(a.x==b.x&&a.y==(b.y))
	){
		return true;
	}
		return false;
}

function checkMovementCollision(a,b){
	if(a.x==(b.x+box)&&a.y==b.y){
		currentlyLock="left";
		return true;
	}else if(a.x==(b.x-box)&&a.y==b.y){
		currentlyLock="right";
		return true;
	}else if(a.x==b.x&&a.y==(b.y+box)){
		currentlyLock="up";
		return true;
	}else if(a.x==b.x&&a.y==(b.y-box)){
		currentlyLock="down";
		return true;
	}
	currentlyLock=null;
	return false;
}

function gameManager(){
	
	let now = new Date(); 
	let allowAttack = false;
	
	for(let j=0; j<enemy1Count; j++){ //enemy1

		if(checkCollision(player, enemy1[j])==true){
			
			if(!player.lastAttack || now - player.lastAttack > player.delay){
				allowAttack = true;
				player.attack(enemy1[j],allowAttack);
				player.lastAttack = now;
			}
			
			if(!enemy1[j].lastAttack || now - enemy1[j].lastAttack > enemy1[j].delay){
				enemy1[j].attack(enemy1[j]);
				enemy1[j].lastAttack = now;
			}
		}
	}
	
	for(let j=0; j<1; j++){	//npc
		if(checkCollision(player, smith)==true){
			//kod co się robi ->funckja z klasy<-
			smith.sell();
			
			if(checkMovementCollision(player, smith)==true)
				checkMovementCollision(player, smith);
			else
				currentlyLock=null;
		}else
			currentlyLock=null;
	}
}

window.addEventListener('keydown', playerMove, false);
function playerMove(e){	
	if(e.keyCode==87&&currentlyLock!="up"&&player.y-box>0){
		player.y -= box;
	} else if(e.keyCode==83&&currentlyLock!="down"&&player.y+box<736){
		player.y += box;
	}
	
	if(e.keyCode==65&&currentlyLock!="left"&&player.x-box>0){
		player.x -= box;
	} else if(e.keyCode==68&&currentlyLock!="right"&&player.x+box<736){
		player.x += box;
	}
}
function gameLoop(){
	gameManager();
	enemyDeath();
	draw();
	
	if(playerDeath()==true){
    window.requestAnimationFrame(gameLoop);
	}
}
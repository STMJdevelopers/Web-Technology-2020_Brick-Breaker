let c = document.querySelector('#canvas'),
	bannerMulai = document.querySelector('.bannerMulai'),
	bannerUlangi = document.querySelector('.bannerUlangi'),
	livesshow = document.querySelector('#livesshow'),
	scoreshow = document.querySelector('#scoreshow'),
	desc = document.querySelector('.desc'),
	title = document.querySelector('#title'),
	ctx = c.getContext('2d'),
	bAtas = 0,
	bBawah = c.height-3,
	bKiri = 0,
	bKanan = c.width,
	brick = [[]],
	fromSide = false,
	papan = {},
	panjangPapan = 40,
	speedPapan = 2,
	ball = {},
	score = 0,
	gamePoint = 20,
	level1 = false,
	level2 = false,
	level3 = false,
	levelUp = false,
	// gravity = 3,
	gravity = 5,
	fallInLove = true,
	kemiringan = 7,
	lives = 0;

// Ketentuan:
// 1. Terdapat 7 brick mendatar dan 3 brick menurun
// 2. brick mempunyai 3 warna yang digenerate secara acak yaitu merah,kuning, dan hijau yang masing masing memiliki ketentuan sebagai berikut :
	// a. merah 1 kali tabrakan hancur dan memberikan 1 point
	// b. kuning 2 kali tabrakan hancur dan memberikan 2 point
	// c. hijau 3 kali tabrakan hancur dan memberikan 3 point
// 3. terdapat menu minimal menu mulai dan akhir
// 4. terdapat pergerakkan bola
// 5. terdapat point dan nyawa
// 



// function uwu

function $(node){
	let res = {}
	switch(typeof(node)){
		case 'object':
			res = {
				on: (event,func) => {
					node.addEventListener(event,func)
				}
			}
			break
		case 'string':		
			res = {
				on: (event,func) => {
					document.querySelector(node).addEventListener(event,func)
				}
			}
			break
		default:
			break
	}
	return res
}

function levelUP(){
	if(levelUp){
		gravity += 1
		levelUp = false
	}
}

function drawRect(obj){
	ctx.fillStyle = obj.color
	ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
}

function drawCircle(obj){
	ctx.beginPath()
	ctx.fillStyle = obj.color
	ctx.arc(obj.x, obj.y, obj.width, 0,2*Math.PI)
	ctx.fill()
}

function is_collision(obj1,obj2,callback,statement2=null){

	if( (obj1.x-(obj1.width+kemiringan) < obj2.x+(obj2.width) && obj1.x+(obj1.width+(obj1.width+kemiringan)) > obj2.x+(obj2.width)) ) {
		if(
		 (obj1.y-(obj1.height*2) < obj2.y+(obj2.width/2) && obj1.y+(obj1.height*2) > obj2.y+(obj2.width/2)) ){
			fromSide = true
			callback();	
		}
	}
	if( (obj1.y-(obj1.height*2) < obj2.y+(obj2.width/2) && obj1.y+(obj1.height*2) > obj2.y+(obj2.width/2)) ) {
		if( (obj1.x-(obj1.width/8) < obj2.x+(obj2.width/2) && obj1.x+(obj1.width+(obj1.width/4)) > obj2.x+(obj2.width/2)) ){
			callback();	
		}
	}
	if(statement2 != null){
		statement2();
	}
	// if( (obj1.x-(obj1.width/8) < obj2.x+(obj2.width/2) && obj1.x+(obj1.width+(obj1.width/4)) > obj2.x+(obj2.width/2)) &&
	// 	 (obj1.y-(obj1.height*2) < obj2.y+(obj2.width/2) && obj1.y+(obj1.height*2) > obj2.y+(obj2.width/2)) ){
	// 	callback();
	// }
	// if(statement2 != null){
	// 	statement2();
	// }
}

function genColor(){
	let colors = ["red","yellow","green"]
	let counting = Math.floor(Math.random()*1000000) // if * less than 1000 it will given error because counting have a opportunite zero num
	let numNow = 0
	let tempColor = ""
	for(let colorsIter = 0;colorsIter < counting;colorsIter++){
		tempColor = colors[numNow]
		
		numNow++

		if(numNow > colors.length-1){
			numNow = 0
		}
	}

	return tempColor
}


// function utama

function initComp(){
	level1 = false,
	level2 = false,
	level3 = false,
	levelUp = false;

	ball = {
		x: bKanan/2,
		y: bBawah/2,
		width: 5,
		color: 'green',
	}
	papan = {
		x: (bKanan/2)-(panjangPapan/2),
		y: bBawah,
		width: panjangPapan,
		height: 2,
		color: 'yellow' //warna bebas
	}
	brick[0] = {
		x: bKiri,
		y: bBawah/2,
		width: 40,
		height: 10,
		color: 'green',
		crash: false,
		brickDestroyHit: 3,
		brickScore: 3
	}
	// for(let brickIter1=0;brickIter1<3;brickIter1++){
	// 	let tempBrick = []
	// 	for(let brickIter2=0;brickIter2<7;brickIter2++){
	// 		let color = genColor();
	// 		if(color == 'red'){
	// 			tempBrick[brickIter2] = {
	// 				x: (brickIter2*43)+1,
	// 				y: (brickIter1*10),
	// 				width: 40,
	// 				height: 9,
	// 				color: color,
	// 				brickDestroyHit: 1,
	// 				brickScore: 1,
	// 				crash: false
	// 			}
	// 		}else if(color == 'yellow'){
	// 			tempBrick[brickIter2] = {
	// 				x: (brickIter2*43)+1,
	// 				y: (brickIter1*10),
	// 				width: 40,
	// 				height: 9,
	// 				color: color,
	// 				brickDestroyHit: 2,
	// 				brickScore: 2,
	// 				crash: false
	// 			}
	// 		}else if(color == 'green'){
	// 			tempBrick[brickIter2] = {
	// 				x: (brickIter2*43)+1,
	// 				y: (brickIter1*10),
	// 				width: 40,
	// 				height: 9,
	// 				color: color,
	// 				brickDestroyHit: 3,
	// 				brickScore: 3,
	// 				crash: false
	// 			}
	// 		}
	// 	}
	// 	brick[brickIter1] = tempBrick
	// }
	score = 0
	lives = 3
}

function init(){
	app = setInterval(() => {
		draw()
	},80)
}

function draw(){
	ctx.clearRect(0,0,
		c.width, c.height)
	drawBall()
	drawPapan()
	drawBrick()
	crashed()
	board()
	leveling()
}

function crashed(){
	for(let i=0;i<brick.length;i++){
		// for(let j=0;j<brick[i].length;j++){
			if(!brick[i].crash){
				is_collision(brick[i],ball,() => {

					fallInLove = true
					if(fromSide){
						kemiringan = kemiringan*-1;
						fromSide = false
					}
					brick[i].brickDestroyHit -= 1
					console.log(brick[i].brickDestroyHit)
					if(brick[i].brickDestroyHit == 0){
						score += brick[i].brickScore
						brick[i].crash = true
					}
				})
			}
		// }
	}
}


function drawBrick(){
	for(let i=0;i<brick.length;i++){
		// for(let j = 0; j < brick[i].length;j++){
			if(!brick[i].crash)
				drawRect(brick[i])
		// }
	}
}

function drawPapan(){
	is_collision(papan,ball,function(){



		if((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x < panjangPapan/2){
			kemiringan = ((panjangPapan/2)-((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x))*0.2
			console.log(kemiringan)
		}else if((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x > panjangPapan/2){
			kemiringan = ((panjangPapan/2)-((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x))*0.2
			console.log(kemiringan)
		}else if((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x == panjangPapan/2){
			kemiringan = (((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x)-(panjangPapan/2))*0.2
			console.log(kemiringan)
		}

		fallInLove = false
		return
	})
	drawRect(papan)
}

function drawBall(){
	if(fallInLove){
		// ball.y += gravity
		// atur kemiringan
		ball.x += kemiringan
	}else if(!(fallInLove)){
		// ball.y -= gravity
		// atur kemiringan 
		ball.x += kemiringan
	}


	if(ball.y < bAtas+((ball.width/2)+gravity)){
		fallInLove = true
	}
	if(ball.y > bBawah+20){
		lives -= 1
		ball.y = bBawah/2
		kemiringan = 0
	}
	if(ball.x < bKiri+(ball.width)){
		kemiringan = -(kemiringan)
	}
	if(ball.x > bKanan-(ball.width)){
		kemiringan = -(kemiringan)
	}
	drawCircle(ball)
}

function board(){
	livesshow.innerHTML = lives
	scoreshow.innerHTML = score
	if(lives < 1){
		title.innerHTML = 'You Lose'
		bannerUlangi.style.display = 'block'
		clearInterval(app)
	} else if(score > gamePoint){
		title.innerHTML = 'You Win'
		bannerUlangi.style.display = 'block'
		clearInterval(app)
	}
}


function leveling(){
	if(score >= 5 && !level1){
		level1 = true
		levelUp = true
	}
	if(score >= 10 && !level2){
		level2 = true
		levelUp = true
	}
	if(score >= 15 && !level3){
		level3 = true
		levelUp = true
	}
	levelUP()
}


$(document).on('keydown',(key) => {
	switch(key.code){
		case 'ArrowLeft':
			if(papan.x > bKiri){
				papan.x -= speedPapan
			}
			break;
		case 'ArrowRight':
			if(papan.x < bKanan-(papan.width)){
				papan.x += speedPapan
			}
			break;
		default:
			break;
	}
})

desc.innerHTML = desc.innerHTML.replace('pointInView',gamePoint);


$('#btnMulai').on('click',() => {
	bannerMulai.style.display = 'none'
	initComp()
	init()
})
$('#btnUlangi').on('click',() => {
	bannerUlangi.style.display = 'none'
	initComp()
	init()
})
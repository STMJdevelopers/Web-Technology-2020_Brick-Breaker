/**
 * Inisialisasi Variable
 */
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
	papan = {},
	panjangPapan = 40,
	speedPapan = 10,
	ball = {},
	score = 0,
	gamePoint = 20,
	level1 = false,
	level2 = false,
	level3 = false,
	levelUp = false,
	gravity = 5,
	bolaJatuh = true,
	kemiringan = 0,
	lives = 0;

/**
 * Inisialisasi function simple jquery
 * untuk mempercantik codingan >_0
 */
function $(node){
	let res = {}
	switch(typeof(node)){
		case 'object':
			res = {
				on: (event,callback) => {
					node.addEventListener(event, callback, false);
				}
			}
			break;
		case 'string':
			res = {
				on: (event,callback) => {
					document.querySelector(node).addEventListener(event, callback, false);
				}
			}
			break;
		default:
			break;
	}
	return res;
}


/**
 * Function untuk menggambar brick
 */
function drawRect(obj){
	ctx.fillStyle = obj.color;
	ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}


/**
 * Function untuk menggambar bola
 */
function drawCircle(obj){
	ctx.beginPath();
	ctx.fillStyle = obj.color;
	ctx.arc(obj.x, obj.y, obj.width, 0,2*Math.PI);
	ctx.fill();
}


/**
 * Ketika terjadi tabrakan
 */
function is_collision(obj1,obj2,callback,statement2=null){
	if( (obj1.x-(obj1.width/8) < obj2.x+(obj2.width/2) && obj1.x+(obj1.width+(obj1.width/4)) > obj2.x+(obj2.width/2)) &&
		 (obj1.y-(obj1.height*2) < obj2.y+(obj2.width/2) && obj1.y+(obj1.height*2) > obj2.y+(obj2.width/2)) ){
		callback();
	}
	if(statement2 != null){
		statement2();
	}
}



/**
 * Generate warna random
 */
function genColor(){
	let colors = ["red","yellow","green"];
	let counting = Math.floor(Math.random() *1000000); // if *multiple less than 1000, it will given error : counting have a opportunite zero num
	let numNow = 0;
	let tempColor = "";

	for(let colorsIter = 0;colorsIter < counting;colorsIter++){
		tempColor = colors[numNow];
		numNow++;
		if(numNow > colors.length-1){
			numNow = 0;
		}
	}
	return tempColor;
}



/**
 * Inisialisasi Komponen Game
 */
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
	};
	papan = {
		x: (bKanan/2)-(panjangPapan/2),
		y: bBawah,
		width: panjangPapan,
		height: 2,
		color: 'yellow' //warna bola
	};
	for(let brickIter1=0;brickIter1<3;brickIter1++){
		let tempBrick = [];
		for(let brickIter2=0;brickIter2<7;brickIter2++){
			let color = genColor();
			if(color == 'red'){
				tempBrick[brickIter2] = {
					x: (brickIter2*43)+1,
					y: (brickIter1*10),
					width: 40,
					height: 9,
					color: color,
					brickDestroyHit: 1,
					brickScore: 1,
					crash: false
				};
			}else if(color == 'yellow'){
				tempBrick[brickIter2] = {
					x: (brickIter2*43)+1,
					y: (brickIter1*10),
					width: 40,
					height: 9,
					color: color,
					brickDestroyHit: 2,
					brickScore: 2,
					crash: false
				};
			}else if(color == 'green'){
				tempBrick[brickIter2] = {
					x: (brickIter2*43)+1,
					y: (brickIter1*10),
					width: 40,
					height: 9,
					color: color,
					brickDestroyHit: 3,
					brickScore: 3,
					crash: false
				};
			}
		}
		brick[brickIter1] = tempBrick;
	}
	score = 0;
	lives = 3;
}

/**
 * Tabrakan
 */
function crashed(){
	for(let i=0;i<brick.length;i++){
		for(let j=0;j<brick[i].length;j++){
			if(!brick[i][j].crash){
				is_collision(brick[i][j],ball,() => {
					brick[i][j].brickDestroyHit -= 1;
					bolaJatuh = true;
					if(brick[i][j].brickDestroyHit == 0){
						score += brick[i][j].brickScore;
						brick[i][j].crash = true;
					}
				})
			}
		}
	}
}


/**
 * Menggambar balok
 */
function drawBrick(){
	for(let i=0;i<brick.length;i++){
		for(let j = 0; j < brick[i].length;j++){
			if(!brick[i][j].crash)
				drawRect(brick[i][j]);
		}
	}
}


/**
 * Menggambar papan
 */
function drawPapan(){
	is_collision(papan,ball,function(){
		if((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x < panjangPapan/2){
			kemiringan = ((panjangPapan/2)-((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x))*0.2;
		}else if((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x > panjangPapan/2){
			kemiringan = ((panjangPapan/2)-((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x))*0.2;
		}else if((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x == panjangPapan/2){
			kemiringan = (((papan.x+(papan.width/2))+(panjangPapan/2)-ball.x)-(panjangPapan/2))*0.2;
		}
		bolaJatuh = false;
		return;
	});
	drawRect(papan);
}


/**
 * Menggambar bola
 */
function drawBall(){
	/**
	 * Atur gravitasi & sudut kemiringan bola
	 */
	if(bolaJatuh){
		ball.y += gravity;
		ball.x += kemiringan;
	}else if(!(bolaJatuh)){
		ball.y -= gravity-0.5; // megatur kecepatan naik lebih lambat dari pada turun
		ball.x += kemiringan;
	}

	if(ball.y < bAtas+(ball.width/2)+gravity){
		bolaJatuh = true;
	}
	if(ball.y > bBawah+20){
		lives -= 1;
		ball.y = bBawah/2;
		kemiringan = 0;
	}
	if(ball.x < bKiri+(ball.width)){
		kemiringan = -(kemiringan);
	}
	if(ball.x > bKanan-(ball.width)){
		kemiringan = -(kemiringan);
	}
	drawCircle(ball);
}


/**
 * Memperbaharui papan nyawa & nilai
 */
function board(){
	livesshow.innerHTML = lives;
	scoreshow.innerHTML = score;
	if(lives < 1){
		title.innerHTML = 'You Lose';
		bannerUlangi.style.display = 'block';
		clearInterval(app);
	} else if(score > gamePoint){
		title.innerHTML = 'You Win';
		bannerUlangi.style.display = 'block';
		clearInterval(app);
	}
}



/**
 * Menaikan level permainan
 */
function levelUP(){
	if(levelUp){
		gravity += .5;
		levelUp = false;
	}
}

/**
 * Menaikkan level
 * berdasar score yang didapat
 */
function leveling(){
	if(score >= 5 && !level1){
		level1 = true;
		levelUp = true;
	}
	if(score >= 10 && !level2){
		level2 = true;
		levelUp = true;
	}
	if(score >= 15 && !level3){
		level3 = true;
		levelUp = true;
	}
	levelUP();
}


/**
 * Aksi keyboard
 */
$(document).on('keydown',(key) => {
	switch(key.code){
		case 'ArrowLeft':
			if(papan.x > bKiri){
				papan.x -= speedPapan;
			}
			break;
		case 'ArrowRight':
			if(papan.x < bKanan-(papan.width)){
				papan.x += speedPapan;
			}
			break;
		default:
			break;
	}
});



/**
 * Menggambungkan semua function
 */
function draw(){
	ctx.clearRect(0,0,
		c.width, c.height);
	drawBall();
	drawPapan();
	drawBrick();
	crashed();
	board();
	leveling();
}


/**
 * set interval
 */
function init(){
	app = setInterval(() => {
		draw();
	},50);
}

desc.innerHTML = desc.innerHTML.replace('pointInView',gamePoint);

$('#btnMulai').on('click',() => {
	bannerMulai.style.display = 'none';
	initComp();
	init();
});
$('#btnUlangi').on('click',() => {
	bannerUlangi.style.display = 'none';
	initComp();
	init();
});
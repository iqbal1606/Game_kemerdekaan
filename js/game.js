setGame("1200x600");
game.folder = "assets";
//file gambar yang dipakai dalam game
var gambar = {
	startBtn:"tombolStart.png",
	intro:"HalamanKedua.png",
	cover:"HalamanAwal.png",
	playBtn:"btn-play.png",
	maxBtn:"maxBtn.png",
	minBtn:"minBtn.png",
	idle:"pejuang.png",
	run:"pejuang.png",
	jump:"pejuang.png",
	fall:"pejuang.png",
	hit:"pejuang.png",
	tileset:"terrain.png",
	bg:"awan.png",
	item1:"Strawberry.png",
	item2:"Kiwi.png",
	musuh1Idle:"musuh.png",
	musuh1Run:"musuh2.png",
	musuh1Hit:"musuh3.png",
	bendera:"bendera.png"
}
//file suara yang dipakai dalam game
var suara = {
	kemerdekaan : "kemerdekaan.mp3",
	lompat : "jump.mp3",
	jatuh : "dead.mp3"
	
}

//load gambar dan suara lalu jalankan startScreen
loading(gambar, suara, startScreen);

function startScreen(){	
	hapusLayar("#67d2d6");
	gambarFull(dataGambar.intro);
	var startBtn = tombol(dataGambar.startBtn, 600, 340);
	if (tekan(startBtn)){
		jalankan(halamanCover);
	}
}
function halamanCover(){
	hapusLayar("#9c9695");
	gambarFull(dataGambar.cover);
	musik(dataSuara.kemerdekaan, 50);
	var playBtn = tombol(dataGambar.playBtn, 1100, 500);
	if (tekan(playBtn) || game.spasi){
		if (game.aktif) {
			//mulai game dengan menambahkan transisi
			game.status = "mulai";
			game.s= "Score :";
			game.l= "Level :";
			game.level = 1;
			game.score = 0;
			game.warnaTransisi = "#8f8f8f";
			transisi("out", setAwal);
		}
	}	
	resizeBtn(1150,50);
	efekTransisi();
}

function setAwal() {
	game.aktif = true;
	game.hero = setSprite(dataGambar.idle, 32, 32);
	game.hero.animDiam = dataGambar.idle;
	game.hero.animJalan = dataGambar.run;
	game.hero.animLompat = dataGambar.jump;
	game.hero.animJatuh = dataGambar.fall;
	game.hero.animMati = dataGambar.hit;
	game.skalaSprite = 2;
	game.dataPeluru = [];
	//setPlatform(map_1, dataGambar.tileset, 32, game.hero);
	setPlatform(this["map_" + game.level], dataGambar.tileset, 32, game.hero);
	game.gameOver = ulangiPermainan;
	//set item
	setPlatformItem(1, dataGambar.item1);
	setPlatformItem(2, dataGambar.item2);
	//set musuh
	var musuh1 = {}
	musuh1.animDiam = dataGambar.musuh1Idle;
	musuh1.animJalan = dataGambar.musuh1Run;
	musuh1.animMati = dataGambar.musuh1Hit;
	setPlatformEnemy(1, musuh1);
	//set trigger
	setPlatformTrigger(1, dataGambar.bendera);
	if (game.status == "mulai") {
		game.status = "main";
		mulaiPermainan();
	}
}

function mulaiPermainan(){
	jalankan(gameLoop);
	transisi("in");
}

function ulangiPermainan(){	
	setAwal();	
	game.aktif = true;
	jalankan(gameLoop);
}


function gameLoop(){
	hapusLayar("#9c9695");
	if (game.kanan){
		gerakLevel(game.hero, 3, 0);
	}else if (game.kiri){				
		gerakLevel(game.hero, -3, 0);
	}
	if (game.atas){
		mainkanSuara(dataSuara.lompat, 60);
		gerakLevel(game.hero, 0, -10);
	
	}

	latar(dataGambar.bg, -0.5,0);
	buatLevel();
	cekItem();
	teks(game.s, 40, 100, "Calibri-bold-20pt-left-biru");
	teks(game.level, 150, 60,  "Calibri-bold-20pt-left-merah");
	teks(game.l, 40, 60,  "Calibri-bold-20pt-left-merah");
	teks(game.score, 150, 100, "Calibri-bold-20pt-left-biru");

	efekTransisi();
}

function tembak(ob, kec) {
	if (ob.waktuTembak == undefined || ob.waktuTembak == 0) {
		ob.waktuTembak = 10;
		//tentukan jenis peluru
		var peluru;
		if (ob == game.hero) {
			peluru = setSprite(dataGambar.peluru1);
		} else {
			peluru = setSprite(dataGambar.peluru2);
		}
		peluru.x = ob.x;
		peluru.y = ob.y;
		peluru.kec = kec;
		peluru.cek = 0;
		peluru.aktif = true;
		peluru.pemilik = ob;
		game.dataPeluru.push(peluru);
	}
}

function aturPeluru() {
	if (game.hero.waktuTembak > 0) game.hero.waktuTembak--;
	for (var i = 0; i < game.dataPeluru.length; i++) {
		var peluru = game.dataPeluru[i];
		peluru.y += peluru.kec;
		sprite(peluru);
		if (peluru.x < 0 || peluru.x > game.lebar || peluru.y < 0
			|| peluru.y > game.tinggi || !peluru.aktif) {
			game.dataPeluru.splice(i, 1);
		}
	}
}

function cekItem(){
	if (game.itemID > 0){
		tambahScore(10*game.itemID);
		game.itemID = 0;
	}

	if (game.hero.animMati != 0){
		mainkanSuara(dataSuara.jatuh);
		tambahScore(-10);
		game.hero.animMati = 0;
			
	}
	
	

	if (game.musuhID != 0){
		// mainkanSuara(dataSuara.jatuh);
		tambahScore(25);
		game.musuhID = 0;
		tembak(musuhID, 10);
	}
	if (game.triggerID == 1){
		game.triggerID = 0;
		game.aktif = false;
		transisi("out", naikLevel);		
	}
}

function naikLevel(){
	game.level++;
	if (game.level>=3){
		transisi("in");
		jalankan(halamanCover);
	}else{
		game.status = "mulai";
		setAwal();
	}
}
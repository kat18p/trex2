var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var obstacleGroup;
var gameOver, restart, gameoverImage, restartImage;
var jumpSound, dieSound, checkPointSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

}

function setup() {
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;

  ground = createSprite(200, height-15, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameover = createSprite(width/2,height/2);
  gameover.addImage("gm",gameoverImage);

  restart = createSprite(width/2,(height/2) - 60);
  restart.addImage("reset",restartImage);

  gameover.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(width/2, height-10, width, 10);
  invisibleGround.visible = false;

  score = 0;

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false

  obstacleGroup = new Group();
  cloudsGroup = new Group();

}

function draw() {
  background(180);
  textSize(40)
  text("Pontuação: " + score, (width/2)-100, 50);
console.log(trex.y)
  if (gamestate === PLAY) {

    gameover.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score/100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if(score > 0 && score % 100 == 0){
      checkPointSound.play();
    }

    score = score + Math.round(getFrameRate()/60);

      if ((touches.length > 0 || keyDown("space")) && trex.y >= height-70) {
          trex.velocityY = -10;
          jumpSound.play();
          touches = [];
        }

        trex.velocityY = trex.velocityY + 0.8
          //gerar as nuvens
          spawnClouds();
          //gerar obstaculos
          spawnObstacles();

    if(obstacleGroup.isTouching(trex)){
      gamestate = END;
      dieSound.play();
    // trex.velocityY = -12;
    // jumpSound.play();
    }

  } else if (gamestate === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;

    gameover.visible = true;
    restart.visible = true;

    trex.changeAnimation("colid",trex_collided);

    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)){
      reset()
    }

  }

  trex.collide(invisibleGround);


  drawSprites();
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(width, 100, 40, 10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10, height-100))
    cloud.scale = 0.4;
    cloud.velocityX = -3;

    //tempo de vida = distancia/velocidade
    cloud.lifetime = width/3;



    //ajuste a profundidade
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}
function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, height-30, 10, 40);
    obstacle.velocityX = -(6 + score/100);

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1)
        break;
      case 2:
        obstacle.addImage(obstacle2)
        break;
      case 3:
        obstacle.addImage(obstacle3)
        break;
      case 4:
        obstacle.addImage(obstacle4)
        break;
      case 5:
        obstacle.addImage(obstacle5)
        break;
      case 6:
        obstacle.addImage(obstacle6)
        break;
      default: break;
    }

    obstacleGroup.add(obstacle);
    obstacle.lifetime = 300;
    obstacle.scale = 0.5;

  }
}
function reset(){
  gamestate = PLAY;
  gameover.visible = false;
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}

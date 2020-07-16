//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, ground, groundImage, invisibleGround, ObstaclesGroup, CloudsGroup, Obstacles_Image = [],
  Cloud_Image, count = 0,
  gameOver, restart, gameOver_Image, restart_Image, hiscore = 0,
  checkPOint, jump, die;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collied = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");
  for (i = 0; i < 5; i++) {
    Obstacles_Image[i] = loadImage(`obstacle${i + 1}.png`);
  }

  Cloud_Image = loadImage('cloud.png');

  gameOver_Image = loadImage('gameOver.png');

  restart_Image = loadImage('restart.png');

  checkPoint = loadSound('checkPoint.mp3');
  die = loadSound('die.mp3');
  jump = loadSound('jump.mp3');
}

function setup() {
  createCanvas(600, 400);
  //making the trex
  trex = createSprite(50, 380, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.velocityY = 0.8;
  trex.setCollider("circle", 0, 0, 30);

  gameOver = createSprite(width/2, 300);
  gameOver.addAnimation("gameOver", gameOver_Image);
  gameOver.scale = 0.5;

  restart = createSprite(width/2, -10);
  restart.addAnimation("restart", restart_Image);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  //making the ground
  ground = createSprite(200, 380, 400, 20);
  ground.addAnimation("ground", groundImage);

  //making an invisible ground
  invisibleGround = createSprite(200, 385, 400, 5);
  invisibleGround.visible = false;

  ObstaclesGroup = createGroup();

  CloudsGroup = createGroup();

  //set text
  textSize(18);
  textFont("Georgia");
  textStyle(BOLD);
}

function draw() {
  background(255);

  //display score
  text("Score: " + count, 250, 100);
  text("HI: " + hiscore, 180, 100);

  if (gameState == PLAY) {
    trex.velocityY += 0.8;

    ground.velocityX = -(6 + 3 * count / 100);

    //scoring
    count += Math.round(getFrameRate() / 40);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if ((keyWentDown("Space") || keyWentDown("up")) && trex.y >= 359) {
      trex.velocityY = -12;
      jump.play();
    }

    if (count % 100 == 0&&count>0) {
      checkPoint.play();
    }
    //spawn the clouds
    spawnClouds();

    //spawn obstacles
    spawnObstacles();

    if (ObstaclesGroup.isTouching(trex)) {
      gameState = END;
      die.play();
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);

    restart.y = 325;

    //change the trex animation
    trex.addAnimation("collided", trex_collied);

    trex.changeAnimation("collided");

    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
  }

  if (mousePressedOver(restart)) {
    reset();
  }

  trex.collide(invisibleGround);
  drawSprites();
}

function reset() {
  gameOver.visible = false;
  restart.visible = false;
  restart.y = -10;

  gameState = PLAY;

  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();

  trex.changeAnimation("running");

  if (count > hiscore) {
    hiscore = count;
  }

  count = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, 365, 10, 40);
    obstacle.velocityX = -(6 + 3 * count / 100);

    var rand = floor(random(5));

    switch (rand) {
      case 0:
        obstacle.addImage(Obstacles_Image[0]);
        break;
      case 1:
        obstacle.addImage(Obstacles_Image[1]);
        break;
      case 2:
        obstacle.addImage(Obstacles_Image[2]);
        break;
      case 3:
        obstacle.addImage(Obstacles_Image[3]);
        break;
      case 4:
        obstacle.addImage(Obstacles_Image[4]);
        break;
      case 5:
        obstacle.addImage(Obstacles_Image[5]);
        break;

    }
    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = width / abs(obstacle.velocityX);

    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);

    //adjust the depth
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width, 320, 40, 10);
    cloud.y = floor(random(280, 320));
    cloud.addAnimation("cloud", Cloud_Image);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = width / abs(cloud.velocityX);

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    CloudsGroup.add(cloud);
  }

}
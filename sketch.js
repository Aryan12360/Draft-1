const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Constraint = Matter.Constraint;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine, world;

var ground, rope, melon, melonImg, connect, cutBtn;;
var sceneImg, rabbit, rabbitImg;

var blinkAnimation, eatAnimation, sadAnimation;
var BM, RC, ES, SS;

function preload() {
  sceneImg = loadImage("assets/background.png");
  melonImg = loadImage("assets/melon.png");
  rabbitImg = loadImage("assets/Rabbit-01.png");

  blinkAnimation = loadAnimation("assets/blink_1.png", "assets/blink_2.png", "assets/blink_3.png");
  eatAnimation = loadAnimation("assets/eat_0.png", "assets/eat_1.png", "assets/eat_2.png", "assets/eat_3.png", "assets/eat_4.png");
  sadAnimation = loadAnimation("assets/sad_1.png", "assets/sad_2.png", "assets/sad_3.png");

  blinkAnimation.playing = true;
  eatAnimation.playing = true;
  sadAnimation.playing = true;

  eatAnimation.looping = false;
  sadAnimation.looping = false;

  BM = loadSound("assets/sound1.mp3");
  RC = loadSound("assets/rope_cut.mp3");
  ES = loadSound("assets/eating_sound.mp3");
  SS = loadSound("assets/sad.mp3");
}

function setup() {
  createCanvas(600, 700);

  engine = Engine.create();
  world = engine.world;

  BM.play();
  BM.setVolume(0.1);

  ground = new Ground(300, 700, 600, 20);
  rope = new Rope(7, {
    x: 300,
    y: 10
  });

  melon = Bodies.circle(300, 10, 20);
  Composite.add(rope.body, melon);

  connect = new Link(rope, melon);

  blinkAnimation.frameDelay = 10;
  eatAnimation.frameDelay = 10;
  sadAnimation.frameDelay = 10;

  rabbit = createSprite(300, 600, 50, 50);
  rabbit.addAnimation("blink", blinkAnimation);
  rabbit.addAnimation("eat", eatAnimation);
  rabbit.addAnimation("sad", sadAnimation);
  rabbit.changeAnimation("blink");
  rabbit.scale = 0.25;

  cutBtn = createImg("assets/cut_btn.png");
  cutBtn.size(80, 80);
  cutBtn.position(260, 3);
  cutBtn.mouseClicked(drop);


  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  background(sceneImg);
  Engine.update(engine);

  push();
  imageMode(CENTER);
  if (melon != null) {
    image(melonImg, melon.position.x, melon.position.y, 70, 70);
  }
  pop();

  push();
  if (collide(melon, rabbit) == true) {
    rabbit.changeAnimation("eat");
    ES.play();
    swal({
      title: `YOU WIN`,
      text: `WELL DONE`,
      imageUrl: `https://www.freepnglogos.com/uploads/trophy-png/trophy-award-winner-png-33.png`,
      imageSize: `150x150`,
      confirmButtonText: `Play Again`
    }, (isConfirm) => {
      if (isConfirm) {
        location.reload();
      }
    });
  }
  pop();

  push();
  if (melon != null && melon.position.y >= 650) {
    rabbit.changeAnimation("sad");
    SS.play();  
    melon = null;
    swal({
      title: `GAME OVER`,
      text: `YOU SNOOZE, YOU LOSE`,
      imageUrl: `https://cdn-icons-png.flaticon.com/512/4099/4099871.png`,
      imageSize: `200x200`,
      confirmButtonText: `Play Again`
    }, (isConfirm) => {
      if (isConfirm) {
        location.reload();
      }
    });
  }
  pop();

  rope.show();
  drawSprites();
}

function drop() {
  connect.cut();
  rope.break();
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);

    if (d <= 80) {
      World.remove(world, melon);
      melon = null;
      return true;
    } else {
      return false;
    }
  }
}
var lightBlue;
var darkMain;

var rooms = [];
var spaciousRooms = [];
var selectedRoom;
var nRooms = 20;

var s = 40;
var wallThickness;

var playerOne;

var dWall = 0;

var start = true;

var camY = 0;
var camX = 0;

var targetCamX = 0;
var targetCamY = 0;

var droid;

var leftStatus = true;
var rightStatus = true;
var upStatus = true;
var downStatus = true;
var resetStatus = true;

var controlStatus = null;

var zoomLevel = 9;

var movePosition;
var moveTarget;

var leftButton;
var rightButton;
var upButton;
var downButton;

var resetButton;

var hammer;

function preload() {
  droid = loadFont("assets/DroidSans-Regular.ttf");
  resetInfo();
}

function setup() {
  movePosition = createVector(0, 0);
  noStroke();
  colorMode(HSB);
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  resetColors();
  resetRooms();

  leftButton = select("#leftButton");
  rightButton = select("#rightButton");
  upButton = select("#upButton");
  downButton = select("#downButton");

	  var options = {
    preventDefault: true
		};
	
	resetButton = select("#resetButton");
	hammer = new Hammer(document.body, options);
	 hammer.get('swipe').set({
    direction: Hammer.DIRECTION_ALL
  });

  hammer.on("swipe", swiped);

}

function resetColors () {
	darkMain = color(30, 200, 80);
  lightMain = color(
    255 - hue(darkMain),
    255 - saturation(darkMain),
    brightness(darkMain + 10)
	);
}

function resetInfo() {
  controlStatus = {
    leftStatus: { TEXT: "LEFT = LEFT ARROW KEY", POS: createVector(0, 0) },
    rightStatus: { TEXT: "RIGHT = RIGHT ARROW KEY", POS: createVector(0, 0) },
    upStatus: { TEXT: "UP = UP ARROW KEY", POS: createVector(0, 0) },
    downStatus: { TEXT: "DOWN = DOWN ARROW KEY", POS: createVector(0, 0) },
    resetStatus: { TEXT: "RESET = R", POS: createVector(0, 0) },
    infoStatus: { TEXT: "INFO = I", POS: createVector(0, 0) },
  };
}

function resetRooms() {
  let j = -1;

  for (let i = 0; i < sq(nRooms); i++) {
    j += i % nRooms == 0;
    let a = i;
    a = a % nRooms;
    rooms.push(new Room(createVector(a, j), i));
	}
	
	rooms.forEach((room) => room.neighbourCheck());
  rooms.forEach((room) => room.roomScoreCheck());

	spaciousRooms = rooms.filter(room => room.wallCount === 0);
	spaciousRooms.sort((a, b) => 
		a.roomScore - b.roomScore
	);

	console.log({ spaciousRooms });

	selectedRoom = spaciousRooms[0];
	console.log({selectedRoom});

	playerOne = new Player(selectedRoom.pos, selectedRoom.i);
	console.log({playerOne});
}

function smallestOf(a, b) {
  return a < b ? a : b;
}

function draw() {
  background(darkMain);

  drawGUI();

  drawLargeMap(smallestOf(width, height) / zoomLevel);
  drawMiniMap(smallestOf(width, height)/50);

  push();
  translate(width / 20, s / 3 + 10);
  // drawControls();
  drawItems(width / 20);
  pop();

  // drawGuides();
  noStroke();
  noFill();
}

function drawGUI() {
  disableButtons();
  handleButtonPresses();
}

function disableButtons() {
  let walls = rooms[playerOne.i].walls;

  disableButton(leftButton, walls.LEFT);
  disableButton(rightButton, walls.RIGHT);
  disableButton(upButton, walls.TOP);
  disableButton(downButton, walls.BOTTOM);

  function disableButton(button, value) {
		value ? button.attribute('disabled', '') : button.removeAttribute('disabled');
		button.style('background-color', value ? darkMain : lightMain);
  }
  
}

function handleButtonPresses() {
  leftButton.mousePressed(() => moveLeft());
  rightButton.mousePressed(() => moveRight());
  upButton.mousePressed(() => moveUp());
  downButton.mousePressed(() => moveDown());

  resetButton.mousePressed(() => resetGame());
}

function handleSwipes () {
}

function swiped(event) {
  console.log(event);
  if (event.direction == 4) {
		moveRight();
  } else if (event.direction == 8) {
    moveUp();
  } else if (event.direction == 16) {
    moveDown();
  } else if (event.direction == 2) {
		moveLeft();
  }
}

function drawLargeMap(s) {
  push();
  moveTarget = createVector(-playerOne.pos.x * s, -playerOne.pos.y * s);
  movePosition = p5.Vector.lerp(movePosition, moveTarget, 0.1);
  translate(movePosition.x, movePosition.y);
  translate(width / 2, height / 2);
  rooms.forEach((room) => room.showFloor(s));
  rooms.forEach((room) => room.showWalls(s));
  playerOne.show(s);
  playerOne.show(s);
  pop();
}

function drawMiniMap(s) {
  push();
  fill(255, 0.1);
  rect(width, 0, (nRooms + 4) * s * 2, (nRooms + 4) * s * 2, 10);
  translate(width - (nRooms + 1) * s - s / 2, s * 2);
  // rooms.forEach((room) => room.showFloor(s));
  rooms.forEach((room) => room.showWalls(s));
  playerOne.show(s);
  pop();
}

function drawGuides() {
  stroke("pink");
  noFill();
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  line(0, 10, width, 10);
  line(0, height - 10, width, height - 10);

  line(10, 0, 10, height);
  line(width - 10, 0, width - 10, height);

  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}

function keyTyped() {
  if (key === "r") {
    resetGame();
  }
}

function moveLeft() {
  controlStatus["leftStatus"] && delete controlStatus["leftStatus"];
  resetColors();
  targetCamX = 30;
  targetCamY = 0;
  playerOne.move("left");
}

function moveRight() {
  controlStatus["rightStatus"] && delete controlStatus["rightStatus"];
  resetColors();
  targetCamX = -30;
  targetCamY = 0;
  playerOne.move("right");
}

function moveUp() {
  controlStatus["upStatus"] && delete controlStatus["upStatus"];
  resetColors();
  targetCamY = 30;
  targetCamX = 0;
  playerOne.move("up");
}

function moveDown() {
  resetColors();
  targetCamY = -30;
  targetCamX = 0;
  playerOne.move("down");
}

function resetGame() {
  controlStatus["resetStatus"] && delete controlStatus["resetStatus"];
  rooms = [];
  playerOne = null;
  resetRooms();
  targetCamX = 0;
  targetCamY = 0;
}

function keyPressed() {
  keyCode === LEFT_ARROW && moveLeft();
  keyCode === RIGHT_ARROW && moveRight();
  keyCode === UP_ARROW && moveUp();
  keyCode === DOWN_ARROW && moveDown();
}

function drawItems(_size) {
  playerOne.itemList.forEach((item, index) => {
    fill("limegreen");
    circle(index * _size, 0, _size / 2);
  });
}

function touchMoved() {
  // do some stuff
  return false;
}

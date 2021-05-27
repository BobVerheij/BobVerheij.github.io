class Room {
  constructor(_pos, _i) {
    this.i = _i;
    this.pos = _pos;
    this.walls = [];

    this.walls = {
      LEFT: random(0, 255) < 100 || this.pos.x === 0,
      RIGHT: random(0, 255) < 100 || this.pos.x === nRooms - 1,
      BOTTOM: random(0, 255) < 100 || this.pos.y === nRooms - 1,
      TOP: random(0, 255) < 100 || this.pos.y === 0,
    };

    this.covered = false;
    this.visited = false;
    this.trace = 255;

    noiseSeed();

    this.roomNoise = map(
      noise(this.pos.x / 10, this.pos.y / 10),
      0,
      1,
      -50,
      50
    );

    this.noiseColor = color(
      hue(lightMain),
      saturation(lightMain) * 0.8,
      brightness(lightMain) + this.roomNoise
    );
  }

  neighbourCheck() {
    if (this.i > nRooms - 1) {
      this.walls.TOP = rooms[this.i - nRooms].walls.BOTTOM;
    }

    if (this.i < nRooms * (nRooms - 1)) {
      this.walls.BOTTOM = rooms[this.i + nRooms].walls.TOP;
    }

    if (this.pos.x > 0) {
      this.walls.LEFT = rooms[this.i - 1].walls.RIGHT;
    }

    if (this.pos.x < nRooms - 1) {
      this.walls.RIGHT = rooms[this.i + 1].walls.LEFT;
    }

    this.wallCount =
      this.walls.LEFT + this.walls.RIGHT + this.walls.BOTTOM + this.walls.TOP;

    this.covered =
      this.walls.LEFT +
        this.walls.RIGHT +
        this.walls.BOTTOM +
        this.walls.TOP ===
      4;

    this.determineItem();
  }

  roomScoreCheck() {
    this.roomScore = this.wallCount;

    this.roomScore +=
      this.i > nRooms - 1 ? rooms[this.i - nRooms].wallCount : 2.5;

    this.roomScore +=
      this.i < nRooms * (nRooms - 1) ? rooms[this.i + nRooms].wallCount : 2.5;

    this.roomScore += this.pos.x > 0 ? rooms[this.i - 1].wallCount : 2.5;

    this.roomScore +=
      this.pos.x < nRooms - 1 ? rooms[this.i + 1].wallCount : 2.5;
  }

  roomFinalScoreCheck() {
    this.roomFinalScore = this.roomScore;

    this.roomFinalScore +=
      this.i > nRooms - 1 ? rooms[this.i - nRooms].roomScore : 12;

    this.roomFinalScore +=
      this.i < nRooms * (nRooms - 1) ? rooms[this.i + nRooms].roomScore : 12;

    this.roomFinalScore += this.pos.x > 0 ? rooms[this.i - 1].roomScore : 12;

    this.roomFinalScore +=
      this.pos.x < nRooms - 1 ? rooms[this.i + 1].roomScore : 12;
  }

  showFloor(s) {
    let d = map(this.roomFinalScore, 0, 324, 0, 200) + this.wallCount * 10;
    this.n = color(
      hue(this.noiseColor),
      saturation(this.noiseColor),
      brightness(this.noiseColor) - d
    );

    this.trace = lerpColor(color(this.trace), this.n, 255 / 1000);

    floorPlan.fill(this.wallCount === 4 ? darkMain : this.n);

    floorPlan.rect(this.pos.x * s, this.pos.y * s, s);
    this.visited && floorPlan.fill(this.trace);
    this.visited && floorPlan.circle(this.pos.x * s, this.pos.y * s, s / 3);
  }

  showWalls(s) {
    wallPlan.fill(darkMain);
    this.walls.RIGHT && this.drawRightWall(s);
    this.walls.LEFT && this.drawLeftWall(s);
    this.walls.BOTTOM && this.drawBottomWall(s);
    this.walls.TOP && this.drawTopWall(s);
  }

  determineItem() {
    this.corner = this.wallCount === 3;
    this.oneWall = this.wallCount === 1;
    this.twoWall = this.wallCount === 2;
    this.noWall = this.wallCount === 0;

    this.fieldItem = this.oneWall && floor(this.roomNoise) % 8 === 0;
    this.cornerItem = this.corner && floor(this.roomNoise) % 3 === 0;

    let totalItem = this.fieldItem + this.cornerItem;
    totalItem && allItems.push(new Item(this.pos));
  }

  drawLeftWall(s) {
    wallPlan.rect(
      this.pos.x * s - s / 2,
      this.pos.y * s,
      s / 8,
      s + s / 8,
      1000
    );
  }

  drawRightWall(s) {
    wallPlan.rect(
      this.pos.x * s + s / 2,
      this.pos.y * s,
      s / 8,
      s + s / 8,
      1000
    );
  }

  drawTopWall(s) {
    wallPlan.rect(
      this.pos.x * s,
      this.pos.y * s - s / 2,
      s + s / 8,
      s / 8,
      1000
    );
  }

  drawBottomWall(s) {
    wallPlan.rect(
      this.pos.x * s,
      this.pos.y * s + s / 2,
      s + s / 8,
      s / 8,
      1000
    );
  }
}

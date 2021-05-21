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
    this.n = color(
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

    this.hasItem = this.determineItem();
  }

  showFloor(s) {
    // fill(darkMain);
    // text(this.pos.x + ", " + this.pos.y, this.pos.x * s, this.pos.y * s);

    this.trace = lerpColor(color(this.trace), this.n, 255 / 1000);

    this.covered ? fill(darkMain) : fill(this.n);

    rect(this.pos.x * s, this.pos.y * s, s);
    this.visited && fill(this.trace);
    this.visited && circle(this.pos.x * s, this.pos.y * s, s / 3);
    fill("limegreen");

    if ((playerOne.i === this.i || this.visited) && this.hasItem) {
      playerOne.itemList.push("");
      this.hasItem = false;
    }

    this.hasItem && this.drawItem(s);
  }

  showWalls(s) {
    fill(darkMain);
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

    return this.fieldItem + this.cornerItem;
  }

  drawItem(s) {
    circle(this.pos.x * s, this.pos.y * s, s / 3);
  }

  drawLeftWall(s) {
    rect(this.pos.x * s - s / 2, this.pos.y * s, s / 8, s + s / 8, 1000);
  }

  drawRightWall(s) {
    rect(
      this.pos.x * s + s / 2,
      this.pos.y * s,
      s / 8,
      s + s / 8,
      1000
    );
  }

  drawTopWall(s) {
    rect(
      this.pos.x * s,
      this.pos.y * s - s / 2,
      s + s / 8,
      s / 8,
      1000
    );
  }

  drawBottomWall(s) {
    rect(
      this.pos.x * s,
      this.pos.y * s + s / 2,
      s + s / 8,
      s / 8,
      1000
    );
  }
}

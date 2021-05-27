class Player {
  constructor(_pos, _i) {
    this.pos = _pos;
    this.tar = _pos;
    this.i = _i;
    this.trail = [this.pos];
    this.itemList = [];
  }

  show(size) {
    this.trail.push(this.pos);
    this.pos = p5.Vector.lerp(this.pos, this.tar, 0.1);
    this.checkReady();
    fill("blanchedalmond");
    noStroke();
    ellipse(this.pos.x * size, this.pos.y * size, size / 2);
  }

  checkReady() {
    this.dist = this.pos.dist(this.tar);
    this.ready = this.dist < 3;
  }

  markAsVisited() {
    rooms[this.i].visited = true;
    rooms[this.i].trace = 255;
  }

  move(direction) {
    if (direction === "left") {
      this.steps = 0;
      while (!rooms[this.i].walls.LEFT) {
        this.markAsVisited();
        this.tar = rooms[this.i - 1].pos;
        this.i--;
        this.steps++;
      }
      return;
    }
    if (direction === "right") {
      this.steps = 0;
      while (!rooms[this.i].walls.RIGHT) {
        this.markAsVisited();
        this.tar = rooms[this.i + 1].pos;
        this.i++;
        this.steps++;
      }
      return;
    }
    if (direction === "up") {
      this.steps = 0;
      while (!rooms[this.i].walls.TOP) {
        this.markAsVisited();
        this.tar = rooms[this.i - nRooms].pos;
        this.i -= nRooms;
        this.steps++;
      }
      return;
    }
    if (direction === "down") {
      this.steps = 0;
      while (!rooms[this.i].walls.BOTTOM) {
        this.markAsVisited();
        this.tar = rooms[this.i + nRooms].pos;
        this.i += nRooms;
        this.steps++;
      }
      return;
    }
  }
}

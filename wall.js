class Wall {
  constructor(_pos, _s) {
    this.pos = _pos;
    this.size = _s / 100;

    this.dots = [];

    let j = -1;
    for (let i = 0; i < 120; i++) {
      i % 40 == 0 && j++;

      let dX = (i % 40) / 5;
      let dY = (j % 40) / 5;

      this.dots.push({
        i: this.pos.x + dX * this.size * 4,
        j: this.pos.y + dY * this.size * 4,
        s: floor(noise(this.pos.x + dX, this.pos.y + dY) * this.size * 2),
      });
    }
  }

  show() {
    fill("white");
    this.dots.forEach((dot) => {
      // console.log(dot);
      circle(dot.i, dot.j, dot.s);
    });
  }
}

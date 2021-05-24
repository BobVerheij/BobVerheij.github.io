class Item {

	constructor(_pos) {
		this.pos = _pos;
	}

	showItem (_s) {
		this.size = _s;
		fill('limegreen');
		circle(this.pos.x * this.size, this.pos.y * this.size, this.size/4);
	}
}

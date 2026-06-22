export default class State {
	#score = 0;
	#life;
	#maxLife;
	#time;

	constructor({ life: { init, max }, time }) {
		this.#life = init;
		this.#maxLife = max;
		this.#time = time;
	}

	set score(amount = 1) {
		this.#score = this.#score + amount;
	}

	get score() {
		return this.#score;
	}

	set life(amount = 1) {
		const next = this.#life + amount;
		this.#life = Math.max(0, Math.min(next, this.#maxLife));
	}

	get life() {
		return this.#life;
	}

	get maxLife() {
		return this.#maxLife;
	}

	get lifeMaxed() {
		return this.#life >= this.#maxLife;
	}

	get time() {
		return this.#time;
	}

	set time(t) {
		this.#time = t;
	}
}

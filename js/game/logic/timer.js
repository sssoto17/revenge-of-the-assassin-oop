export default class Timer {
	#component;
	#time;
	#timerID;
	#running;
	#tickLength;
	events;

	constructor(view, { time }, { onTick, onExpire }) {
		// this.#component = view.create("ul", {
		// 	id: "score_board",
		// 	role: "list",
		// });

		// this.#component.dataset.score = 0;
		// console.log(
		// 	"🚀 ~ Timer ~ constructor ~ this.#component:",
		// 	this.#component,
		// );
		// this.#score_board = document.createElement("ul");
		// this.#score_board.id = "score_board";
		// this.#score_board.role = "list";
		// this.#score_board.dataset.score = score;

		// console.log(this.#component);

		this.#tickLength = time;
		this.#time = 6;
		this.events = { onTick, onExpire };
	}

	get remainingTime() {
		return this.#time;
	}

	start(duration) {
		if (duration) {
			this.#time = duration;
		}

		clearTimeout(this.#timerID);
		this.#running = true;

		if (this.remainingTime > 0) {
			this.#timerID = setTimeout(() => this.tick(), this.#tickLength);
		}
	}

	stop() {
		clearTimeout(this.#timerID);
		this.#timerID = null;
		this.#running = false;
	}

	reset(duration = 0) {
		this.stop();
		this.#time = duration;
		this.events.onTick(this.#time);
	}

	tick() {
		if (!this.#running) return;

		this.#time -= 1;
		this.events.onTick(this.remainingTime);

		if (this.#time > 0) {
			this.start();
		} else {
			this.stop();
			this.events.onExpire();
		}
	}
}

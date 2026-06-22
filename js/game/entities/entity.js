export class Entity {
	#type;
	#speed = "fast";
	#active = true;
	static config;

	events = {
		onReset: () => {
			this.reset();

			if (!this.active) return;
			this.spawn();
		},
		onHit: () => this.hit(),
	};

	constructor() {
		this.node = document.createElement("div");
		this.audio = Entity.config.audio;
		this.events = { ...this.events, ...Entity.config.events };
	}

	static configure(audio, cb) {
		this.config = {
			audio: audio,
			events: cb,
		};
	}

	set type(type) {
		this.#type = type;
	}

	get type() {
		return this.#type;
	}

	set speed(s) {
		this.#speed = s;
	}

	get speed() {
		return this.#speed;
	}

	set active(bool) {
		if (this.#active === bool) return;
		this.#active = bool;

		if (this.active) {
			this.spawn();
		}
	}

	get active() {
		return this.#active;
	}

	spawn() {
		this.node.dataset.character = this.type;
		this.node.dataset.speed = this.speed;
		this.node.dataset.position = this.randomize(1, 4);
		this.node.dataset.delay = this.randomize(0.5, 10);

		this.node.classList.add("spawn");
		this.resume();
	}

	reset() {
		delete this.node.dataset.hit;

		this.node.classList.remove("spawn");
		this.node.offsetLeft;
	}

	pause() {
		this.node.setAttribute("data-paused", "");
	}

	resume() {
		this.node.removeAttribute("data-paused");
	}

	bind() {
		this.node.addEventListener("animationiteration", this.events.onReset);
		this.node.addEventListener("animationend", this.events.onReset);
		this.node.addEventListener("mousedown", this.events.onHit);
	}

	unbind() {
		this.node.removeEventListener(
			"animationiteration",
			this.events.onIteration,
		);
		this.node.removeEventListener("animationend", this.events.onReset);
		this.node.removeEventListener("mousedown", this.events.onHit);
	}

	randomize(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	hit(score = 1, life = 0) {
		this.pause();
		this.node.toggleAttribute("data-hit");
		this.events.onScore(score);
		this.events.onLife(life);

		if (life > 0) {
			this.audio.playBonus();
		} else {
			this.audio.playHit(this.type);
		}
	}
}

export class Criminal extends Entity {
	constructor() {
		super();
		this.type = "criminal";
		this.speed = "default";
	}
}

export class Civilian extends Entity {
	constructor() {
		super();
		this.type = "civilian";
		this.speed = this.randomize(1, 4);
		this.events = {
			...this.events,
			onHit: () => this.hit(-5, -1),
		};
	}
}

export class Cultist extends Entity {
	constructor() {
		super();
		this.type = "cultist";

		this.events = {
			...this.events,
			onReset: () => {
				if (!this.node.hasAttribute("data-hit")) {
					this.events.onLife(-1);
					this.audio.playPenalty();
				}

				this.reset();

				if (!this.active) return;
				this.spawn();
			},
			onHit: () => this.hit(3),
		};
	}
}

export class Life extends Entity {
	constructor() {
		super();
		this.type = "life";
		this.events = {
			...this.events,
			onHit: () => this.hit(0, 1),
		};
	}
}

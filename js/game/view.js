export default class View {
	#screen;
	#audio;
	#buttons;
	#life_board;
	#score_board;

	constructor(state) {
		this.#screen = document.createElement("section");
		this.#screen.id = "screen";

		this.render(state);
	}

	get screen() {
		return this.#screen;
	}

	set screen(mode = "start") {
		this.#screen.dataset.mode = mode;
	}

	get buttons() {
		return {
			play: document.querySelector("button#play"),
			pause: document.querySelector("button#pause"),
			back: document.querySelector("button#back"),
			mute: document.querySelector("button#mute"),
			guide: document.querySelector("button#guide"),
		};
	}

	get life_board() {
		return this.#life_board;
	}

	set life_board(max) {
		this.#life_board = document.createElement("ul");
		this.#life_board.id = "life_board";
		this.#life_board.role = "list";
		this.#life_board.dataset.max = max;
	}

	get score_board() {
		return this.#score_board;
	}

	set score_board(score) {
		this.#score_board = document.createElement("ul");
		this.#score_board.id = "score_board";
		this.#score_board.role = "list";
		this.#score_board.dataset.score = score;
	}

	get audio() {
		return this.#audio;
	}

	create(tag = "div", attributes, parent) {
		const el = document.createElement(tag);

		if (attributes !== null) {
			Object.entries(attributes).map(([attr, value]) => {
				el[attr] = value;
			});
		}

		if (!parent) {
			this.screen.appendChild(el);
		} else {
			document.querySelector(parent).appendChild(el);
		}

		return el;
	}

	render(state) {
		this.screen = state.mode;
		this.life_board = state.maxLife;
		this.score_board = state.score;

		this.renderEntities();
		this.renderHUD(state);

		document.querySelector("main").appendChild(this.screen);
	}

	renderAudio() {
		this.#audio = document.createElement("ul");
		this.#audio.id = "sound_fx";
		this.#audio.role = "list";
	}

	renderEntities() {
		this.entities = document.createElement("article");
		this.entities.id = "entities";

		this.screen.appendChild(this.entities);
	}

	renderHUD({ life, score }) {
		this.hud = document.createElement("article");
		this.hud.id = "hud";

		this.renderLives(life);
		this.renderScore(score);
		this.renderTimer();

		this.renderAudio();
		this.renderButtons();

		this.hud.appendChild(this.life_board);
		this.hud.appendChild(this.score_board);
		this.hud.appendChild(this.audio);

		this.screen.appendChild(this.hud);
	}

	renderButtons() {
		Object.entries(this.buttons).map(([key, value]) => {
			const node = document.createElement("button");

			node.id = key;
			node.title = key;
			// node.innerText = key;

			this.hud.appendChild(node);
			// return node;
		});
	}

	renderScore(score) {
		this.#score_board.dataset.score = score;
	}

	renderLives(current) {
		const lives = [];

		for (var i = 0; i < current; i++) {
			lives[i] = document.createElement("li");
		}

		this.life_board.replaceChildren(...lives);
	}

	renderTimer(t = 6) {
		if (this.score_board.hasChildNodes()) {
			this.score_board.childNodes[t].classList.add("hide");
			return;
		}

		const symbols = [];

		for (var i = 0; i < t; i++) {
			symbols[i] = document.createElement("li");
			symbols[i].innerText = i;
		}

		this.score_board.replaceChildren(...symbols);
	}
}

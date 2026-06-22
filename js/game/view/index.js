import RendererService from "./renderer.js";

export default class View {
	#app;
	#renderer = new RendererService();
	#screen;
	#audio;
	#buttons = {
		play: {
			label: "play",
			action: () => this.#app.start(),
		},
		pause: {
			label: "pause",
			action: () => {},
		},
		toggle_mute: {
			icon: "",
			title: "Toggle background music",
			action: () => this.#app.audio.toggleMute(),
		},
		tutorial: {
			icon: "",
			title: "Display game instructions",
			action: () => {},
		},
		go_back: {
			icon: "",
			title: "Return to game menu",
			action: () => {},
		},
	};
	#life_board;
	#score_board;

	constructor(app) {
		this.#app = app;

		this.#screen = this.#renderer.create("section", { id: "screen" });
		this.#audio = this.#renderer.create("ul", { id: "sound_fx" });
		this.#life_board = this.#renderer.create("ul", { id: "life_board" });
		this.#score_board = this.#renderer.create("ul", { id: "score_board" });

		this.render();
	}

	get state() {
		return this.#app.state;
	}

	get screen() {
		return this.#screen;
	}

	set screen(mode = "start") {
		this.#screen.dataset.mode = mode;
	}

	get life_board() {
		return this.#life_board;
	}

	set life_board(max) {
		this.#life_board.dataset.max = max;
	}

	get score_board() {
		return this.#score_board;
	}

	set score_board(score = 0) {
		this.#score_board.dataset.score = score;
	}

	set buttons(entries) {
		this.#buttons = Object.fromEntries(entries);
	}

	get buttons() {
		return this.#buttons;
	}

	get audio() {
		return this.#audio;
	}

	render() {
		this.renderEntities();
		this.renderHUD(this.state);
		this.renderControls();

		document.querySelector("main").appendChild(this.screen);
	}

	renderEntities() {
		this.entities = this.#renderer.create("article", { id: "entities" });
		this.screen.appendChild(this.entities);
	}

	renderHUD({ life, maxLife, score }) {
		this.hud = this.#renderer.create("article", { id: "hud" });

		this.score_board = score;
		this.renderLives(life, maxLife);
		this.renderTimer();

		this.hud.appendChild(this.life_board);
		this.hud.appendChild(this.score_board);

		this.screen.appendChild(this.hud);
	}

	renderControls() {
		this.controls = this.#renderer.create("article", { id: "controls" });

		this.buttons = Object.entries(this.buttons).map(
			([key, { label, icon, title, action }]) => {
				const node = this.#renderer.create("button", {
					id: key,
					title: title ?? key,
				});

				node.innerText = label ?? "";
				node.addEventListener("click", action);
				this.controls.appendChild(node);

				return [key, node];
			},
		);

		this.controls.appendChild(this.audio);
		this.screen.appendChild(this.controls);
	}

	renderLives(current, max) {
		const lives = [];

		if (max) {
			this.life_board = max;
		}

		for (var i = 0; i < current; i++) {
			lives[i] = this.#renderer.create("li");
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
			symbols[i] = this.#renderer.create("li");
			symbols[i].innerText = i;
		}

		this.score_board.replaceChildren(...symbols);
	}
}

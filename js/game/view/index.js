import RendererService from "./renderer.js";

export default class View {
	#app;
	#renderer = new RendererService();
	#screen;
	#audio;
	#life_board;
	#score_board;
	#timer;
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

	constructor(app) {
		this.#app = app;

		this.#screen = this.#renderer.create("section", { id: "screen" });
		this.#audio = this.#renderer.create("ul", { id: "sound_fx" });
		this.#timer = this.#renderer.create("ul", { id: "timer" });
		this.#score_board = this.#renderer.create("p", { id: "score_board" });
		this.#life_board = this.#renderer.create("ul", { id: "life_board" });

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

	set life_board(l) {
		const lives = [];

		for (var i = 0; i < l; i++) {
			lives[i] = this.#renderer.create("li");
		}

		this.life_board.replaceChildren(...lives);
	}

	get score_board() {
		return this.#score_board;
	}

	set score_board(score = 0) {
		this.#score_board.innerText = score;
	}

	get timer() {
		return this.#timer;
	}

	set timer(t) {
		this.#timer.childNodes[t].classList.add("hide");
	}

	get buttons() {
		return this.#buttons;
	}

	set buttons(entries) {
		this.#buttons = Object.fromEntries(entries);
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

		this.life_board = life;
		this.score_board = score;

		this.renderTimer();

		this.hud.appendChild(this.life_board);
		this.hud.appendChild(this.timer);
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

	renderTimer(t = 6) {
		const symbols = [];

		for (var i = 0; i < t; i++) {
			symbols[i] = this.#renderer.create("li");
			symbols[i].innerText = i;
		}

		this.timer.replaceChildren(...symbols);
	}
}

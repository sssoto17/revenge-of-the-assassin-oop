import EntityManager from "./entities/manager.js";
import Timer from "./logic/timer.js";
import State from "./logic/state.js";
import View from "./view/index.js";
import GameAudio from "./audio.js";
import config from "./config/index.js";

class App {
	constructor(config) {
		this.state = new State(config);
		this.view = new View(this);
		this.audio = new GameAudio(
			this.view.audio,
			this.view.buttons,
			this.view,
		);

		this.entity_manager = new EntityManager(
			config.entityCount,
			this.view,
			this.audio,
			{
				onScore: (delta) => this.applyScore(delta),
				onLife: (delta) => this.applyLife(delta),
			},
		);

		this.timer = new Timer(this.view, this.state, {
			onTick: (t) => {
				this.state.time = t;
				this.view.renderTimer(t);
			},
			onExpire: () => this.endGame("time"),
		});

		this.init();
	}

	init() {
		this.view.screen = "start";
		this.audio.playBackground();
	}

	start() {
		this.view.screen = "play";
		this.view.entities.addEventListener("mousedown", () =>
			this.audio.playSlash(),
		);

		this.timer.start();
		this.entity_manager.spawnRound();
	}

	applyLife(delta) {
		const wasMax = this.state.lifeMaxed;

		this.state.life = delta;
		this.view.renderLives(this.state.life);

		const isMax = this.state.lifeMaxed;

		if (this.state.life <= 0) {
			this.endGame("life");
		}

		if (isMax) {
			this.entity_manager.getByType("life").forEach((sprite) => {
				sprite.active = false;
			});
		}

		if (wasMax && !isMax) {
			this.entity_manager.getByType("life").forEach((sprite) => {
				sprite.active = true;
			});
		}
	}

	applyScore(delta) {
		this.state.score = delta;
		this.view.renderScore(this.state.score);
	}

	endGame(reason) {
		console.log(reason);
	}
}

window.addEventListener("DOMContentLoaded", new App(config()));

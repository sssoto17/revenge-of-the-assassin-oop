import { Civilian, Criminal, Cultist, Entity, Life } from "./entity.js";

export default class EntityManager {
	factory = {
		cultists: () => new Cultist(),
		lives: () => new Life(),
		criminals: () => new Criminal(),
		civilians: () => new Civilian(),
	};

	constructor(counts, view, audio, cb) {
		this.counts = counts;
		this.view = view;

		Entity.configure(audio, cb);

		this.createEntities();
		// this.spawnRound();
		this.bindAll();
	}

	createEntities() {
		this.entities = Object.entries(this.counts).flatMap(([type, count]) =>
			Array.from({ length: count }, () => this.factory[type]()),
		);
	}

	spawnRound() {
		this.view.buttons.pause.addEventListener("click", (e) =>
			this.pauseAll(e),
		);
		this.entities.map((sprite) => {
			sprite.spawn();
			this.view.entities.appendChild(sprite.node);
		});
	}

	pauseAll() {
		this.entities.map((sprite) => {
			sprite.pause();
		});

		this.view.buttons.pause.addEventListener("click", (e) =>
			this.resumeAll(e),
		);
	}

	resumeAll() {
		this.entities.map((sprite) => {
			sprite.resume();
		});
		this.view.buttons.pause.addEventListener("click", (e) =>
			this.pauseAll(e),
		);
	}

	bindAll() {
		this.entities.map((sprite) => {
			sprite.bind();
		});
	}

	unbindAll() {
		this.entities.map((sprite) => {
			sprite.unbind();
		});
	}

	get activeEntities() {
		return this.entities.filter((sprite) => sprite.active);
	}
	get inactiveEntities() {
		return this.entities.filter((sprite) => !sprite.active);
	}

	getByType(type) {
		return this.entities.filter((sprite) => sprite.type === type);
	}
}

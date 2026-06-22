export default class GameAudio {
	#player;
	#track;
	#button;
	static tracks = [
		{
			id: "music",
			src: "/assets/audio/bg_music.mp3",
		},
		{
			id: "slash",
			src: "/assets/audio/slash.wav",
		},
		{
			id: "stab",
			src: "/assets/audio/stab.mp3",
		},
		{
			id: "bonus",
			src: "/assets/audio/bonus.mp3",
		},
		{
			id: "penalty",
			src: "/assets/audio/penalty.wav",
		},
		{
			className: "civilian",
			src: "/assets/audio/civilian/cry1.wav",
		},
		{
			className: "civilian",
			src: "/assets/audio/civilian/cry2.wav",
		},
		{
			className: "criminal",
			src: "/assets/audio/criminal/grunt1.wav",
		},
		{
			className: "criminal",
			src: "/assets/audio/criminal/grunt2.wav",
		},
		{
			className: "criminal",
			src: "/assets/audio/criminal/grunt3.wav",
		},
		{
			className: "criminal",
			src: "/assets/audio/criminal/grunt4.wav",
		},
		{
			className: "criminal",
			src: "/assets/audio/criminal/grunt5.wav",
		},
		{
			className: "criminal",
			src: "/assets/audio/criminal/grunt6.wav",
		},
	];

	constructor(audio, { toggle_mute }, view) {
		this.#player = audio;
		this.#button = toggle_mute;

		this.generateTracks();
	}

	generateTracks() {
		GameAudio.tracks.map((tr) => {
			const audio = new Audio(tr.src);
			if (tr.id) {
				audio.id = tr.id;
			}
			if (tr.className) {
				audio.classList.add(tr.className);
			}

			const track = document.createElement("li");
			track.appendChild(audio);

			this.#player.appendChild(track);
			audio.load();
		});
	}

	set track(id) {
		if (typeof id === "object") {
			this.#track = id;
			return;
		}
		this.#track = this.#player.querySelector(`#${id}`);
	}

	get track() {
		return this.#track;
	}

	get muteButton() {
		return this.#button;
	}

	get playingAudioNodes() {
		return Array.from(this.#player.querySelectorAll("audio")).filter(
			(a) => !a.paused,
		);
	}

	isTrackPlaying(id) {
		return this.playingAudioNodes.some((a) => a.id === id);
	}

	playBackground() {
		this.track = "music";
		this.track.autoplay = true;
		this.track.loop = true;
		this.track.play();
		this.muteButton.dataset.playing = true;
	}

	stopBackground() {
		this.track = "music";
		this.track.pause();
		this.track.currentTime = 0;
		this.muteButton.dataset.playing = false;
	}

	toggleMute() {
		this.track = "music";

		if (this.muted) {
			this.playBackground();
		} else {
			this.stopBackground();
		}
	}

	get muted() {
		return this.#track.paused;
	}

	play() {
		this.track.currentTime = 0;
		this.track.play();
	}

	playSlash() {
		if (!this.isTrackPlaying("bonus")) {
			this.track = "slash";
			this.track.volume = 0.5;
			this.play();
		}
	}

	playHit(type) {
		this.track = "stab";
		this.play();

		if (type) {
			this.generateSound(type);
		}
	}

	generateSound(type = "civilian") {
		const samples = this.#player.querySelectorAll(`.${type}`);
		if (!samples.length) return;

		const i = this.randomize(0, samples.length - 1);

		this.track = samples[i];
		this.track.play();
	}

	playBonus() {
		this.track = "bonus";
		this.play();
	}

	playPenalty() {
		this.track = "penalty";
		this.play();
	}

	randomize(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

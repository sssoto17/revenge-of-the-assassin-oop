import { easy } from "./easy.js";
import { extreme } from "./extreme.js";
import { hard } from "./hard.js";
import { normal } from "./normal.js";

export default function config(difficulty = "normal") {
	switch (difficulty) {
		case "easy":
			return easy;
		case "normal":
			return normal;
		case "hard":
			return hard;
		case "extreme":
			return extreme;
	}
}

export default class RendererService {
	constructor() {}

	create(tag = "div", attributes) {
		const node = document.createElement(tag);

		if (attributes !== null) {
			Object.entries(attributes).map(([attr, value]) => {
				node[attr] = value;
			});
		}

		return node;
	}

	update() {}

	query() {}

	mount() {
		// if (!parent) {
		// 	this.screen.appendChild(el);
		// } else {
		// 	document.querySelector(parent).appendChild(el);
		// }
	}

	unmount() {}
}

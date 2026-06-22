export default class RendererService {
	constructor() {}

	create(tag = "div", attributes) {
		const node = document.createElement(tag);

		if (tag === "ul") {
			node.role = "list";
		}

		if (attributes) {
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

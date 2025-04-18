export default class Camera {
	constructor(canvas, scale = 1.5) {
		this.canvas = canvas;
		this.scale = scale;
		this.width = 0;
		this.height = 0;
		this.width_scale = 0;
		this.height_scale = 0;
	}

	resize(mapWidth, mapHeight) {
		this.width = this.canvas.width * this.scale;
		this.height = this.canvas.height * this.scale;
		this.width_scale = mapWidth / this.width;
		this.height_scale = mapHeight / this.height;
	}

	worldToScreen(worldX, worldY, character) {
		const screenX =
			(worldX - (character.realX - this.width / 2)) *
			(this.canvas.width / this.width);
		const screenY =
			(worldY - (character.realY - this.height / 2)) *
			(this.canvas.height / this.height);
		return { x: screenX, y: screenY };
	}

	screenToWorld(screenX, screenY, characterX, characterY) {
		const worldX =
			screenX * (this.width / this.canvas.width) +
			(characterX - this.width / 2);
		const worldY =
			screenY * (this.height / this.canvas.height) +
			(characterY - this.height / 2);
		return { x: worldX, y: worldY };
	}
}

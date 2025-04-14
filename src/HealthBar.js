import { assets } from "./Assets";

class HealthBar {
	constructor() {
		this.healthBarImg = assets.heath_base;

		this.healthImg = assets.healthsrc;

		this.healthWidth = this.healthImg.width; // Default health width
	}

	setHealth(healthPercentage) {
		// Update the health width based on the percentage (0 to 100)
		this.healthWidth = (healthPercentage / 100) * this.healthWidth;
		console.log(this.healthWidth);
	}

	draw(gl) {
		// Ensure the health bar image is fully loaded before drawing
		if (!this.healthBarImg.complete) {
			console.error("Health bar image not loaded yet.");
			return;
		}

		// Draw the base health bar
		gl.drawImage(
			this.healthBarImg,
			0,
			0,
			this.healthBarImg.width,
			this.healthBarImg.height,
			10,
			10,
			this.healthBarImg.width * 0.5,
			this.healthBarImg.height * 0.5
		);

		// Ensure the health image is fully loaded before drawing
		if (!this.healthImg.complete) {
			console.error("Health image not loaded yet.");
			return;
		}

		// Draw the health overlay
		gl.drawImage(
			this.healthImg,
			0,
			0,
			this.healthWidth,
			this.healthImg.height,
			10,
			10,
			this.healthWidth * 0.5,
			this.healthImg.height * 0.5
		);
	}
}

export default HealthBar;

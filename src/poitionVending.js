import { assets } from "./Assets";

export class PotionVendingMachine {
	constructor(x, y, potionManager) {
		this.frameWidth = 56;
		this.frameHeight = 41;
		this.currentFrame = 0;
		this.frameInterval = 100;
		this.lastFrameTime = 0;
		this.x = x;
		this.y = y;
		this.potionManager = potionManager;
		this.scale = 2;
		this.lastVendingTime = 0;
	}

	// Dispense a potion at a specific position
	dispensePotion() {
		// if (
		// 	this.potionManager &&
		// 	typeof this.potionManager.summonPotion === "function"
		// ) {
		this.potionManager.summonPotion(this.x + this.frameWidth / 2, this.y + 100);
		// }
	}

	draw(gl, camera, character) {
		const { x: screenX, y: screenY } = camera.worldToScreen(
			this.x,
			this.y,
			character
		);

		gl.drawImage(
			assets.vendingPotion,
			this.currentFrame + 1,
			0 + 11,
			this.frameWidth,
			this.frameHeight,
			screenX,
			screenY,
			this.frameWidth * 2.2,
			this.frameHeight * 2.2
		);
	}

	isOverlapping(character) {
		if (character.coins < 10) {
			return;
		}

		if (this.lastVendingTime !== 0 && Date.now() - this.lastVendingTime < 500) {
			return;
		}
		this.lastVendingTime = Date.now();

		const characterPoint = { x: character.realX, y: character.realY };

		const vendingBounds = {
			left: this.x,
			right: this.x + (this.frameWidth / 2) * 2.2,
			top: this.y - this.frameHeight / 2,
			bottom: this.y + this.frameHeight * 2.2 - this.frameHeight / 2,
		};

		if (
			characterPoint.x > vendingBounds.left &&
			characterPoint.x < vendingBounds.right &&
			characterPoint.y > vendingBounds.top &&
			characterPoint.y < vendingBounds.bottom
		) {
			character.coins -= 10;
			this.dispensePotion();
			console.log("POTION VENDED!!");
		}
	}
}

import { assets } from "./Assets";

export default class Portal {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 64 * 3;
		this.height = 64 * 3;

		this.image = assets.portal;

		this.frameSets = {
			summon: { y: 1, frames: 8 }, // Frame indices for summon animation
			idle: { y: 0, frames: 8 }, // Frame indices for idle swirling animation
			dissolve: { y: 2, frames: 8 }, // Frame indices for dissolve animation
		};

		this.currentFrameSet = this.frameSets.summon;
		this.currentFrameIndex = 0;
		this.frameTimer = 0;
		this.frameInterval = 200; // Milliseconds between frames
		this.isActive = false;
		this.isDissolving = false;
	}

	activate() {
		this.isActive = true;
		this.currentFrameSet = this.frameSets.summon;
		this.currentFrameIndex = 0;
		this.isDissolving = false;
	}

	deactivate() {
		this.isDissolving = true;
		this.currentFrameSet = this.frameSets.dissolve;
		this.currentFrameIndex = 0;
	}

	update(deltaTime) {
		if (!this.isActive && !this.isDissolving) return;

		this.frameTimer += deltaTime * 1000; // Convert deltaTime to milliseconds
		if (this.frameTimer >= this.frameInterval) {
			this.frameTimer = 0;
			this.currentFrameIndex++;

			if (this.currentFrameIndex >= this.currentFrameSet.frames) {
				if (this.isDissolving) {
					this.isActive = false; // Fully dissolved
					this.isDissolving = false;
				} else {
					this.currentFrameSet = this.frameSets.idle; // Switch to idle animation
					this.currentFrameIndex = 0;
				}
			}
		}
	}

	draw(context, camera, canvas, character) {
		if (this.isActive || this.isDissolving) {
			const frameWidth = this.image.width / 8; // Assuming 12 frames in the sprite sheet
			const frameHeight = this.image.height / 3;

			const screenX =
				(this.x - (character.realX - camera.width / 2)) *
				(canvas.width / camera.width);
			const screenY =
				(this.y - (character.realY - camera.height / 2)) *
				(canvas.height / camera.height);

			context.drawImage(
				this.image,
				this.currentFrameIndex * frameWidth, // Source X
				this.currentFrameSet.y, // Source Y
				frameWidth, // Source Width
				frameHeight, // Source Height
				screenX, // Destination X
				screenY, // Destination Y
				this.width, // Destination Width
				this.height // Destination Height
			);
		}
	}

	checkCollision(player) {
		if (
			this.isActive &&
			player.realX < this.x + this.width &&
			player.realX + player.width > this.x &&
			player.realY < this.y + this.height &&
			player.realY + player.height > this.y
		) {
			return true; // Player has entered the portal
		}
		return false;
	}
}

import { assets } from "./Assets";

export class CoinManager {
	constructor() {
		this.coins = [];
		// this.coinCount = 0;
		this.frameWidth = 16; // Width of each frame in the sprite sheet
		this.frameHeight = 16; // Height of each frame
		this.frameCount = 14; // Number of frames in the animation
		this.currentFrame = 0;
		this.frameInterval = 100; // Milliseconds between frame changes
		this.lastFrameTime = 0;
	}

	spawnCoin(x, y) {
		this.coins.push({ x, y });
		// console.log(this.coins);
	}

	update(currentTime, player) {
		// Update animation frame
		if (currentTime - this.lastFrameTime > this.frameInterval) {
			this.currentFrame = (this.currentFrame + 1) % this.frameCount;
			this.lastFrameTime = currentTime;
			// console.log("F: " + this.currentFrame);
		}

		// Check collisions
		for (let i = this.coins.length - 1; i >= 0; i--) {
			const coin = this.coins[i];
			const distance = Math.sqrt(
				Math.pow(player.realX - (coin.x + this.frameWidth / 2), 2) +
					Math.pow(player.realY - (coin.y + this.frameWidth / 2), 2)
			);

			if (distance < 80) {
				// Collision radius
				this.coins.splice(i, 1);
				player.coins++;
			}
		}
	}

	draw(gl, camera, character) {
		this.coins.forEach((coin) => {
			const { x: screenX, y: screenY } = camera.worldToScreen(
				coin.x,
				coin.y,
				character
			);

			// console.log(screenX, screenY);

			// gl.save();
			// gl.translate(screenX, screenY);

			// Draw the current frame of the coin animation
			gl.drawImage(
				assets.coin,
				this.currentFrame * this.frameWidth,
				0, // Source x, y
				this.frameWidth,
				this.frameHeight, // Source width, height
				screenX,
				screenY, // Destination x, y (centered)
				32,
				32 // Destination width, height
			);

			// gl.restore();
		});

		// Draw coin counter
		gl.save();
		gl.fillStyle = "#fff";
		gl.strokeStyle = "#000";
		gl.lineWidth = 4;
		gl.font = "30px Monogram";
		gl.strokeText(`Coins: ${character.coins}`, 20, 80);
		gl.fillText(`Coins: ${character.coins}`, 20, 80);
		gl.restore();
	}
}

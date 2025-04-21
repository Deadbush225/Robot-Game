const frameWidth = 64; // Width of each frame in the sprite sheet
const frameHeight = 64; // Height of each frame in the sprite sheet
import { assets } from "./Assets";
import { Gun } from "./Gun";

class FloatingText {
	constructor(text, color) {
		this.text = text;
		this.offset = 0; // offset to top
		this.color = color;
		this.alpha = 1;
		this.lifetime = 1000; // ms
		this.startTime = Date.now();
	}

	update() {
		const elapsed = Date.now() - this.startTime;
		this.offset -= 0.5; // Move up
		this.alpha = 1 - elapsed / this.lifetime;
		return elapsed < this.lifetime;
	}

	draw(context, x, y) {
		context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = this.color;
		context.font = "bold 30px Monogram";
		context.fillText(this.text, x, y - this.offset);
		context.restore();
	}
}

export class Character {
	constructor(scale, healthBar, characterProps) {
		this.img = assets[characterProps.imgName];
		this.realX = 500; // Actual X position in pixels
		this.realY = 500; // Actual Y position in pixels
		this.gridX = 2; // Grid position (column)
		this.gridY = 2; // Grid position (row)
		this.width = 50;
		this.height = 50;
		// this.color = "#646cff";
		this.speed = characterProps.speed; // pixel per second
		this.face = 0;
		this.state = 0; // "Standing" | "Walking" | "Jumping"
		this.lastFrameTime = 0;
		this.frame = 0;
		this.camera_scale = scale;
		this.gunAngle = 0;

		this.bullets = [];
		this.floatingTexts = [];
		// this.health = 100; // Character's health
		this.isTakingDamage = false; // Flag to track if the character is taking damage
		this.damageTimer = 0; // Timer to control the duration of the damaged state
		this.healthBar = healthBar;
		this.currentGun = new Gun(characterProps.gun);
		this.coins = 0;
		this.isDashing = false;
	}

	takeDamage(amount) {
		if (!this.isTakingDamage) {
			this.healthBar.updateHealth(-amount);
			this.floatingTexts.push(new FloatingText(`-${amount}`, "red"));
			if (this.healthBar.health > 0) {
				// this.state = 3; // Set state to "Damaged"
				this.isTakingDamage = true;
				this.damageTimer = Date.now(); // Start the damage timer
			} else {
				this.state = 3;
			}
			// this.healthBar.setHealth(this.health);
		}
	}

	heal(amount) {
		this.healthBar.updateHealth(amount);

		this.floatingTexts.push(new FloatingText(`+${amount}`, "lime"));
		// this.healthBar.setHealth(this.health);
		// console.log(this.healthBar);
		// console.log(this.healthBar.healthWidth);
		console.log("HEALED: " + this.healthBar.health);
	}

	updateState() {
		// Automatically transition out of the damaged state after 500ms
		if (this.isTakingDamage && Date.now() - this.damageTimer > 200) {
			this.isTakingDamage = false;
			this.state = 0; // Return to "Standing" state
		}
	}

	animateSprite(frameCount, animationSpeed) {
		const currentTime = Date.now();
		this.frame = this.frame > frameCount ? 0 : this.frame;

		if (currentTime - this.lastFrameTime >= animationSpeed) {
			this.frame = (this.frame + 1) % frameCount; // Loop through frames
			this.lastFrameTime = currentTime;
		}
	}

	draw(context, x, y) {
		// Update and draw floating texts

		this.updateState();
		switch (this.state) {
			case 3:
				this.drawKilled(context, x, y);
				break;
			case 2:
			case 0:
				this.drawStanding(context, x, y);
				break;
			case 1:
				this.drawWalking(context, x, y);
				break;
		}

		this.floatingTexts = this.floatingTexts.filter((ft) => {
			ft.update();
			ft.draw(context, x, y);
			return ft.alpha > 0;
		});
	}

	drawKilled(context, x, y) {
		this.animateSprite(4, 100);

		if (this.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15 + (this.isTakingDamage ? 384 : 0), // Source X position (frame index * frame width)
				64 * 2 + 60 + 11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				-x - this.width, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);

			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15 + (this.isTakingDamage ? 384 : 0), // Source X position (frame index * frame width)
				64 * 2 + 60 + 11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
		}
	}

	drawStanding(context, x, y) {
		this.animateSprite(6, 200);

		if (this.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				this.img,
				this.frame * frameWidth /* +(this.isTakingDamage ? 384 : 0)*/, // Source X position (frame index * frame width)
				0, // Source Y position (assuming single row sprite sheet)
				64, // Source width
				64, // Source height
				-x - this.width, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);

			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				this.img,
				this.frame * frameWidth /* + (this.isTakingDamage ? 384 : 0)*/, // Source X position (frame index * frame width)
				0, // Source Y position (assuming single row sprite sheet)
				64, // Source width
				64, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
		}
	}

	drawWalking(context, x, y) {
		this.animateSprite(3, 100);

		if (this.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				this.img,
				this.frame * frameWidth, // Source X position (frame index * frame width)
				64 * 2, // Source Y position for walking animation
				64, // Source width
				64, // Source height
				-x - this.width, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				this.img,
				this.frame * frameWidth, // Source X position (frame index * frame width)
				64 * 2, // Source Y position for walking animation
				64, // Source width
				64, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
		}
	}

	pickUpGun(newGun) {
		if (this.currentGun) {
			// Drop the current gun at the player's position
			this.droppedGun = {
				gun: this.currentGun,
				x: this.realX,
				y: this.realY,
			};
		}

		// Equip the new gun
		this.currentGun = newGun;
	}
}

export default Character;

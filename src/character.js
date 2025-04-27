const frameWidth = 64; // Width of each frame in the sprite sheet
const frameHeight = 64; // Height of each frame in the sprite sheet
import { assets } from "./Assets";
import { Gun } from "./Gun";
import { soundManager } from "./Sounds";
import { spawnPointX, spawnPointY } from "./store";
import { get } from "svelte/store";

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
	constructor(scale, healthBar, characterProps, animationMap) {
		this.img = assets[characterProps.imgName];
		this.realX = get(spawnPointX); // Actual X position in pixels
		this.realY = get(spawnPointY); // Actual Y position in pixels
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
		this.potions = 0;
		// this.health = 100; // Character's health
		this.isTakingDamage = false; // Flag to track if the character is taking damage
		this.damageTimer = 0; // Timer to control the duration of the damaged state
		this.healthBar = healthBar;
		this.currentGun = new Gun(characterProps.gun);
		this.coins = 1000;

		this.moveTime = 0;

		this.isDashing = false;
		this.dashDuration = 0.1; // seconds (100ms)
		this.dashCooldown = 2.0; // seconds (1000ms)
		this.dashTimer = 0; // time left for dash or cooldown

		this.animationMap = characterProps.animationMap;
		this.hurtSfx = characterProps.hurtSfx;
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
			soundManager.play(this.hurtSfx);
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

	healFromInventory() {
		// console.log(this.healthBar.health, " ", this.potions);
		if (
			this.healthBar.health > this.healthBar.originalHealth - 20 ||
			this.potions <= 0
		)
			return;

		this.heal(20);
		this.potions--;
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
		this.updateState();

		// Map state to animation config

		const anim = this.animationMap[this.state] || this.animationMap[0];
		this.animateSprite(anim.frames, anim.speed);

		let sx =
			this.frame * frameWidth +
			(this.state === 3 ? (this.isTakingDamage ? 384 : 0) : 0) +
			(this.state === 3 ? 15 : 0);
		let sy = anim.sy;
		let sw = anim.sw;
		let sh = anim.sh;

		if (this.face === 1) {
			context.save();
			context.scale(-1, 1);
			context.drawImage(
				this.img,
				sx,
				sy,
				sw,
				sh,
				-x - this.width,
				y,
				this.width * 1.5,
				this.height * 1.5
			);
			context.restore();
		} else {
			context.drawImage(
				this.img,
				sx,
				sy,
				sw,
				sh,
				x,
				y,
				this.width * 1.5,
				this.height * 1.5
			);
		}

		this.floatingTexts = this.floatingTexts.filter((ft) => {
			ft.update();
			ft.draw(context, x, y);
			return ft.alpha > 0;
		});
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

import { assets } from "./Assets";
import { addTempBlockedRect, removeTempBlockedRect } from "./boundary";

export default class Door {
	constructor(x, y, orientation = "Vertical", camera, character) {
		this.orientation = orientation;

		this.x = x;
		this.y = y;

		this.gap = 0;
		this.frameDuration = 200; // ms per frame
		this.state = "locked";
		this.openStartTime = null;
		this.currentFrame = 0;
		this.lastFrameTime = 0;

		this.img = orientation == "Vertical" ? assets.vDoor : assets.hDoor;

		this.width = this.img.width;
		this.height = this.img.height;
		this.frameWidth = orientation == "Vertical" ? 58 : 32 * 8;

		if (orientation == "Vertical") {
			this.doorRect = {
				x: this.x,
				y: this.y,
				width: 58,
				height: this.height,
				active: true,
			};
		} else {
			this.doorRect = {
				x: this.x,
				y: this.y,
				width: this.width,
				height: 58,
				active: true,
			};
		}
		this.doorId = addTempBlockedRect(this.doorRect);

		// Start timer to open after 10 seconds
		// setTimeout(() => {
		// 	// this.state = "opening";
		// 	// this.openStartTime = performance.now();
		// 	this.openDoor();
		// }, 10000);
		// console.log("width: ", this.width, " ", "height: ", this.height);
	}
	openDoor() {
		console.log("CLOSING DOOR:");
		console.log(this.doorId);
		this.state = "opening";
		removeTempBlockedRect(this.doorId);
	}

	update() {
		if (this.state === "open") {
			return;
		}

		let now = performance.now();
		if (this.state === "opening") {
			if (now - this.lastFrameTime > this.frameDuration) {
				this.currentFrame++;
				this.lastFrameTime = now;
				if (this.currentFrame < 0) {
					this.currentFrame = 9;
					this.state = "open";
				}
			}
		}
	}

	draw(ctx, camera, character) {
		if (this.state === "open") {
			return;
		}

		let { x: x, y: y } = camera.worldToScreen(this.x, this.y, character);

		if (this.orientation == "Vertical") {
			if (this.state === "locked") {
				ctx.drawImage(
					this.img,
					32 + this.frameWidth * 0,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth * 1.2,
					this.height * 1.2
				);
			} else if (this.state === "opening") {
				ctx.drawImage(
					this.img,
					32 + this.currentFrame * 8 * 32,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth * 1.2,
					this.height * 1.2
				);
			}
		} else {
			// horizontal
			if (this.state === "locked") {
				ctx.drawImage(
					this.img,
					this.frameWidth * 0,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth * 1.2,
					this.height * 1.2
				);
			} else if (this.state === "opening") {
				ctx.drawImage(
					this.img,
					0 + this.currentFrame * 8 * 32,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth * 1.2,
					this.height * 1.2
				);
			}
		}
	}
}

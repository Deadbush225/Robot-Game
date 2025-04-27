export default class HUD {
	constructor(game) {
		this.game = game;
	}

	draw(gl, canvas) {
		// // HUD dimensions
		// const hudWidth = 200;
		// const hudHeight = 110;
		// const padding = 10;

		// // Calculate bottom right position
		// const x = canvas.width - hudWidth - padding;
		// const y = canvas.height - hudHeight - padding;

		// Draw outlined "Score" text
		const scoreText = `Score: ${this.game.gameStats.score}`;
		gl.save();
		gl.font = "30px 'monogram', monospace";
		gl.lineWidth = 4;
		gl.strokeStyle = "#000";
		gl.fillStyle = "#fff";
		gl.strokeText(scoreText, 20, 120);
		gl.fillText(scoreText, 20, 120);
		gl.restore();

		// // Background for HUD
		// gl.save();
		// gl.fillStyle = "rgba(0, 0, 0, 0.7)";
		// gl.fillRect(x, y, hudWidth, hudHeight);
		// gl.strokeStyle = "#ffffff";
		// gl.lineWidth = 2;
		// gl.strokeRect(x, y, hudWidth, hudHeight);

		// // Score information
		// gl.fillStyle = "#ffffff";
		// gl.font = "18px Arial";
		// gl.fillText(`Score: ${this.game.gameStats.score}`, x + 10, y + 25);
		// gl.fillText(
		// 	`Enemies: ${this.game.gameStats.enemiesDefeated}`,
		// 	x + 10,
		// 	y + 50
		// );
		// gl.fillText(`Coins: ${this.game.character.coins}`, x + 10, y + 75);

		// gl.restore();
		// gl.save();
	}
}

// export default class HUD {
//     constructor(game) {
//         this.game = game;
//     }

//     draw(gl, canvas) {
//         // Background for HUD
//         gl.save();
//         gl.fillStyle = "rgba(0, 0, 0, 0.7)";
//         gl.fillRect(10, 60, 200, 110);
//         gl.strokeStyle = "#ffffff";
//         gl.lineWidth = 2;
//         gl.strokeRect(10, 60, 200, 110);

//         // Score information
//         gl.fillStyle = "#ffffff";
//         gl.font = "18px Arial";
//         gl.fillText(`Score: ${this.game.gameStats.score}`, 20, 85);
//         gl.fillText(`Enemies: ${this.game.gameStats.enemiesDefeated}`, 20, 115);
//         gl.fillText(`Coins: ${this.game.character.coins}`, 20, 145);
//         gl.fillText(`Level: ${this.game.level}`, 20, 175);

//         gl.restore();
//     }
// }

import OSS from "ali-oss";

const ossClient = new OSS({
	region: process.env.OSS_REGION,
	accessKeyId: process.env.OSS_ACCESS_KEY_ID,
	accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
	bucket: process.env.OSS_BUCKET,
});

const LEADERBOARD_FILE = "leaderboard.json";

export default async function handler(req, res) {
	if (req.method === "GET") {
		// Get leaderboard
		try {
			let leaderboard = [];
			try {
				const result = await ossClient.get(LEADERBOARD_FILE);
				leaderboard = JSON.parse(result.content.toString());
			} catch (err) {
				if (err.code === "NoSuchKey") {
					await ossClient.put(
						LEADERBOARD_FILE,
						Buffer.from(JSON.stringify([]))
					);
				} else {
					throw err;
				}
			}
			leaderboard.sort((a, b) => b.score - a.score);
			const top10 = leaderboard.slice(0, 10);
			res.status(200).json(top10);
		} catch (error) {
			console.error("Error getting leaderboard:", error);
			res.status(500).send("Failed to retrieve leaderboard");
		}
	} else if (req.method === "POST") {
		// Submit a new score
		try {
			const { playerName, score, level, enemiesDefeated, coinsCollected } =
				req.body;

			if (!playerName || typeof score !== "number") {
				return res.status(400).send("Invalid score data");
			}

			const newScore = {
				id: Date.now().toString() + Math.random().toString(36).slice(2),
				playerName,
				score,
				level: level || 1,
				enemiesDefeated: enemiesDefeated || 0,
				coinsCollected: coinsCollected || 0,
				timestamp: Date.now(),
			};

			let leaderboard = [];
			try {
				const result = await ossClient.get(LEADERBOARD_FILE);
				leaderboard = JSON.parse(result.content.toString());
			} catch (err) {
				if (err.code !== "NoSuchKey") throw err;
			}

			leaderboard.push(newScore);
			leaderboard.sort((a, b) => b.score - a.score);
			await ossClient.put(
				LEADERBOARD_FILE,
				Buffer.from(JSON.stringify(leaderboard))
			);

			res.status(201).json(newScore);
		} catch (error) {
			console.error("Error submitting score:", error);
			res.status(500).send("Failed to submit score");
		}
	} else {
		res.status(405).send("Method Not Allowed");
	}
}

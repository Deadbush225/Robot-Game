// client-side integration

export default class LeaderboardService {
	constructor(apiUrl = "/api") {
		this.apiUrl = "/api";
	}

	async getLeaderboard() {
		try {
			console.log("Fetching leaderboard from:", `${this.apiUrl}/leaderboard`);
			const response = await fetch(`${this.apiUrl}/leaderboard`);

			if (!response.ok) {
				const errorText = await response.text();
				console.error(
					"Server responded with error:",
					response.status,
					errorText
				);
				throw new Error(
					`Failed to fetch leaderboard: ${response.status} ${errorText}`
				);
			}

			const data = await response.json();
			console.log("Leaderboard data received:", data);
			return data;
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
			return [];
		}
	}

	async submitScore(scoreData) {
		try {
			const response = await fetch(`${this.apiUrl}/leaderboard`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(scoreData),
			});

			if (!response.ok) throw new Error("Failed to submit score");
			return await response.json();
		} catch (error) {
			console.error("Error submitting score:", error);
			return null;
		}
	}
}

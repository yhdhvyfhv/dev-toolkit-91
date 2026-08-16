type GameService = {
    startGame: (gameId: string) => void;
    endGame: (gameId: string, score: number) => void;
    getGameStatus: (gameId: string) => string;
};

class GameManager implements GameService {
    private games: Record<string, { status: string; score: number }> = {};

    startGame(gameId: string): void {
        this.games[gameId] = { status: 'running', score: 0 };
        console.log(`Game ${gameId} started.`);
    }

    endGame(gameId: string, score: number): void {
        if (this.games[gameId]) {
            this.games[gameId].status = 'ended';
            this.games[gameId].score = score;
            console.log(`Game ${gameId} ended with score: ${score}.`);
        } else {
            console.log(`Game ${gameId} not found.`);
        }
    }

    getGameStatus(gameId: string): string {
        return this.games[gameId]?.status || 'not found';
    }
}

const gameService = new GameManager();
gameService.startGame('level1');
gameService.endGame('level1', 100);
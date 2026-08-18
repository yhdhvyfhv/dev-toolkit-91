import { GameEvent, Player } from './types';

export class GameService {
    private players: Player[] = [];

    public addPlayer(player: Player): void {
        this.players.push(player);
        this.broadcastEvent('player-added', player);
    }

    public removePlayer(playerId: string): void {
        this.players = this.players.filter(player => player.id !== playerId);
        this.broadcastEvent('player-removed', { id: playerId });
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    private broadcastEvent(eventName: string, payload: any): void {
        // Imagine this method sends events to clients
        console.log(`Broadcasting: ${eventName}`, payload);
    }
}

const gameService = new GameService();
export default gameService;

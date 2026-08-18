import { GameState, Player } from './types';

class GameService {
  private state: GameState;

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  public addPlayer(player: Player): void {
    if (!this.state.players.some(p => p.id === player.id)) {
      this.state.players.push(player);
    }
  }

  public removePlayer(playerId: string): void {
    this.state.players = this.state.players.filter(p => p.id !== playerId);
  }

  public startGame(): void {
    if (!this.state.isRunning) {
      this.state.isRunning = true;
      this.state.startTime = new Date();
    }
  }

  public endGame(): void {
    if (this.state.isRunning) {
      this.state.isRunning = false;
      this.state.endTime = new Date();
    }
  }

  public getCurrentState(): GameState {
    return this.state;
  }
}

export default GameService;

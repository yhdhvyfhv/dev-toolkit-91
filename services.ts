export interface Player {  id: string;  name: string;  health: number;  score: number;}

export class GameService {  private players: Player[] = [];

  addPlayer(player: Player): void {    this.players.push(player);  }

  removePlayer(playerId: string): boolean {    const index = this.players.findIndex(player => player.id === playerId);    if (index !== -1) {      this.players.splice(index, 1);      return true;    }    return false;  }

  getPlayerScore(playerId: string): number | null {    const player = this.players.find(player => player.id === playerId);    return player ? player.score : null;  }

  updatePlayerHealth(playerId: string, health: number): boolean {    const player = this.players.find(player => player.id === playerId);    if (player) {      player.health = health;      return true;    }    return false;  }

  getAllPlayers(): Player[] {    return this.players;  }}
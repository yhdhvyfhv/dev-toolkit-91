export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameSession {
  id: string;
  players: Player[];
  status: 'waiting' | 'active' | 'ended';
}

class PlayerManager {
  private players: Map<string, Player> = new Map();

  createPlayer(name: string): Player {
    const id = `player_${Date.now()}`;
    const player: Player = { id, name, score: 0 };
    this.players.set(id, player);
    return player;
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  addScore(id: string, points: number): void {
    const player = this.players.get(id);
    if (player) {
      player.score += points;
    }
  }
}

class SessionManager {
  private sessions: Map<string, GameSession> = new Map();
  private playerManager: PlayerManager;

  constructor(playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  createSession(playerNames: string[]): GameSession {
    const id = `session_${Date.now()}`;
    const players = playerNames.map(name => this.playerManager.createPlayer(name));
    const session: GameSession = { id, players, status: 'waiting' };
    this.sessions.set(id, session);
    return session;
  }

  startSession(id: string): GameSession | undefined {
    const session = this.sessions.get(id);
    if (session) {
      session.status = 'active';
    }
    return session;
  }

  endSession(id: string): GameSession | undefined {
    const session = this.sessions.get(id);
    if (session) {
      session.status = 'ended';
      const total = session.players.reduce((sum, p) => sum + p.score, 0);
      session.players.forEach(p => {
        p.score = Math.floor(total / session.players.length);
      });
    }
    return session;
  }
}

export const playerManager = new PlayerManager();
export const sessionManager = new SessionManager(playerManager);
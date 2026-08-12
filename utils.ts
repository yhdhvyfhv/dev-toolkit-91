type GameData = { id: number; name: string; score: number; date: string; };

const sortByDate = (data: GameData[]): GameData[] => {
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const filterByScore = (data: GameData[], minScore: number): GameData[] => {
    return data.filter(game => game.score >= minScore);
};

const aggregateScores = (data: GameData[]): number => {
    return data.reduce((total, game) => total + game.score, 0);
};

const formatGameData = (data: GameData[]): string => {
    return JSON.stringify(data, null, 2);
};

export { sortByDate, filterByScore, aggregateScores, formatGameData, GameData };
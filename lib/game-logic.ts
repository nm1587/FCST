export interface GameState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    step: 'initial' | 'predicted' | 'result';
    prediction?: 'UP' | 'DOWN';
    entryPrice?: number;
    entryTime?: number;
}

export const GAME_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function calculateResult(entryPrice: number, currentPrice: number, prediction: 'UP' | 'DOWN'): boolean {
    if (prediction === 'UP') {
        return currentPrice > entryPrice;
    } else {
        return currentPrice < entryPrice;
    }
}

export function getTimeRemaining(entryTime: number): number {
    const elapsed = Date.now() - entryTime;
    return Math.max(0, GAME_DURATION_MS - elapsed);
}

export function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

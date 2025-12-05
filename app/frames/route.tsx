import { createFrames, Button } from "frames.js/next";
import { getBTCPrice } from "@/lib/price-service";
import { getBaseGasPrice } from "@/lib/base-client";
import { GameState, calculateResult, getTimeRemaining, formatTime } from "@/lib/game-logic";

const frames = createFrames({
    basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentState: any = (ctx.state as any) || { step: 'initial' };
    const currentPrice = await getBTCPrice();
    const gasPrice = await getBaseGasPrice();
    const gasPriceGwei = Number(gasPrice) / 1e9;

    // Handle Initial Step
    if (currentState.step === 'initial') {
        return {
            image: (
                <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900 text-white">
                    <div className="text-6xl font-bold mb-4">BTC 涨跌预测</div>
                    <div className="text-4xl">当前价格: ${currentPrice.toLocaleString()}</div>
                    <div className="text-2xl mt-4 text-green-400">Base Gas: {gasPriceGwei.toFixed(2)} Gwei</div>
                    <div className="text-2xl mt-8 text-slate-400">预测 5 分钟后的价格走势</div>
                </div>
            ),
            buttons: [
                <Button action="post" target={{ query: { prediction: 'UP' } }} key="up">
                    📈 看涨 (UP)
                </Button>,
                <Button action="post" target={{ query: { prediction: 'DOWN' } }} key="down">
                    📉 看跌 (DOWN)
                </Button>,
            ],
            state: { step: 'initial' },
        };
    }

    // Handle Prediction Step (Transition from Initial)
    const prediction = ctx.searchParams?.prediction;
    if (currentState.step === 'initial' && prediction) {
        const predValue = prediction as 'UP' | 'DOWN';
        const newState: GameState = {
            step: 'predicted',
            prediction: predValue,
            entryPrice: currentPrice,
            entryTime: Date.now(),
        };

        return {
            image: (
                <div className="flex flex-col items-center justify-center w-full h-full bg-blue-900 text-white">
                    <div className="text-5xl font-bold mb-4">预测已记录!</div>
                    <div className="text-3xl">方向: {predValue === 'UP' ? '📈 看涨' : '📉 看跌'}</div>
                    <div className="text-3xl mt-2">入场价: ${currentPrice.toLocaleString()}</div>
                    <div className="text-2xl mt-8">请在 5 分钟后回来查看结果</div>
                </div>
            ),
            buttons: [
                <Button action="post" key="refresh">
                    🔄 刷新 / 查看结果
                </Button>,
            ],
            state: newState,
        };
    }

    // Handle Waiting / Result Step
    if (currentState.step === 'predicted') {
        const remaining = getTimeRemaining(currentState.entryTime!);

        if (remaining > 0) {
            // Still waiting
            return {
                image: (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-800 text-white">
                        <div className="text-5xl font-bold mb-4">等待结果...</div>
                        <div className="text-4xl font-mono">{formatTime(remaining)}</div>
                        <div className="text-2xl mt-4">入场价: ${currentState.entryPrice?.toLocaleString()}</div>
                        <div className="text-2xl">当前价: ${currentPrice.toLocaleString()}</div>
                        <div className="text-xl mt-4 text-yellow-400">
                            目标: {currentState.prediction === 'UP' ? '>' : '<'} ${currentState.entryPrice?.toLocaleString()}
                        </div>
                    </div>
                ),
                buttons: [
                    <Button action="post" key="refresh-wait">
                        {`🔄 刷新 (${formatTime(remaining)})`}
                    </Button>,
                ],
                state: currentState,
            };
        } else {
            // Time is up, show result
            const won = calculateResult(currentState.entryPrice!, currentPrice, currentState.prediction!);

            return {
                image: (
                    <div className={`flex flex-col items-center justify-center w-full h-full ${won ? 'bg-green-900' : 'bg-red-900'} text-white`}>
                        <div className="text-6xl font-bold mb-4">{won ? '🎉 恭喜获胜!' : '😢 遗憾惜败'}</div>
                        <div className="text-3xl">入场价: ${currentState.entryPrice?.toLocaleString()}</div>
                        <div className="text-3xl">结算价: ${currentPrice.toLocaleString()}</div>
                        <div className="text-2xl mt-4">
                            {won ? '你预测正确！' : '预测方向错误'}
                        </div>
                    </div>
                ),
                buttons: [
                    <Button action="post" target={{ query: { reset: 'true' } }} key="reset">
                        🎮 再玩一次
                    </Button>,
                ],
                state: { step: 'result' },
            };
        }
    }

    // Handle Reset
    if (currentState.step === 'result' || ctx.searchParams?.reset) {
        return {
            image: (
                <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900 text-white">
                    <div className="text-6xl font-bold mb-4">BTC 涨跌预测</div>
                    <div className="text-4xl">当前价格: ${currentPrice.toLocaleString()}</div>
                    <div className="text-2xl mt-4 text-green-400">Base Gas: {gasPriceGwei.toFixed(2)} Gwei</div>
                    <div className="text-2xl mt-8 text-slate-400">预测 5 分钟后的价格走势</div>
                </div>
            ),
            buttons: [
                <Button action="post" target={{ query: { prediction: 'UP' } }} key="up-reset">
                    📈 看涨 (UP)
                </Button>,
                <Button action="post" target={{ query: { prediction: 'DOWN' } }} key="down-reset">
                    📉 看跌 (DOWN)
                </Button>,
            ],
            state: { step: 'initial' },
        };
    }

    return {
        image: (<div>Error</div>),
        buttons: [<Button action="post" key="error-reset">Reset</Button>]
    }
});

export const GET = handleRequest;
export const POST = handleRequest;

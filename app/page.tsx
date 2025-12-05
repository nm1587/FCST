import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import Link from "next/link";
import { getBTCPrice } from "@/lib/price-service";
import { getBaseGasPrice } from "@/lib/base-client";
import WarpcastLink from "./components/WarpcastLink";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "FCST",
    description: "Predict BTC price movement in the next 5 minutes!",
    other: {
      ...(await fetchMetadata(
        new URL("/frames", process.env.NEXT_PUBLIC_HOST || "http://localhost:3000")
      )),
    },
  };
}

export default async function Page() {
  const currentPrice = await getBTCPrice();
  const gasPrice = await getBaseGasPrice();
  const gasPriceGwei = Number(gasPrice) / 1e9;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-100">
      <main className="flex flex-col items-center justify-center flex-1 px-4 text-center max-w-4xl w-full">
        <h1 className="text-5xl font-bold mb-8 text-slate-900">
          Welcome to <span className="text-blue-600">FCST</span>
        </h1>

        {/* Frame Preview Card */}
        <div className="w-full max-w-[600px] aspect-[1.91/1] bg-slate-900 text-white rounded-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 mb-8 border-4 border-slate-800">
          <div className="text-4xl md:text-5xl font-bold mb-4">BTC 涨跌预测</div>
          <div className="text-2xl md:text-3xl">当前价格: ${currentPrice.toLocaleString()}</div>
          <div className="text-xl md:text-2xl mt-3 text-green-400">Base Gas: {gasPriceGwei.toFixed(2)} Gwei</div>
          <div className="text-lg md:text-xl mt-6 text-slate-400">预测 5 分钟后的价格走势</div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[600px]">
          <div className="grid grid-cols-2 gap-4">
            <button className="px-6 py-3 bg-slate-700 text-white rounded-lg cursor-not-allowed opacity-80">
              📈 看涨 (UP)
            </button>
            <button className="px-6 py-3 bg-slate-700 text-white rounded-lg cursor-not-allowed opacity-80">
              📉 看跌 (DOWN)
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            (This is a preview. To play, use the link below)
          </p>

          <WarpcastLink />

          <div className="text-left bg-white p-6 rounded-lg shadow-md mt-8">
            <h3 className="font-bold text-lg mb-2">How to Publish:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Deploy this project to <strong>Vercel</strong>.</li>
              <li>Copy your Vercel URL (e.g., <code>https://fcst.vercel.app</code>).</li>
              <li>Paste the URL into a new Cast on <strong>Warpcast</strong>.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

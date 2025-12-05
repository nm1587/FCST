import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import Link from "next/link";

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

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <Link className="text-blue-600" href="/">FCST</Link>
        </h1>
        <p className="mt-3 text-2xl">
          Paste this URL into Warpcast to play!
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <a
            href="https://warpcast.com/~/developers/frames?url=http%3A%2F%2Flocalhost%3A3000%2Fframes"
            target="_blank"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Open in Warpcast Playground (Requires Public URL)
          </a>
          <p className="text-sm text-gray-500">
            Note: To test on Warpcast, you need to expose your localhost (e.g., using ngrok).
          </p>
        </div>
      </main>
    </div>
  );
}

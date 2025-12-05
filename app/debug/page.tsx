import { createFrames } from "frames.js/next";

export default async function Debug() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Debug Frame</h1>
            <p className="mb-4">
                To debug this frame, you can use the
                <a href="https://warpcast.com/~/developers/frames" target="_blank" className="text-blue-600 underline ml-1">
                    Warpcast Developer Playground
                </a>.
            </p>
            <p>
                Enter your URL: <code className="bg-gray-100 p-1 rounded">http://localhost:3000/frames</code>
            </p>
            <div className="mt-4 p-4 bg-yellow-100 rounded">
                <strong>Note:</strong> You may need to use a tunneling service like ngrok to expose your localhost to the internet if the playground cannot access localhost directly.
            </div>
        </div>
    );
}

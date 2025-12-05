"use client";

import { useEffect, useState } from "react";

export default function WarpcastLink() {
    const [url, setUrl] = useState("");

    useEffect(() => {
        // Get the current window URL (e.g., https://fcst.vercel.app or http://localhost:3000)
        const currentHost = window.location.origin;
        const frameUrl = `${currentHost}/frames`;
        const playgroundUrl = `https://warpcast.com/~/developers/frames?url=${encodeURIComponent(frameUrl)}`;
        setUrl(playgroundUrl);
    }, []);

    if (!url) return null;

    const isLocalhost = url.includes("localhost");

    return (
        <div className="flex flex-col gap-2">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-purple-600 text-white text-xl font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                🚀 Play in Warpcast
            </a>
            {isLocalhost && (
                <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded border border-red-200">
                    ⚠️ Warning: You are on localhost. Warpcast cannot see your local computer.
                    Please deploy to Vercel or use ngrok to test.
                </p>
            )}
        </div>
    );
}

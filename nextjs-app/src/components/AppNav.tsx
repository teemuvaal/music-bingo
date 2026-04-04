"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AppNav({ user }: { user: string }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/app"
          className="flex items-center gap-2 font-bold text-purple-900"
        >
          <span className="text-xl">🎵</span>
          Music Bingo
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Signed in as <span className="font-medium text-gray-700">{user}</span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

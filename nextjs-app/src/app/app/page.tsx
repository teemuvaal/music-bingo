"use client";

import { useState, useRef, useCallback } from "react";
import { parseCsv, generateCards, BingoCard, Song, DisplayMode } from "@/lib/bingo";
import BingoCardComponent from "@/components/BingoCard";

type Params = {
  numCards: number;
  gridSize: number;
  poolSize: number;
  displayMode: DisplayMode;
};

const DEFAULT_PARAMS: Params = {
  numCards: 15,
  gridSize: 4,
  poolSize: 100,
  displayMode: "artist",
};

export default function AppPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const [cards, setCards] = useState<BingoCard[]>([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCsv(text);
        if (parsed.length === 0) {
          setError("No songs found in the CSV. Check the file format.");
          return;
        }
        setSongs(parsed);
        setCards([]);
        setParams((p) => ({ ...p, poolSize: Math.min(p.poolSize, parsed.length) }));
      } catch {
        setError("Failed to parse CSV. Make sure it's a valid file.");
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleGenerate = () => {
    setError("");
    try {
      const generated = generateCards(songs, params);
      setCards(generated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    }
  };

  const handlePrint = () => window.print();

  const cellsPerCard = params.gridSize * params.gridSize;
  const canGenerate = songs.length >= cellsPerCard;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bingo Card Generator</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload a Spotify playlist CSV, configure your cards, and generate.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left panel: upload + config */}
        <div className="lg:col-span-1 space-y-5">

          {/* Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              1. Upload CSV
            </h2>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragging
                  ? "border-purple-400 bg-purple-50"
                  : songs.length > 0
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              {songs.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-2xl">✅</div>
                  <p className="text-sm font-medium text-green-700">{fileName}</p>
                  <p className="text-xs text-green-600">{songs.length} songs loaded</p>
                  <p className="text-xs text-gray-400 mt-2">Click to replace</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-3xl text-gray-300">📂</div>
                  <p className="text-sm font-medium text-gray-600">
                    Drop CSV here or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports Exportify (Spotify) CSV format
                  </p>
                </div>
              )}
            </div>

            {songs.length > 0 && (
              <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Songs available</span>
                  <span className="font-semibold text-gray-700">{songs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>First song</span>
                  <span className="font-semibold text-gray-700 truncate ml-2 max-w-[140px]" title={songs[0].track}>
                    {songs[0].track}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Parameters */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
              2. Configure
            </h2>

            <div className="space-y-4">
              {/* Number of cards */}
              <ParamRow
                label="Number of cards"
                hint={`Generate ${params.numCards} unique bingo cards`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={params.numCards}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, numCards: Number(e.target.value) }))
                    }
                    className="flex-1 accent-purple-600"
                  />
                  <NumBadge>{params.numCards}</NumBadge>
                </div>
              </ParamRow>

              {/* Grid size */}
              <ParamRow
                label="Grid size"
                hint={`${params.gridSize}×${params.gridSize} = ${cellsPerCard} cells per card`}
              >
                <div className="flex gap-2">
                  {[3, 4, 5].map((g) => (
                    <button
                      key={g}
                      onClick={() => setParams((p) => ({ ...p, gridSize: g }))}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                        params.gridSize === g
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      {g}×{g}
                    </button>
                  ))}
                </div>
              </ParamRow>

              {/* Pool size */}
              <ParamRow
                label="Song pool size"
                hint={`Pick from the first ${params.poolSize} songs in the CSV`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={cellsPerCard}
                    max={Math.max(songs.length || 200, cellsPerCard)}
                    value={Math.max(params.poolSize, cellsPerCard)}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, poolSize: Number(e.target.value) }))
                    }
                    className="flex-1 accent-purple-600"
                  />
                  <NumBadge>{params.poolSize}</NumBadge>
                </div>
              </ParamRow>

              {/* Display mode */}
              <ParamRow label="Display mode" hint="What to show in each cell">
                <div className="flex gap-2 flex-wrap">
                  {(["artist", "song", "both"] as DisplayMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setParams((p) => ({ ...p, displayMode: mode }))}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border capitalize transition-colors ${
                        params.displayMode === mode
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </ParamRow>
            </div>
          </div>

          {/* Generate button */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              3. Generate
            </h2>

            {!canGenerate && songs.length > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                Need at least {cellsPerCard} songs in pool for a {params.gridSize}×{params.gridSize} grid.
              </p>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Generate {params.numCards} Cards
            </button>

            {cards.length > 0 && (
              <button
                onClick={handlePrint}
                className="mt-3 w-full border border-gray-300 hover:border-purple-300 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                🖨️ Print / Save as PDF
              </button>
            )}
          </div>
        </div>

        {/* Right panel: cards preview */}
        <div className="lg:col-span-2">
          {cards.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl border-2 border-dashed border-gray-200 text-center p-8">
              <div>
                <div className="text-4xl mb-3">🎵</div>
                <p className="text-gray-500 font-medium">
                  Your bingo cards will appear here
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Upload a CSV and click Generate
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                  {cards.length} Cards Generated
                </h2>
                <button
                  onClick={handleGenerate}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Regenerate
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-6">
                {cards.map((card) => (
                  <BingoCardComponent
                    key={card.id}
                    card={card}
                    gridSize={params.gridSize}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Song list preview */}
      {songs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">
              Song List Preview
            </h2>
            <span className="text-xs text-gray-500">{songs.length} total</span>
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium w-12">#</th>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Track</th>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Artist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {songs.slice(0, 50).map((song, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400">{song.num}</td>
                    <td className="px-4 py-2 text-gray-800 font-medium">{song.track}</td>
                    <td className="px-4 py-2 text-gray-500">{song.artist}</td>
                  </tr>
                ))}
                {songs.length > 50 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center text-gray-400">
                      ... and {songs.length - 50} more songs
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ParamRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">{hint}</span>
      </div>
      {children}
    </div>
  );
}

function NumBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-purple-100 text-purple-700 font-bold text-sm rounded-lg px-2.5 py-1 min-w-[2.5rem] text-center">
      {children}
    </span>
  );
}

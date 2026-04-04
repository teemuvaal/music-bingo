import { BingoCard as BingoCardType } from "@/lib/bingo";

interface Props {
  card: BingoCardType;
  gridSize: number;
}

export default function BingoCard({ card, gridSize }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border print:rounded-none print:break-inside-avoid">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white text-center py-2 px-4">
        <div className="text-xs font-medium uppercase tracking-widest opacity-80">
          Music Bingo
        </div>
        <div className="text-sm font-bold">Card #{card.id}</div>
      </div>

      {/* BINGO letters row */}
      <div
        className="grid border-b border-gray-200"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {BINGO_LETTERS.slice(0, gridSize).map((letter) => (
          <div
            key={letter}
            className="text-center text-xs font-extrabold text-purple-700 py-1 border-r last:border-r-0 border-gray-200 bg-purple-50"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div>
        {card.cells.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid border-b last:border-b-0 border-gray-200"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {row.map((cell, colIdx) => (
              <div
                key={colIdx}
                className="border-r last:border-r-0 border-gray-200 p-1.5 text-center flex flex-col items-center justify-center gap-0.5 min-h-[60px]"
              >
                <span className="text-[10px] font-bold text-purple-500 leading-none">
                  {cell.num}
                </span>
                <span
                  className="text-[10px] leading-tight text-gray-800 font-medium break-words w-full text-center"
                  style={{ wordBreak: "break-word" }}
                >
                  {cell.label.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const BINGO_LETTERS = ["B", "I", "N", "G", "O", "X", "Y", "Z"];

import { BingoCard as BingoCardType } from "@/lib/bingo";

interface Props {
  card: BingoCardType;
  gridSize: number;
}

export default function BingoCard({ card, gridSize }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border-2 print:border-gray-800 print:rounded-none print:break-inside-avoid">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 print:bg-none print:bg-purple-800 text-white text-center py-2 px-4 print:py-3">
        <div className="text-xs font-medium uppercase tracking-widest opacity-80 print:text-sm print:opacity-100">
          Music Bingo
        </div>
        <div className="text-sm font-bold print:text-lg">Card #{card.id}</div>
      </div>

      {/* Grid */}
      <div>
        {card.cells.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid border-b last:border-b-0 border-gray-200 print:border-gray-800"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {row.map((cell, colIdx) => (
              <div
                key={colIdx}
                className="border-r last:border-r-0 border-gray-200 print:border-gray-800 p-1.5 print:p-2 text-center flex flex-col items-center justify-center gap-0.5 min-h-[60px] print:min-h-[72px]"
              >
                <span className="text-[10px] print:text-[11px] font-bold text-purple-500 print:text-gray-500 leading-none">
                  {cell.num}
                </span>
                <span
                  className="text-[10px] print:text-[11px] leading-tight text-gray-800 font-medium break-words w-full text-center"
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


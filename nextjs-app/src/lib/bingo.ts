export type Song = {
  num: number;
  track: string;
  artist: string;
};

export type BingoCard = {
  id: number;
  cells: BingoCell[][];
};

export type BingoCell = {
  num: number;
  label: string;
};

export type DisplayMode = "artist" | "song" | "both";

export type GeneratorParams = {
  numCards: number;
  gridSize: number; // e.g. 4 means 4x4
  poolSize: number; // how many songs to sample from
  displayMode: DisplayMode;
};

export function parseCsv(raw: string): Song[] {
  const lines = raw.trim().split("\n");
  const songs: Song[] = [];

  // Detect delimiter and find header
  const firstLine = lines[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";

  // Check if first line looks like a header
  const firstLower = firstLine.toLowerCase();
  const headerIndex = firstLower.includes("track") || firstLower.includes("song") || firstLower.includes("artist") ? 0 : -1;

  // Find column indices from header if present
  // Exportify defaults: col 0 = Spotify ID, col 1 = Track Name, col 2 = Artist IDs, col 3 = Artist Name(s)
  let numCol = 0, trackCol = 1, artistCol = 3;
  if (headerIndex === 0) {
    const headers = firstLine.split(delimiter).map((h) => h.trim().toLowerCase().replace(/"/g, ""));
    // Try to find by name
    const numIdx = headers.findIndex((h) => h === "num" || h === "#" || h === "number");
    const trackIdx = headers.findIndex((h) => h.includes("track") || h.includes("title") || h.includes("song"));
    // Prefer "artist name(s)" over "artist id/uri" columns
    let artistIdx = headers.findIndex((h) => h.includes("artist") && h.includes("name"));
    if (artistIdx === -1) {
      artistIdx = headers.findIndex((h) => h.includes("artist") && !h.includes("id") && !h.includes("uri") && !h.includes("url"));
    }
    if (artistIdx === -1) {
      artistIdx = headers.findIndex((h) => h.includes("artist"));
    }
    if (numIdx !== -1) numCol = numIdx;
    if (trackIdx !== -1) trackCol = trackIdx;
    if (artistIdx !== -1) artistCol = artistIdx;
  }

  const startLine = headerIndex === 0 ? 1 : 0;

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = splitCsvLine(line, delimiter);
    if (cols.length < 2) continue;

    const rawTrack = (cols[trackCol] ?? "").replace(/"/g, "").trim();
    const rawArtist = (cols[artistCol] ?? "").replace(/"/g, "").trim();
    const rawNum = (cols[numCol] ?? "").replace(/"/g, "").trim();

    if (!rawTrack && !rawArtist) continue;

    songs.push({
      num: parseInt(rawNum) || i - startLine + 1,
      track: rawTrack || `Song ${i}`,
      artist: rawArtist || "Unknown",
    });
  }

  return songs;
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function sampleWithoutReplacement<T>(arr: T[], n: number): T[] {
  const pool = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

export function generateCards(songs: Song[], params: GeneratorParams): BingoCard[] {
  const { numCards, gridSize, poolSize, displayMode } = params;
  const cellsPerCard = gridSize * gridSize;

  // Use a pool of songs (capped at available songs)
  const pool = songs.slice(0, Math.min(poolSize, songs.length));

  if (pool.length < cellsPerCard) {
    throw new Error(
      `Not enough songs: need at least ${cellsPerCard} songs in the pool, but only have ${pool.length}.`
    );
  }

  const cards: BingoCard[] = [];

  for (let i = 0; i < numCards; i++) {
    const selected = sampleWithoutReplacement(pool, cellsPerCard);
    const cells: BingoCell[][] = [];

    for (let row = 0; row < gridSize; row++) {
      const rowCells: BingoCell[] = [];
      for (let col = 0; col < gridSize; col++) {
        const song = selected[row * gridSize + col];
        let label = "";
        if (displayMode === "artist") {
          label = song.artist;
        } else if (displayMode === "song") {
          label = song.track;
        } else {
          label = `${song.track}\n${song.artist}`;
        }
        rowCells.push({ num: song.num, label });
      }
      cells.push(rowCells);
    }

    cards.push({ id: i + 1, cells });
  }

  return cards;
}

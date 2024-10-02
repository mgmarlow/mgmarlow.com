---
title: Building Chess
date: 2024-10-02
---

The past month I've been obsessed with chess, so much so that I've
started building my own tactics puzzle app. Starting the project
full of ambition and lacking in common sense, I built the whole
thing from the ground up, programming my own Chess engine and
board representation.

It turns out that the world of Chess programming is full of interesting
ideas.

## Board representation

The core of a Chess engine are its pieces, each of which needs to
be stored in some data structure so that we can figure out white and
black positions and all of the permutations of valid moves. The chosen
data structure breaks down into the following options:

- 2D array: conceptually the simplest, store each piece in a 2D array
  with 64 entries, `Piece[8][8]`. Checking whether there's a piece on
  a square is as easy as `piece = piece[file][rank]`.

- 1D array: condense the 2D array into a single array with 64 entries.
  A little indexing arithemetic allows converting between a 0-64 index
  and a given rank/file.

- 64-bit unsigned integers (bitboards): conveniently the entire board state
  of a Chess game can be represented in a 64-bit unsigned integer, where
  each bit represents whether or not a square contains a piece. The entire
  board representation exists as several 64-bit integers, each one
  representing a piece type and color. These integers are called
  [bitboards](https://www.chessprogramming.org/Bitboards).

For my initial implementation I leaned towards bitboards, where
the mechanics of bit arithmetic solve a lot of the complications of
move calcluation. However, after exploring the idea in my JavaScript
implementation (where all numbers are represented as 64-bit floats),
I found myself biting off more than I could chew. I finally settled on
the 1D approach, which was convenient and easy to implement.

The engine takes a
[FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
string and deserializes it into a 64-length array, which each piece is
represented by it's algebraic string:

```js
// Initial board state as FEN
const FEN_EX =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Pieces are stored in standard algebraic notation.
const isPiece = (p) => /[pnbrqk]/i.test(p);

// Empty squares are stored as ".".
const isEmpty = (p) => p === ".";

// Parsing FEN is an exercise left to the reader.
const parseFEN = (source) => { ... }

class Chess {
  constructor(fen) {
    // ["r", "n", "b", ...]
    this._squares = parseFEN(fen).squares;
  }
}
```

When actually rendering the board to the browser, it's convenient
to convert the 1D board representation into a 2D array so that rank
and file are clearly accessible.

Converting from a rank and file to an index looks like this:

```txt
index = rank * 8 + file
```

The opposite conversions never come up thanks to a constant, `SQUARES`,
that lists out every board square in algebraic notation:

```js
const SQUARES = [
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  // ...
];

// e.g.
const square = SQUARES[idx];
const file = square[0];
const rank = square[1];
```

Putting the two together allows the Chess engine to convert from the
1D data structure used internally to a 2D data structure used during
rendering.

```js
class Chess {
  // ---snip
  get squares() {
    const result = [];

    for (let rank = 0; rank < 8; rank++) {
      const row = [];

      for (let file = 0; file < 8; file++) {
        const idx = rank * 8 + file;

        const piece = this._squares[idx] === "."
          ? null
          : this._squares[idx];

        row.push({
          piece,
          square: SQUARES[idx]
        });
      }

      result.push(row);
    }

    // [{ piece: "r", square: "a8" }, ...]
    return result;
  }
}
```

## Flipping board orientation

One thing that's really clever about this method of rendering is
that flipping the board to suit the player orientation is a simple
formula change. Moves that flow in and out of the Chess engine
are completely independent of board orientation and rendering. A
given move may look like "e4", "move the pawn on e2 to square e4".
From the board state's perspective, nothing about this move is
different from the white player or the black player.

All the Chess engine need do to is change the index calcluation
in `#squares`:

```js
const getIndex = (orientation) => {
  if (orientation === "w") {
    return rank * 8 + file;
  } else {
    return (7 - rank) * 8 + (7 - file);
  }
}
```

## Mailboxes and out-of-bounds calculation

## Move calculation

It's way easier to calculate every available move from a given board state
than it is to calculate moves JIT. That data is frequently accessed within
a single turn.

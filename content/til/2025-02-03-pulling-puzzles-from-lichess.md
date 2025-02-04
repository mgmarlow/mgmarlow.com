---
title: Pulling Puzzles from Lichess
date: 2025-02-03
---

[Lichess](https://lichess.org) is an awesome website, made even more awesome by
the fact that it is free and open source. Perhaps lesser known is that the
entire Lichess puzzle database is available for free download under the Creative
Commons CC0 license. Every puzzle that you normally find under
[lichess.org/training](https://lichess.org/training) is available for your
perusal.

This is a quick guide for pulling that CSV and seeding a SQLite database so you
can do something cool with it. You will need
[zstd](https://github.com/facebook/zstd).

First, `wget` the file from
[Lichess.org open database](https://database.lichess.org/#puzzles) and save it
into a temporary directory. Run `zstd` to uncompress it into a CSV that we can
read via Ruby.

```sh
wget https://database.lichess.org/lichess_db_puzzle.csv.zst -P tmp/
zstd -d tmp/lichess_db_puzzle.csv.zst
```

CSV pulled down and uncompressed, it's time to read it into the application. I'm
using Ruby on Rails, so I generate a database model like so:

```txt
bin/rails g model Puzzle \
  puzzle_id:string fen:string moves:string rating:integer \
  rating_deviation:integer popularity:integer nb_plays:integer \
  themes:string game_url:string opening_tags:string
```

Which creates the following migration:

```rb
class CreatePuzzles < ActiveRecord::Migration
  def change
    create_table :puzzles do |t|
      t.string :puzzle_id
      t.string :fen
      t.string :moves
      t.integer :rating
      t.integer :rating_deviation
      t.integer :popularity
      t.integer :nb_plays
      t.string :themes
      t.string :game_url
      t.string :opening_tags

      t.timestamps
    end
  end
end
```

A separate seed script pulls items from the CSV and bulk-inserts them into
SQLite. I have the following in my `db/seeds.rb`, with a few omitted additions
that check whether or not the puzzles have already been migrated.

```rb
csv_path = Rails.root.join("tmp", "lichess_db_puzzle.csv")
raise "CSV not found" unless File.exist?(csv_path)

buffer = []
buffer_size = 500
flush = ->() do
  Puzzle.insert_all(buffer)
  buffer.clear
end

CSV.foreach(csv_path, headers: true) do |row|
  buffer << {
    puzzle_id: row["PuzzleId"],
    fen: row["FEN"],
    moves: row["Moves"],
    rating: row["Rating"],
    rating_deviation: row["RatingDeviation"],
    popularity: row["Popularity"],
    nb_plays: row["NbPlays"],
    themes: row["Themes"],
    game_url: row["GameUrl"],
    opening_tags: row["OpeningTags"]
  }

  if buffer.count >= buffer_size
    flush.()
  end
end

flush.()
```

And with that you have the entire Lichess puzzle database available at your
fingertips. The whole process takes less than a minute.

```rb
Puzzle.where("rating < 1700").count
# => 3035233
```

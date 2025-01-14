#!/usr/bin/env ruby

require "date"

if ARGV.empty?
  p "Usage: ./scripts/new post-title"
  exit 1
end

original_filename = ARGV[0]
today = Date.today.strftime("%Y-%m-%d")
path = File.join("content/words", "#{today}-#{original_filename}.md")

File.open(path, "w") do |f|
  f.puts "---"
  f.puts "title: REPLACE ME"
  f.puts "date: #{today}"
  f.puts "---"
end

p "Created: #{path}"

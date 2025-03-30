---
title: Ruby and RSS feeds
date: 2025-03-30
---

I've been digging into Ruby's stdlib RSS parser for a side project and am very
impressed by the overall experience. Here's how easy it is to get started:

```rb
require "open-uri"
require "rss"

feed = URI.open("https://jvns.ca/atom.xml") do |raw|
  RSS::Parser.parse(raw)
end
```

That said, doing something interesting with the resulting feed is not quite so
simple.

For one, you can't just support RSS. Atom is a more recent standard used by many
blogs (although I think irrelevant in the world of podcasts). There's about a
50% split in the use of RSS and Atom in the tiny list of feeds that I follow, so
a feed reader must handle both formats.

Adding Atom support introduces an extra branch to our snippet:

```rb
require "open-uri"
require "rss"

URI.open("https://jvns.ca/atom.xml") do |raw|
  feed = RSS::Parser.parse(raw)

  title = case feed
  when RSS::Rss
    feed.channel.title
  when RSS::Atom::Feed
    feed.title.content
  end
end
```

The need for a case statement is kind of frustrating.

On one hand, I understand where the library is coming from in that it's not a
feed-reading gem but an RSS gem, so the parsed methods should exactly match the
intended specification. On the other hand, a common interface for both standards
would be a nice quality of life improvement.

Worse than dealing with competing standards is the fact that not everyone
publishes the content of an article as part of their feed. Many bloggers only
use RSS as a link aggregator that points subscribers to their webpage:

```xml
<rss version="2.0">
  <channel>
    <title>Redacted Blog</title>
    <link>https://www.redacted.io</link>
    <description>This is my blog</description>
    <item>
      <title>Article title goes here</title>
      <link>https://www.redacted.io/this-is-my-blog</link>
      <pubDate>Thu, 25 Jul 2024 00:00:00 GMT</pubDate>
      <!-- No content! -->
    </item>
  </channel>
</rss>
```

How does an RSS reader handle this situation? The solution varies based on the
app. The two I've tested (NetNewsWire and Readwise Reader) manage to include the
entire article content directly in the app (assuming the content isn't paywalled
or hidden behind authentication). I figure they make an HTTP request to the
article URL and scrape the resulting HTML for the article content.

If you've ever used Firefox, there's a feature called
[Reader View](https://support.mozilla.org/en-US/kb/firefox-reader-view-clutter-free-web-pages)
that hides the extraneous content of a webpage and displays its text content
with a minimal, reading-focused stylesheet. The JS library that Firefox uses is
open source on their Github:
[mozilla/readability](https://github.com/mozilla/readability). Depending on your
stack, you could probably feed the HTML result of the feed's matching HTML
webpage and get back a minimal content result to display in a reader app.

On the Ruby side of things there's a handy port called
[ruby-readability](https://github.com/cantino/ruby-readability). Applying that
theory to a practical example looks something like this:

```rb
require "open-uri"
require "rss"
require "ruby-readability"

URI.open("https://jvns.ca/atom.xml") do |raw|
  feed = RSS::Parser.parse(raw)

  url = case feed
  when RSS::Rss
    feed.items.first.link
  when RSS::Atom::Feed
    feed.entries.first.link.href
  end

  # Raw HTML content
  source = URI.parse(url).read
  # Just the article HTML content
  article_content = Readability::Document.new(source).content
end
```

So far the results are good, but I haven't tested it on many blogs.

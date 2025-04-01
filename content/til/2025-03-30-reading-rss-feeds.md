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

The need to handle both standards independently is kind of frustrating.

That said, it does make sense from a library perspective. The RSS gem is
principally concerned with parsing XML per the RSS and Atom standards, returning
objects that correspond one-to-one. Any conveniences for general feed reading
are left to the application.

Wrapping the RSS gem in another class helps encapsulate differences in
standards:

```rb
class FeedReader
  attr_reader :title

  def initialize(url)
    @url = url
  end

  def fetch
    feed = URI.open(@url) { |r| RSS::Parser.parse(r) }

    case feed
    when RSS::Rss
      @title = feed.channel.title
    when RSS::Atom::Feed
      @title = feed.title.content
    end
  end
end
```

Worse than dealing with competing standards is the fact that not everyone
publishes the content of an article as part of their feed. Many bloggers only
use RSS as a link aggregator that points subscribers to their webpage, omitting
the content entirely:

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

How do RSS readers handle this situation? The solution varies based on the app.

The two I've tested, NetNewsWire and Readwise Reader, manage to include the
entire article content in the app, despite the RSS feed omitting it (assuming no
paywalls). My guess is these services make an HTTP request to the source,
scraping the resulting HTML for the article content and ignoring everything
else.

Firefox users are likely familiar with a feature called
[Reader View](https://support.mozilla.org/en-US/kb/firefox-reader-view-clutter-free-web-pages)
that transforms a webpage into its bare-minimum content. All of the layout
elements are removed in favor of highlighting the text of the page. The JS
library that Firefox uses is open source on their Github:
[mozilla/readability](https://github.com/mozilla/readability).

On the Ruby side of things there's a handy port called
[ruby-readability](https://github.com/cantino/ruby-readability) that we can use
to extract omitted article content directly from the associated website:

```rb
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

---
title: A Few Months with Kagi
date: 2024-02-06
---

I've subscribed to [Kagi](https://kagi.com/) for a few months now and
wanted to collect some of my feelings towards it, particularly
addressing whether I think it's worth paying $10/mo for a search
engine. To summarize, yes, I do think Kagi is worth the price. Kagi
performs as good or better than the competition for the majority of
things I search (primarily programming-related) and offers a few
useful features that add to the experience. The fact that it performs
so well without abusing my personal data is quite the achievement.

The thing that got me into Kagi in the first place was this blog post
on [Kagi Small Web](https://blog.kagi.com/small-web). I know, how
surprising that someone who host their own blog is passionate about
finding other small blogs. Jokes aside, I think prioritizing small
blogs in search results is commendable and just generally a cool thing
to do. It clearly demonstrates the niche that Kagi is trying to carve
out as a search engine in a space owned by giants: the search
experience provided by Google is plagued with incentives that make the
web worse and the problems of such incentives are rooted in ads and
SEO.

Whether or not you're willing to pay for Kagi essentially boils down
to whether you think search is important enough to justify the bill,
with one caveat. That caveat is how much your personal data is worth
to you, and how much you're willing to spend to keep it out of the
hands of Google.

To help you figure out how Kagi performs, the rest of this post
provides some of my takeaways for day-to-day features. To put things
into perspective, I average about 1k searches a month and use Kagi
both in a personal and professional environment.

## Search results

Let's start with the search results. The vast majority of my searches
are programming-related, either APIs in programming languages, APIs in
third-party libraries, or documentation resources and higher-level
ideas. In each of these categories I find Kagi provides really
excellent results, particularly when compared to my previous search
engine, DuckDuckGo (DDG).

More often than not, with DDG I would have to use the `!g` bang
to fallback to a Google search when my search was dealing with a
particularly esoteric API. I basically never use `!g` with Kagi.

As a simple example, searching "blank? Rails" in Kagi results in the
following results:

1. A blog post entitled "nil?, empty?, blank? in Ruby on Rails"
1. A StackOverflow post "When to use nil, blank, empty"
1. A [Github file
   link](https://github.com/rails/rails/blob/main/activesupport/lib/active_support/core_ext/object/blank.rb)
   to the Rails repository where the method is defined

Results 1 and 2 are consistent between Kagi and DDG (`#blank?` is a
heavily documented method!). The third result is the exception: Kagi
does a tremendous job returning Github links to implementations
relating to the search query. Rather than prioritizing additional
blogspam (notably Medium and dev.to results are further down the page
for Kagi compared to DDG), Kagi surfaces a source code link to the
code in question.

These source code links are insanely useful! They save me so much time
when my search is too esoteric for general results. Normally I'd have
to (a) search the library (b) go to the library website (c) try to
find the Github link (d) use Github search to find the relevant
file. All of those steps are now baked into one.

For non-link results, Kagi does a good job surfacing relevant Stack
Overflow posts and Github issues or discussions.

## Personalized results

You can "raise" or "lower" certain domains to affect their results in
your search output. It's not totally clear to me how significant this
setting is, but I use it to prioritize `gnu.org` documentation for
Emacs searches and lower Medium or `dev.to` results to avoid
blogspam. There's a nice
[leaderboard](https://kagi.com/stats?stat=leaderboard) that shows you
how other people use this tool.

## Lenses

Lenses are a Kagi feature that I thought I would never use, but given
the right application they're actually pretty helpful. A lens
effectively limits search results to particular domains. For example,
a Hacker News lens would restrict sites in results to
<news.ycombinator.com>.

I actually use that Hacker News lens frequently to track down articles
that I remember seeing, but don't exactly remember the author or
title. I can provide some vague search terms about the content in the
article, filter by my Hacker News lens, and quickly look through a
bunch of submissions that fit the criteria.

## Things kagi does not get right

Image results are good for the first few columns, but very quickly
devolve into complete nonsense. It's actually hilarious how
off-the-rails image searches can get with Kagi. I've shared my results
with friends quite a few times because the results were so outlandish
when compared to the search term that it made for good comedy. This
has improved significantly with a [recent
update](https://kagifeedback.org/d/2793-dec-28-2023-improved-search-results-and-new-extension-for-safari)
but I still go to another source when searching for images.

The universal summarizer is a neat idea but is untrustworthy in very
subtle ways. I primarily use it when summarizing Wikipedia articles
with the shorthand flow: first search Wikipedia (`!w dynamic
programming`), then summarize the link (`!sum
https://en.wikipedia.org/wiki/Dynamic_programming`). Like all LLMs,
the summarizer sounds authoritative but frequently fabricates ideas or
misrepresents certain pieces of information. Perhaps this is less of a
critique of Kagi and more of LLMs in general, but I have barely
touched this feature as a result.

Uptime for Kagi has been generally good, but last month there was a
[five-hour outage](https://status.kagi.com/clrnl9zwl97290beoine8zlvzx)
that was the source of much hand-wringing and consternation. If
anything, this outage demonstrated to me how much I prefer Kagi to
other search engines. The
[postmortem](https://status.kagi.com/clrnl9zwl97290beoine8zlvzx) is
worth a read.

## Should you use Kagi?

todo

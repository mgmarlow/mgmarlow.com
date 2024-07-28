---
title: A Few Months with Kagi
date: 2024-02-06
---

I've subscribed to [Kagi](https://kagi.com/) for a few months now and
wanted to collect some of my feelings towards it, particularly
addressing whether I think it's worth paying $10/mo for a search
engine. To summarize: yes, I do think Kagi is worth the price. Kagi
performs as good or better than the competition for the majority of
things I search (programming stuff and a healthy dose of Emacs) and
offers a few useful features that add to the experience. The fact that
it performs so well without abusing my personal data is quite the
achievement.

The thing that got me into Kagi in the first place was their post
about [Kagi Small Web](https://blog.kagi.com/small-web). It shouldn't
really be surprising that I am passionate about RSS and self-hosted
blogs, you're reading one. What Kagi is doing to help feature small
blogs in their search results is commendable. It clearly demonstrates
the niche that Kagi is trying to carve out as a search engine in a
space owned by giants: the search experience provided by Google is
plagued with incentives that make the web worse and the problems of
such incentives are rooted in ads and SEO.

Whether or not you're willing to pay for Kagi essentially boils down
to whether you think search is important enough to justify the bill,
with a couple caveats. The first caveat is considering what your
personal data is worth to you. The second is whether you think paying
for a service subscription is a better business model than paying with
your eyeballs on a free service that serves ads.

To help you figure out how Kagi performs, the rest of this post
provides some of my takeaways for day-to-day features. To put things
into perspective, I average about 1k searches a month and use Kagi
across all of my devices: home pc, work pc, and phone.

## Search results

Let's start with the search results. The vast majority of my searches
are programming-related, either APIs in programming languages, APIs in
third-party libraries, or documentation resources and higher-level
ideas. In each of these categories I find Kagi provides really
excellent results, particularly when compared to my previous search
engine, DuckDuckGo (DDG).

My DDG use can be summarized by one symbol: `!g`. I had to constantly
redirect my searches to Google to get good results on the first
page. DDG works fine for general searches ("what's this word?", "who's
in this movie?") but I had a really hard time using it when doing
anything technical. With Kagi, I basically never use `!g`.

It's hard to judge "quality of search" without exhaustively comparing
results for certain queries across different search engines, which I
am not going to do. Generally speaking, I'm impressed by Kagi's
highest-priority search results. There seem to be fewer blog-spam
articles from sites like Medium or dev.to (which you can further
exclude, see: [personalized
results](https://help.kagi.com/kagi/features/website-info-personalized-results.html#personalized-results))
and more self-hosted blogs, Stack Overflow posts, and Github
discussions/issues. I am often surprised by the quality of Github
content in Kagi, as many of my queries have been answered by a comment
in a Github discussion or an issue that is near the top of the results
page.

By far my favorite aspect of Kagi search results is the prevalence of
source code links. For example, searching "blank? rails" turns up this
link to [the Github
source](https://github.com/rails/rails/blob/main/activesupport/lib/active_support/core_ext/object/blank.rb)
as the third result.

These source code links are so insanely useful. Normally I'd have to
(a) search the library (b) go to the library website (c) try to find
the Github link (d) use Github search to find the relevant file. Kagi
bakes all of those steps into one. I often use Kagi to search for a
file that I know exists in some Github repository, like "autorun
minitest" and follow the Kagi result rather than going to Github and
using its navigation features.

## Personalized results

I mentioned this in the previous section, but you can "raise",
"lower", or "block" certain domains to affect their results in your
search output. It's not totally clear to me how significant this
setting is, but I use it to prioritize `gnu.org` documentation for
Emacs searches and lower Medium or `dev.to` results to avoid
blogspam. I have noticed that lowered results often sit at the bottom
of the page, so if you're a fan of not seeing any Medium articles or
Quora questions in your top-most results it's a very nice feature.

Kagi also hosts a public
[leaderboard](https://kagi.com/stats?stat=leaderboard) that shows you
how other people use this tool.

## Lenses

Lenses are a Kagi feature that I thought I would never use, but given
the right application they're actually pretty helpful. A lens
effectively limits search results to a particular domain. For example,
a Hacker News lens would restrict results to sites with
<https://news.ycombinator.com>.

I actually use that Hacker News lens frequently to track down articles
that I remember seeing, but don't exactly remember the author or
title. I can provide some vague search terms about the content in the
article, filter by my Hacker News lens, and quickly look through a
bunch of submissions that fit the criteria. I find that the Kagi lens
performs better for this specific use-case than the Hacker News search
on the website.

## Things kagi does not get right

Image results are good for the first few columns, but very quickly
devolve into complete nonsense. It's actually hilarious how
off-the-rails image searches can get with Kagi. I've shared my results
with friends quite a few times because the results were so outlandish
when compared to the search term that it made for good comedy. This
has improved significantly with a [recent
update](https://kagifeedback.org/d/2793-dec-28-2023-improved-search-results-and-new-extension-for-safari)
but I still go to another source when searching images.

The [universal
summarizer](https://help.kagi.com/kagi/api/summarizer.html) is a neat
idea but is untrustworthy in very subtle ways. I primarily use it when
summarizing Wikipedia articles with the shorthand flow: first search
Wikipedia ("!w dynamic programming"), then summarize the link ("!sum
https://en.wikipedia.org/wiki/Dynamic_programming"). Like all LLMs,
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

Yes, give it a go! Kagi outlines [why you might want to pay for
search](https://help.kagi.com/kagi/why-kagi/why-pay-for-search.html)
rather eloquently in its documentation. I echo the philosophical
argument and add that the product itself is compelling.

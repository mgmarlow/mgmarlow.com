---
title: HEY to Fastmail and Back Again
date: 2024-10-05
description: |
  Moving back to HEY from Fastmail. What's changed, and
  why did I make the switch?
---

I've read a few stories about folks moving their email from HEY to Fastmail, but have not seen any in the reverse direction. After two years of Fastmail, I'm moving back to HEY. Here are my thoughts.

For those unacquainted with HEY, the main pitch is (a) screen unknown senders (b) into one of three locations: "Imbox", "The Feed", and "Paper Trail". Senders that are "screened out" are completely blocked, you won't be notified again from that address. For those "screened in", the split inbox offers more than just filters and labels. "The Feed" for example aggregates emails into a continuous reader view that's nice browsing on a weekend morning. There are many [more features](https://www.hey.com/features/) but these two are probably the most important ones.

In my first HEY adventure, I had an `@hey.com` address for $99/yr. My primary motivation was moving away from Gmail and freeing some of my dependence on Google products, which I still maintain is worthwhile. HEY pulled me in with the marketing, but at $99 I wasn't convinced I was receiving enough value for the price tag. When I saw that Fastmail supported [Masked Email](https://1password.com/fastmail/), my mind was made up. Added privacy at half the cost? Yes please.

So I migrated, eating the cost of cycling yet another email address but setting up a custom email domain along the way to future-proof my erratic email exploration tendencies. I followed this [guide from Franco Correa](https://blog.francocorrea.com/posts/moving-from-hey-to-fastmail) to emulate some of the HEY functionality in Fastmail, attempting to hold on to some of the principles that improved my workflow.

Two years later and I'm moving back to HEY.

Why switch back? The decision mostly comes down to the difference in user experience between the two apps. Fastmail feels like a chore to use, especially on iOS where most of my email (and newsletter) reading happens. Here are my two biggest problems:

- I'd often need to close and reopen the Fastmail app because it was stuck on a black screen. Particularly frustrating when on a slow connection because it means going through the whole SPA-style loading animation that can take 10-20 seconds.
- Using contacts + groups as substitutes for "The Feed" and "Paper Trail" is tedious. Email addresses that go into either bucket must first be added to contacts, then edited to include the appropriate filtering group. I honestly can't remember how to do this in the mobile app.

There were also a handful of workflows that I was missing from HEY:

- The ability to merge threads and create collections is incredible when dealing with travel plans. Rather than juggling a bunch of labels for different trips, email threads are neatly organized into one spot for each.
- "Send me push notifications" on an email thread, which will notify me when that thread and only that thread receives replies, is genius.
- I created a "Set Aside" folder in Fastmail but eventually found myself missing the nice little stack of email threads that are bundled up in a corner in the HEY app.
- [Bundling email from certain senders into a single thread](https://www.hey.com/features/bundles/) is an excellent solution for notification streams from Github or Amazon, where I want to be alerted with updates but don't want to have a bunch of separate email threads taking up space in my inbox.
- I really like [clips](https://www.hey.com/features/clips-highlights/) as an alternative to slapping on a label so I know to revisit an email for some buried content.

Don't get me wrong, Fastmail is a great service. If I didn't find out that masked email could be replaced by [DuckDuckGo Email Protection](https://duckduckgo.com/email/) I would probably still be using it[^1]. I'm especially fond of their investment in [JMAP](https://www.fastmail.com/blog/jmap-new-email-open-standard/) and attempts to make the technical ecosystem around email better. Also, if you want to have multiple custom domains routing to the same email platform, Fastmail is way more cost effective.

But, having moved back to HEY, I've discovered that I'm easily swayed by software that can please and delight. Many of HEY's features are UX oddities that don't exactly nail down ways to make email better, but make the experience of using it more enjoyable. I think HEY gets it right most of the time.

The calendar is a new addition to HEY in the time that I've been away and it's interesting. I'm not hugely opinionated when it comes to calendars, I hardly use them outside of work where my company dictates the platform. The HEY calendar feels split between innovating for the sake of novelty and innovating for the sake of good ideas.

For one, there's no monthly view. Only day and week. Instead of viewing a complete month you view an endless scroll of weeks, with about three and a half fitting on the screen at any given time. The daily/weekly focus of HEY Calendar seems catered to daily activities: journaling, photography, and habit tracking. Not so much complicated scheduling workflows.

HEY's email offering still has some rough spots as well:

- No import from an existing email.
- Adding additional custom domains is prohibitively expensive for a single user.
- Feature rollout is asymmetrical, web and Android often outpace iOS.
- Two separate apps for calendar and email (minor, but kind of annoying).
- Journal integration with the calendar is interesting, but I'm hesitant to use it because there's no export.
- Can't use HEY with an external app (e.g. Thunderbird).
- Still can't configure swipe actions on iOS.

Some of these (like swipe actions and import) are longtime issues that will probably never be addressed. It's probably also worth noting that the HEY workflow is rather opinionated and isn't guaranteed to hit. But hey, give it a try and see if it works for you.

Moral of the story: use custom email domains. It protects you from email vendor lock-in so you're free to experiment as you see fit.

[^1]: On that topic, masked email is such a critical privacy feature for email that I can't believe HEY doesn't offer it. I suppose the screener is meant to alleviate that concern (since unwanted emails must be manually screened-in) but it's not quite the same. I'd rather rest easy knowing that only a randomly-generated email winds up in marketing garbage lists.

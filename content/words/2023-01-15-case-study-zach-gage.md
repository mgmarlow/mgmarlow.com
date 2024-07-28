---
title: 'Case Study: Zach Gage'
date: 2023-01-15
tags: gamedev
---

Lately I've been playing a ton of [Knotwords](https://playknotwords.com/), an intensely clever puzzle game that is conceptually distinct from crossword puzzles but rides some of the same highs and lows. The game was created by Zach Gage and Jack Schlesinger, a duo behind several other standout App Store hits that carry many aesthetic and conceptual similarities.

With such a strong [portfolio](http://stfj.net/apps/index.html), I figured that there must be something I can learn by digging a bit into Zach Gage's interview and GDC material. What I came away with are five or so design principles that are present in some of his more recent games.

## Subway legibility

A term coined in his [GDC 2018 talk](http://stfj.net/DesigningForSubwayLegibility/), subway legibility is the ability for someone to understand a game by observing it over the shoulder of someone else playing it on the subway.

Many of Zach's aesthetic design decisions are based on this principle, communicating information in such a way that a quick glance exposes the core game mechanisms. The onlooker should be intrigued by the puzzle presented on the screen, as opposed to overwhelmed by clutter and detail.

This principle is the enemy of a busy user interface (UI). Zach breaks game UIs down with a method called the "three reads":

1. The first glance should convey the important bits, pulling you in.
2. The second glance should add supporting detail without overwhelming.
3. The third fills in the rest.

The designer can employ techniques of font size, UI composition, and point of view to help reinforce the three reads.

Successful legibility exposes the most important details first and foremost. In Knotwords, this is the arrangement of words and letters in the grid. Secondary are key details that support the core game components. To follow the same example, the dotted-lines and letter superscripts that denote the Knotwords puzzle constraint. Finally are necessities that are unimportant to the gameplay, e.g. the main menu button.

## Exploratory design process

In his [Playdate developer interview](https://www.gamedeveloper.com/playdate-launch/from-snake-to-snak-indie-developer-zach-gage-on-creating-for-playdate), Zach discusses his exploratory design process.

> Usually the experience I have is I'm playing a game, and one cool thing happens--or, one cool thing almost happens. Then it's like 'oh, is there a way I could've engineered that within the mechanics?'

The gist of the interview is leaving yourself enough room to explore game mechanics that emerge from gameplay, mechanics that often lead you down completely unanticipated avenues. When these surprising moments are discovered during the design process, make sure to double-down on them and expose them to the player.

This idea reminds a lot of the advice given by Jonathan Blow and Marc Ten Bosch in their [IndieCade 2011 talk](https://www.youtube.com/watch?v=OGSeLSmOALU). They title the presentation "Designing to Reveal The Nature of the Universe" and the central idea is much the same as what Zach discusses in the above quote.

When designing levels for your game, there will inevitably be situations where unanticipated interactions arise and expose interesting extensions of your core game ideas. When these moments do arise, it's critical to invest yourself fully in uncovering what spurred on the interest and excitement. That epiphany is the kernel of good level design, and it's the level designer's responsibility to demonstrate it to the player and deliver the same euphoric effect.

## Gesture-forward controls

Another consistent quality of Zach's games is attention to control mechanisms that are unique to the mobile platform. For example, in Knotwords there's a great usability feature that hinges on a directional swipe. Swipe horizontally from your current square and letters are entered left-right. Swipe vertically and letters are entered top-bottom.

For a game that is fundamentally about typing letters into an asymmetrical grid, swapping between left-right and top-down is a critical feature. It's hard to explain how this little gesture changes the overall usability of the game, unless you have some experience with the NYT Crossword app.

In NYT Crossword you swap letter direction by tapping on your current square. Since a tap simply toggles between two states, if you tap one time too many you effectively undo the change. This leads to a very frustrating experience where you enter in a stream of letters in the wrong direction because you fat-fingered a square.

With Knotwords, there's no way to fall into this problem because the swipe is directional--swiping twice in the same direction makes no difference. This is just one example of the many unique control mechanisms in Zach's games, each designed to work around common usability issues.

## Unobtrusive tutorialization

The first time I played through [Good Sudoku](https://www.playgoodsudoku.com/) I was extremely impressed by the tutorialization. Most textual explanations are tucked away in little icons next to their respective control. If you interact with the icon, you trigger the tutorial. Otherwise you can just play the game.

I imagine this design is heavily catered to the mobile game market. With so many freemium apps competing for users, developers want to ensure their app holds the user's attention past the 30-second first-time user experience. Obstructive tutorials and unskippable videos are probably the top two reasons I will immediately close an app, never to play it again.

Of course, it's entirely possible that no tutorials are just as bad, particularly if a user is dropped into the middle of a game they have no idea how to play. I think Zach's UI design and "subway legibility" do a lot of heavy lifting in this space. Designs that are easy to read serve a dual purpose: they capture the user's attention and they communicate core game mechanics. Without good legibility, it would be much harder to belay tutorials in favor of player exploration.

## Elevator pitch

When you first open up Knotwords or Good Sudoku, you're presented with a short textual blurb from Zach describing his design goals and the game's origin. It's a nice, personalized message that helps introduce the player to the game while emphasizing its uniqueness.

Not only does this set Zach's apps apart from others in the App Store, it demonstrates the clarity of game design carried throughout the development process. The message strikes me as a confident appeal: the game in your hands isn't a product of random chance and a lucky idea, but of careful design and focused effort.

## Conclusion

There's probably more to unpack from Zach Gage's games, but this post summarizes what I've been thinking about while playing Knotwords and Good Sudoku. These games are certainly small in scope and heavily rooted in the puzzle genre, but I think that the core principles are generally applicable to game designers of all types.

While Knotwords and Good Sudoku are simple games, it's too easy to dismiss simplicity as an easy road while missing the long path of careful design that came before it.

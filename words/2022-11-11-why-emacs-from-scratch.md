---
title: Why not Doom Emacs?
date: 2022-11-12
tags: emacs
---

The thing I credit most for sticking with Emacs after several failed attempts is building my own configuration [from scratch]({{ '/words/2022-05-02-learning-emacs' | url }}). Not only was the project easier than expected, it left me with the distinctive fullness created by the product of joyful work.

My previous experiments with frameworks like [Doom Emacs](https://github.com/doomemacs/doomemacs) or [Spacemacs](https://www.spacemacs.org/) were dropped shortly after the first sign of trouble. It was hard not to feel overwhelmed by the complexity of the ecosystem and frustrated by my inability to troubleshoot my own problems.

Don't get me wrong, Emacs frameworks offer compelling benefits for the lazy hacker. They pack in loads of sensible defaults, equip you with a sweet-looking UI, and offer modern language support out-of-the-box. Doom Emacs has over 15k stars on Github and it's not just because of the adorable cacodemon in the [README](https://github.com/doomemacs/doomemacs#introduction).

That said, if you're anything like me you'll quickly become overwhelmed after installing Doom Emacs for the first time. Perhaps your installation doesn't quite work, so you have to fix a few problems with `bin/doom doctor`. Maybe you want to change your fonts, so you dig through the documentation until you stumble upon the [FAQ](https://github.com/doomemacs/doomemacs/blob/master/docs/faq.org#change-my-fonts). Inevitably the framework that you installed to shortcut learning Emacs may not be as quick and easy as you expected.

Even with frameworks, there is no escaping the need to learn Emacs fundamentals to configure the editor to match your expectations. However, frameworks make the process of learning these fundamentals more difficult by greatly increasing the complexity space of your editor and introducing more points of failure.

That's why I recommend Emacs beginners start their journey with vanilla Emacs.

- Frameworks front-load learning the framework over learning Emacs
- New points of failure make diagnosing problems "the Emacs way" more difficult
- Framework defaults may not match your needs and expectations
- Modern (28+) vanilla Emacs isn't as bad as you think
- Emacs principles will serve you well if you adopt a framework later

If you're looking to get started with vanilla Emacs, I recommend diving into the [System Crafters tutorials](https://youtu.be/74zOY-vgkyw) and kickstarting your configuration with a [few defaults](https://gist.github.com/mgmarlow/c298502c0f84d1c06c881b8de404b7c7).

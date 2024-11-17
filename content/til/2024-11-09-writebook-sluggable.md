---
title: Cool Rails concerns
date: 2024-11-09
---

There's something super elegant about [Writebook's](https://once.com/writebook)
use of concerns. I especially like `Book:Sluggable`:

```rb
module Book::Sluggable
  extend ActiveSupport::Concern

  included do
    before_save :generate_slug, if: -> { slug.blank? }
  end

  def generate_slug
    self.slug = title.parameterize
  end
end
```

Here's a few reasons:

- Nesting concerns in a model folder is neat when that concern is an
  encapsulation of model-specific functionality: `app/models/book/sluggable.rb`.
- Concerns don't have to be big. They do have to be single-purpose.
- Reminds me of a great article by Jorge Manrubla:
  [Vanilla Rails is plenty](https://dev.37signals.com/vanilla-rails-is-plenty/).
  Down with service objects!

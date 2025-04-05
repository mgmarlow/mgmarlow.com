---
title: Crafting Interpreters, Ruby Style
date: 2024-08-18
tags:
  - ruby
---

I finally have started working through
[Crafting Interpreters](https://craftinginterpreters.com/), a wonderful book
about compilers by Robert Nystrom. The book steps through two interpreter
implementations, one in Java and one in C, that ramp in complexity.

Now I don't know about you, but I hate Java. I can hardly stand to read it, let
alone write it. That's why I decided to write my first Lox interpreter in Ruby,
following along with the book as I can but converting bits and pieces into
Rubyisms as I see fit.

In general, the Java code can be ported 1-1 to Ruby with no changes. Of course
there's some obvious stuff, like lack of types means I need fewer methods and no
coersions, or certain stdlib method namespaces that are updated to match Ruby
idioms (`while` vs. `until`, anyone?). However, lots of code I just accept as-is
and allow Nystrom to guide me through.

I've only worked through the first 7 chapters, but I did note down a few things
in the Ruby conversion that I found interesting.

## Avoiding switch statement fallthrough with regular expressions

Admittedly this difference is just a tiny syntactical detail, but one that plays
to Ruby's strengths. Take the book's implementation of `scanToken`:

```java
private void scanToken() {
  char c = advance();
  switch (c) {
    case '(': addToken(LEFT_PAREN); break;
    // ...
    default:
      if (isDigit(c)) {
        number();
      } else if (isAlpha(c)) {
        identifier();
      } else {
        Lox.error(line, "Unexpected character.");
      }
  }
}

private boolean isDigit(char c) {
  return c >= '0' && c <= '9';
}

// private boolean isAlpha...
```

Due to limitations in the Java switch statement, the author adds some
post-fallthrough checks to the `default` case. This removes the need to check
every number and letter individually (0-9, a-z, A-Z as separate cases) because
the check is deferred into the default case, where an additional conditional
statement is applied. Aesthetically it's not an ideal solution since it breaks
up the otherwise regular pattern of `case ... handler` that holds for the other
tokens. I don't know, it's just kinda ugly.

With Ruby, I can instead employ regular expressions directly in my switch
statement:

```rb
def scan_token
  case advance
  when "("
    add_token(:left_paren)
  # ...
  when /[[:digit:]]/
    number
  when /[[:alpha:]]/
    identifier
  else
    Lox.error(@line, "unexpected character")
  end
end
```

No default fallthrough needed! These tiny details are what keep me programming
in Ruby.

## Metaprogramming the easy way

The largest deviation between the Java and Ruby implementation is definitely the
metaprogramming. In
[Implementing Syntax Trees](https://craftinginterpreters.com/representing-code.html#implementing-syntax-trees)
the author employs metaprogramming through an independent build step.

First, a new package is created (`com.craftinginterpreters.tool`) with a couple
of classes that themselves generate Java classes by writing strings to a file:

```java
  private static void defineType(
      PrintWriter writer, String baseName,
      String className, String fieldList) {
    writer.println("  static class " + className + " extends " +
        baseName + " {");

    // Constructor.
    writer.println("    " + className + "(" + fieldList + ") {");

    // Store parameters in fields.
    String[] fields = fieldList.split(", ");
    for (String field : fields) {
      String name = field.split(" ")[1];
      writer.println("      this." + name + " = " + name + ";");
    }

    writer.println("    }");

    // Fields.
    writer.println();
    for (String field : fields) {
      writer.println("    final " + field + ";");
    }

    writer.println("  }");
  }
```

These string builders are hooked up to a separate entrypoint (made for the
`tool` Java package) and are compiled separately. The result spits out a bunch
of `.java` files into the `com.craftinginterpreters.lox` package, whereby the
programmer checks them into the project.

It's not a bad solution by any means, but requiring a separate build step and
metaprogramming by concatenating strings is a little rough. The Ruby solution is
totally different thanks to a bunch of built-in metaprogramming utilities (and
the fact that Ruby is an interpreted language).

Here's how I wired up the expression generation:

```rb
module Rlox
  module Expr
    EXPRESSIONS = [
      ["Binary", [:left, :operator, :right]],
      ["Grouping", [:expression]],
      ["Literal", [:value]],
      ["Unary", [:operator, :right]]
    ]

    EXPRESSIONS.each do |expression|
      classname, names = expression

      klass = Rlox::Expr.const_set(classname, Class.new)
      klass.class_eval do
        attr_accessor(*names)

        define_method(:initialize) do |*values|
          names.each_with_index do |name, i|
            instance_variable_set(:"@#{name}", values[i])
          end
        end

        define_method(:accept) do |visitor|
          visitor.public_send(:"visit_#{classname.downcase}_expr", self)
        end
      end
    end
  end
end
```

When this file is included into `rlox.rb` (the main entrypoint to the
interpreter), Ruby goes ahead and builds all of the expression classes
dynamically. No build step needed, just good ol' Ruby metaprogramming.
`Rlox::Expr.const_set` adds the class to the scope of the `Rlox::Expr` module,
re-opening it on the next line via `class_eval` to add in the
automatically-generated methods.

To close the loop, here's what one of the generated classes looks like if it
were to be written out by hand (while also avoiding the dynamic instance
variable setter):

```rb
module Rlox
  module Expr
    class Binary
      attr_accessor :left, :operator, :right

      def initialize(left, operator, right)
        @left = left
        @operator = operator
        @right = right
      end

      def accept(visitor)
        visitor.visit_binary_expr(self)
      end
    end
  end
end
```

Comparing the Ruby and Java implementation is interesting because it highlights
some higher-level advantages and disadvantages between the two languages. With
the Ruby version, adding new types is trivial and does not require an additional
compile + check-in step. Just add a name-argument pair to the `EXPRESSIONS`
constant and you're done!

The flip-side of this is the class is not easily inspectable. Although I wrote
`Rlox::Expr::Binary` above this paragraph as regular Ruby code, that code
doesn't exist anywhere in the application where a programmer's eyes can read it.
Instead, developers have to read the metaprogramming code in `expr.rb` to
understand how the classes work.

I think this implementation leans idiomatic Ruby: metaprogramming is part of the
toolkit so it's expected for developers to learn how to deal with it. If you're
interested in learning how the class works and can't understand the
metaprogramming code, you can always boot up the console and poke around with an
instance of the class. It kind of coincides with the Ruby ethos that a REPL
should be close at hand so you can explore code concepts that you might
otherwise misunderstand by reading the code.

That said, I still have respect for the Java implementation because Ruby
metaprogramming can really end up biting you in the ass.

## TDD (well, not really)

I'm sure Nystrom omitted tests from the book because it would add a ton of
implementation noise to the project, and not in a way that benefited the
explanation. For my purposes, I wanted to make sure I added tests with each
chapter to make sure my implementation wasn't drifting from the expectation.

It's not perfect by any means, but it definitely gives me a ton of confidence
that I'm following along with the material and exercising some of the trickier
edge cases. I was also impressed that Nystrom's implementation is really easy to
test. Here's an example from the parser:

```rb
class TestParser < Minitest::Test
  def test_it_handles_comparison
    got = parse("2 > 3")

    assert_instance_of Rlox::Expr::Binary, got
    assert_equal :greater, got.operator.type
    assert_equal 2.0, got.left.value
    assert_equal 3.0, got.right.value

    got = parse("2 >= 3")

    assert_instance_of Rlox::Expr::Binary, got
    assert_equal :greater_equal, got.operator.type
    assert_equal 2.0, got.left.value
    assert_equal 3.0, got.right.value

    got = parse("2 < 3")

    assert_instance_of Rlox::Expr::Binary, got
    assert_equal :less, got.operator.type
    assert_equal 2.0, got.left.value
    assert_equal 3.0, got.right.value

    got = parse("2 <= 3")

    assert_instance_of Rlox::Expr::Binary, got
    assert_equal :less_equal, got.operator.type
    assert_equal 2.0, got.left.value
    assert_equal 3.0, got.right.value
  end

  def parse(str)
    scanner = Rlox::Scanner.new(str)
    tokens = scanner.scan_tokens
    parser = Rlox::Parser.new(tokens)
    # Call private method to bubble up exception that is caught by #parse
    parser.send(:expression)
  end
end
```

Astute readers might recognize that the `parse` helper function defined within
the test is also calling into the `Rlox::Scanner` class. That's one item that
I've taken the quick and easy approach towards: rather than ensure test
isolation by writing out the AST with the `Rlox::Expr`/`Rlox::Statement` classes
(which are incredibly verbose), I use `Rlox::Scanner` so I can write my tests as
string expressions that read like the code I'm testing. Unfortunately, that does
mean that if I write a bug into the `Rlox::Scanner` class, that bug is
propogated into the `Rlox::Parser` tests, but in my head it's better than the
alternative of tripling the lines of code for my test files. What can you do?

## Next steps

There might be a part two for this post as I work my way further through the
first Lox interpreter. If you're interested in following along with the code,
check it out on [Github](https://github.com/mgmarlow/rlox).

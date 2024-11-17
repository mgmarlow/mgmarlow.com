---
title: DM Tools with Awk
date: 2024-02-27
---

I picked up Awk on a whim and am blown away by how generally useful it is. What
I thought was a quick and dirty tool for parsing tabulated files turns out to be
a fully-featured scripting language.

Before I started reading the second edition of
[The Awk Programming Language](https://awk.dev/), my only exposure to Awk was
from better-minded folk on Stack Overflow. After copy-pasting a short script
here or there, I was befuddled by the need for explicit `BEGIN` and `END`
statements in Awk one-liners. Shouldn't a program know when it begins and ends?
Why the redundancy?

Oh how wrong I was. Once you understand how Awk works, the syntax of `BEGIN` and
`END` makes a ton of sense; it's actually a consequence of Awk's coolest
feature. `BEGIN` and `END` are necessary because the default mode of an Awk
script isn't top-to-bottom execution, like other scripting languages. Instead,
Awk programs are executed repeatedly by default, either on the lines of a file
or an input stream.

To demonstrate, say I have a file where each line contains a location:

```txt
Forest
Hills
Desert
...
```

I can use Awk to turn that list of locations into one that is numbered with a
single statement, no loops required:

```txt
$ awk '{ print NR ". " $0 }' locations.txt
1. Forest
2. Hills
3. Desert
4. ...
```

Without the `BEGIN` or `END` markers (which denote "run this before" and "run
this after"), Awk runs statements on every line of its input. In this case, that
means re-printing each location in the file `locations.txt` with some minor
modifications.

Awk provides a bunch of built-ins that make it easy to work within this
execution model. `NR` refers to "num row", keeping track of the current line of
input that is being processed. This generates our numbered list.

The dollar-sign variables refer to fields on an individual line. `$0` is the
entire line, unmodified. `$1`, `$2`, and so on refer to subsets of the line,
broken up by a delimiter (e.g. space, tab, or comma) and read from left to
right.

And statements are just the tip of the Awk iceberg! You can assign each
statement a "matcher" that only runs the expression on lines that are truthy.
Here are a few examples:

```awk
# Print every row but the first
NR != 1 { print $0 }

# Only print a row if the first field matches "cat"
$1 ~ /cat/ { print "not a dog" }

# Maybe your second field is a number?
$2 >= 12 && $2 < 18 { print "teenager" }
```

Now the `BEGIN` and `END` statements are starting to make more sense.

## DMing with Awk

Now for something a little more complicated. As I mentioned before, Awk is a
fully-featured scripting language. You can write functions, generate random
numbers, build arrays, and do everything that you'd expect a normal language to
do (mostly, anyway). I ran across an example in the Awk book that demonstrates
the use of `rand()` via dice rolling and it sparked an idea: how useful can a
tool like Awk be for a DM running a Dungeons and Dragons game?

Since Awk is great at reading files, I figured it would also be great for
dealing with random tables. Given the locations file that appears earlier in
this post, here's how you can select a single location at random:

```sh
awk '{data[NR] = $0} END {srand(); print data[int(rand()*length(data))]}' locations.txt
```

It's easier to read with some annotations:

```awk
# Add every line in the file to an array, indexed by the line number
{ data[NR] = $0 }

# After reading the file,
END {
  # Seed randomness
  srand()

  # Pick a random index from the data array and print its respective value
  print data[int(rand() * length(data))]
}
```

I really like how `{ data[NR] = $0 }` is all that Awk needs to build an array
with the contents of a file. It comes in handy in cases like this where we need
the file contents in memory before we can do something useful.

Now, you might be thinking that this isn't that cool because `sort` can already
do it better. And you'd be right!

```sh
$ cat locations.txt | sort -R | head -1
Plains
```

So how about moving on to the next step instead: character generation. The next
script implements the charater creation rules from
[Knave](https://questingbeast.itch.io/knave), a game based on old-school
Dungeons and Dragons.

The first thing we need to do is generate some attribute scores. Each score can
be simulated by rolling three 6-sided dice (d6) and taking the lowest result.

```awk
BEGIN {
    srand()

    map[1] = "str"
    map[2] = "dex"
    map[3] = "con"
    map[4] = "int"
    map[5] = "wis"
    map[6] = "cha"

    print "hp " roll(8)
    for (i = 1; i <= 6; i++) {
        print map[i] " " lowest_3d6()
    }
}

function roll(n) {
    return int(rand() * n) + 1
}

function lowest_3d6(_i, _tmp) {
    min = roll(6)
    for (_i = 1; _i <= 2; _i++) {
        _tmp = roll(6)
        if (_tmp < min) {
            min = _tmp
        }
    }
    return min
}
```

The output looks like:

```txt
$ awk -f knave.awk
hp 6
str 1
dex 2
con 2
int 1
wis 1
cha 4
```

Since this Awk program is not reading from a file (yet), everything is run in a
`BEGIN` block. This allows us to execute Awk without passing in a file or input
stream. Within that `BEGIN` block we build a map of integers to attribute names,
making it easy to loop over them to roll for scores. Arrays in Awk are
association lists, so they work well for this use-case.

The strange thing about this code is the use of parameters as local variables in
the function `lowest_3d6`. The only way in Awk to make a variable local is to
provide it to the parameter list when declaring a function, as all other
variables are global. Idiomatic Awk attempts to reveal this strangeness by
adding an underscore to the parameter names, as I have done, or by inserting a
bunch of spaces before their place in the function definition.

Next up is to make these characters more interesting by assigning them careers
and starting items. A career describes the character's origin, explaining their
initial loot as fitting to their backstory. These careers are taken from Knave
second edition.

First, a new data file:

```txt
acolyte: candlestick, censer, incense
jailer: padlock, 10’ chain, wine jug
acrobat: flash powder, balls, lamp oil
jester: scepter, donkey head, motley
actor: wig, makeup, costume
jeweler: pliers, loupe, tweezers
...
```

Now that our Awk program is reading lines from a file, we can add a new block
that stores careers into an array so we can make a random selection for the
player.

```awk
# ...snip

{ careers[NR] = $0 }

END {
    print "\nCareer & items:"
    print careers[roll(100)];
}
```

When the program is executed with the list of careers, the output looks like
this:

```txt
$ awk -f knave.awk careers.txt
hp 3
str 1
dex 3
con 3
int 2
wis 3
cha 4

Career & items:
falconer: bird cage, gloves, whistle
```

Not bad!

I doubt these tools will come in handy for your next DnD campaign, but I hope
that this post has inspired you to pick up Awk and give it a go on some
unconventional problems.

---
title: Building Emacs from source on MacOS
date: 2022-09-08
updated: 2022-10-27
tags: emacs
---

This is a guide for building Emacs from source for Mac OSX (tested on 12.4, M1)
with
[native compilation](https://www.masteringemacs.org/article/speed-up-emacs-libjansson-native-elisp-compilation)
enabled. If you don't want native compilation (though I highly recommend it),
feel free to drop the the `--with-native-compilation` flag when you run the
`./configure` script.

## Prerequisites

- Xcode command line tools
- [`libgccjit`](https://formulae.brew.sh/formula/libgccjit), required for native
  compilation

## Building Emacs

First, clone the repo (you can also use the
[Github mirror](https://github.com/emacs-mirror/emacs) instead):

```txt
git clone https://git.savannah.gnu.org/git/emacs.git
```

These next few steps are taken straight from the
[INSTALL.REPO](https://github.com/emacs-mirror/emacs/blob/master/INSTALL.REPO)
file in the source repository, with the addition of a few options during
configuration.

### Run autogen

After the code is pulled down, cd into the directory and run the `autogen.sh`
script. This initial script generates another script (`configure`) that you'll
use to actually configure the Emacs `Makefile` to build on your OS.

```txt
cd emacs/
./autogen.sh
```

### Run configure

You can view all of the available options for `configure` by passing in the
`--help` flag:

```txt
./configure --help
```

Here is the list of options that are recommended for Mac OS, compiled from
[various](https://github.com/d12frosted/homebrew-emacs-plus)
[sources](https://github.com/mclear-tools/build-emacs-macos). I've included the
`--help` output with each option:

- `--with-native-compilation`: compile with Emacs Lisp native compiler support
- `--with-json`: compile with native JSON support
- `--with-ns`: use Nextstep (macOS Cocoa or GNUstep) windowing system. On by
  default on macOS
- `--with-xwidgets`: enable use of xwidgets in Emacs buffers (requires macOS
  Cocoa,
  [more info](https://www.gnu.org/software/emacs/manual/html_node/elisp/Xwidgets.html))
- `--without-dbus`: don't compile with D-Bus support
  ([more info](https://www.gnu.org/software/emacs/manual/html_mono/dbus.html))
- `--without-compress-install`: don't compress some files (.el, .info, etc.)
  when installing
- `--disable-silent-rules`: enable verbose build output

Run the `configure` script with these options to create the `Makefile` you'll
use to build Emacs.

```txt
./configure --with-native-compilation \
            --with-json \
            --with-ns \
            --with-xwidgets \
            --without-dbus \
            --without-compress-install \
            --disable-silent-rules
```

After this finishes, it's time to build Emacs proper.

### Build emacs

> Note: if `make` fails, take a look at "Troubleshooting" down below. Your best
> bet is to run `make bootstrap` instead.

```txt
make
```

This creates an Emacs binary at `src/emacs`. You can verify that everything
worked properly by running `emacs -Q`, launching it with no configuration.

```txt
src/emacs -Q
```

After you've verified that everything is good to go, the last step is to
assemble `Emacs.app` proper:

```txt
make install
```

You'll notice that a hefty `Emacs.app` application now lives in the `nextstep/`
directory. Go ahead and move it into your `/Applications/` directory.

```txt
mv nextstep/Emacs.app /Applications/
```

I also like to include `src` and `lib-src` on `PATH` so I can run Emacs from the
CLI (particularly important for `emacsclient`):

```txt
# Syntax for fish shell
set PATH $HOME/projects/emacs/src $PATH
set PATH $HOME/projects/emacs/lib-src $PATH
```

Congratulations, you have officially built Emacs from source!

### Next steps

With everything running smoothly, you're now ready to make your first
contributions to the Emacs codebase. Here are some excellent guides to get
started:

- [Contributing to Emacs](https://www.fosskers.ca/en/blog/contributing-to-emacs)
  by Colin Woodbury
- [Welcome, New Emacs Developers](https://lars.ingebrigtsen.no/2014/11/13/welcome-new-emacs-developers/?utm_source=pocket_mylist)
  by Lars Ingebrigtsen

Best of luck, new Emacs contributor!

## Troubleshooting

If `make` fails, one of the easiest ways to resolve most problems is to use the
bootstrap script instead:

```txt
# Clean out any dangling build artifacts
make clean

make bootstrap
```

This is effectively a "slower and more thorough" build of the application, and
successfully resolved a few issues I ran into when I updated from Emacs 28
to 29.

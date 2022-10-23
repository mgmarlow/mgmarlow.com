---
title: Building Emacs from source on MacOS
date: 2022-09-08
updated_at: 2022-10-23
tags: emacs
---

This is a guide for building Emacs from source for Mac OSX (tested on 12.4, M1) with [native compilation](https://www.masteringemacs.org/article/speed-up-emacs-libjansson-native-elisp-compilation) enabled. If you don't want native compilation (though I highly recommend it), feel free to drop the the `--with-native-compilation` flag when you run the `./configure` script.

## Prerequisites

- `libgccjit`: Install via [homebrew](https://formulae.brew.sh/formula/libgccjit) if you're building with native compilation.

## Building Emacs

First, clone the repo (you can also use the [Github mirror](https://github.com/emacs-mirror/emacs) instead):

```
git clone https://git.savannah.gnu.org/git/emacs.git
```

These next few steps are taken straight from the [INSTALL.REPO](https://github.com/emacs-mirror/emacs/blob/master/INSTALL.REPO) file in the source repository, with the addition of a few options during configuration.

### Run autogen

After the code is pulled down, cd into the directory and run the `autogen.sh` script. This initial script generates another script (`configure`) that you'll use to actually configure the Emacs `Makefile` to build on your OS.

```
cd emacs/
./autogen.sh
```

### Run configure

You can view all of the available options for `configure` by passing in the `--help` flag:

```
./configure --help
```

Here is the list of options that are recommended for Mac OS. The description is directly copied from the output of the previous command:

- `--with-native-compilation`: compile with Emacs Lisp native compiler support
- `--with-ns`: use Nextstep (macOS Cocoa or GNUstep) windowing
  system. On by default on macOS
- `--disable-silent-rules`: verbose build output (undo: "make V=0")
- `--disable-ns-self-contained`: disable self contained build under NeXTstep

Run the `configure` script with these options to create the `Makefile` you'll use to build Emacs.

```
./configure --with-native-compilation \
            --with-ns \
            --disable-silent-rules \
            --disable-ns-self-contained
```

After this finishes, it's time to build Emacs proper.

### Build emacs

```
make
```

This creates an Emacs binary at `src/emacs`. You can verify that everything worked properly by running Emacs with the `-Q` flag, which launches it with no configuration.

```
src/emacs -Q
```

While you can continue to use `src/emacs` as your daily driver, it's more convenient to finish the install and have Emacs available at `/usr/local/bin/emacs`.

```
make install
```

Additionally, you'll want to move the `Emacs.app` package into `/Applications/` so you can execute Emacs directly from Spotlight. Since you built Emacs with native compilation enabled, you'll need to also include the `native-lisp/` directory into the `Emacs.app` package.

```
mv native-lisp/ nextstep/Emacs.app/Contents/
mv nextstep/Emacs.app /Applications/Emacs.app
```

Congratulations, you have officially built Emacs from source!

### Next steps

With everything running smoothly, you're now ready to make your first contributions to the Emacs codebase. Here are some excellent guides to get started:

- [Contributing to Emacs](https://www.fosskers.ca/en/blog/contributing-to-emacs) by Colin Woodbury
- [Welcome, New Emacs Developers](https://lars.ingebrigtsen.no/2014/11/13/welcome-new-emacs-developers/?utm_source=pocket_mylist) by Lars Ingebrigtsen

Best of luck, new Emacs contributor!

## Troubleshooting

There could be a variety of reasons for `make` failing to build Emacs. That said, one of the easiest ways to resolve most problems is to use the bootstrap script instead:

```
# Clean out any dangling build artifacts
make clean

make bootstrap
```

This is effectively a slower and more thorough build of the application, and successfully resolved a few issues I ran into when I updated from Emacs 28 to 29.


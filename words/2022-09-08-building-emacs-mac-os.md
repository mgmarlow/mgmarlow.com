---
title: Building Emacs from source on MacOS
date: 2022-09-08
---

This is a guide for building Emacs from source for Mac OS (tested on M1). Included are links to the source documentation to help guide you through the process.

## Prerequisites

- `libgccjit`: This library is needed for native elisp compilation (a feature added in Emacs 28). You can install this via [homebrew](https://formulae.brew.sh/formula/libgccjit). Enabling this flag is highly recommended. [More info](https://akrl.sdf.org/gccemacs.html)

## Building Emacs

First, clone the repo (you can also use the [Github mirror](https://github.com/emacs-mirror/emacs) instead):

```
git clone https://git.savannah.gnu.org/git/emacs.git
```

These next few steps are taken straight from the [INSTALL.REPO](https://github.com/emacs-mirror/emacs/blob/master/INSTALL.REPO) file in the source repository, with the addition of a few options during configuration.

After the code is pulled down, cd into the directory and run the `autogen.sh` script. This initial script generates another script (`configure`) that you'll use to actually configure the Emacs `Makefile` to build on your OS.

```
cd emacs/
./autogen.sh
```

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

Congratulations, you have officially built Emacs from source. You can launch it from your terminal with `emacs &`, where the ampersand informs bash to run the process in the background.

With everything running smoothly, you're now ready to make your first contributions to the Emacs codebase. Here are some excellent guides to get started:

- [Contributing to Emacs](https://www.fosskers.ca/en/blog/contributing-to-emacs) by Colin Woodbury
- [Welcome, New Emacs Developers](https://lars.ingebrigtsen.no/2014/11/13/welcome-new-emacs-developers/?utm_source=pocket_mylist) by Lars Ingebrigtsen

Best of luck, new Emacs contributor!



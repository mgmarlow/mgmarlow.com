---
title: Data migrations with data-migrate
date: 2024-11-13
---

What I traditionally would've used Rake tasks for has been replaced with
[data-migrate](https://github.com/ilyakatz/data-migrate), a little gem that
handles data migrations in the same way as Rails schema migrations. It's the
perfect way to automate data changes in production, offering a single pattern
for handling data backfills, seed scripts, and the like.

The pros are numerous:

- Data migrations are easily generated via CLI and are templated with an `up`
  and `down` case so folks think about rollbacks.
- Just like with Rails schema migrations, there's a migration ID kept around
  that ensures data migrations are run in order. Old PRs will have merge
  conflicts.
- You can conditionally run data migrations alongside schema migrations with
  `bin/rails db:migrate:with_data`.

It's a really neat gem. I'll probably still rely on the good ol' Rake task for
my personal projects, but will doubtless keep `data-migrate` in the toolbox for
teams.

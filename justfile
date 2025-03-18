# use cmd.exe instead of sh:
set windows-shell := ["cmd.exe", "/c"]

default:
  just --list --unsorted

dev:
  pnpm run tauri dev

build:
  pnpm run tauri build --no-bundle

webdev:
  pnpm run turbo dev

webbuild:
  pnpm run turbo build

webpreview:
  pnpm run turbo build && pnpm --filter desktop vite preview

release:
  pnpm run release

release-dry-run:
  pnpm run release --dry-run

server:
  cargo run --package favicon-server --bin favicon-server

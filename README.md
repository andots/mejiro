# Mejiro

Mejiro is a lightweight and fast web viewer with a strong focus on bookmark management.

## Development

```bash
# start dev server and dev build tauri app
just dev
# release build for tauri app
just build
# start only frontend dev server
just webdev
# build only frontend (easy to look frontend styles etc.)
just webbuild
# bump version and git commit&push (must use git-bash on Windows for password dialog)
# after this command, github workflows will automatically build everything for us.
just release
# or dry-run
just release-dry-run
```

# Parus

Parus is a lightweight and fast web viewer with a strong focus on bookmark management.

## ⚠️ IMPORTANT: Alpha Version Notice

### 🚧 Development Status

This project is currently under active development as an alpha version. Please read this notice carefully before using the software.

### ⚠️ Warning

This software is in its early development stage (alpha). By using this software, you acknowledge and accept the following risks:

#### Potential Risks

- **Breaking Changes**
  - Major changes may occur without prior notice
  - Existing functionality might be removed or significantly altered
  - Configuration formats may change between versions

- **Stability Issues**
  - Features might be incomplete or partially implemented
  - The software may exhibit unexpected behavior
  - Performance optimizations are not yet finalized

- **Data Handling**
  - Backward compatibility is not guaranteed
  - Data structures may change between versions
  - Data migration tools may not be provided
  - Storage mechanisms might be altered

### ⚠️ Not Recommended For

- Production environments
- Mission-critical systems
- Applications handling sensitive data

### 💡 Best Practices for Alpha Testing

1. **Testing Environment**
   - Use only in development or testing environments
   - Maintain separate instances from production systems
   - Create regular backups of any important data

2. **Updates**
   - Check for updates regularly
   - Review changelogs before updating
   - Test thoroughly after each update

3. **Data Management**
   - Do not use with critical data
   - Implement your own backup strategies
   - Be prepared for potential data structure changes

### 📝 Providing Feedback

Your feedback is valuable in improving this software. Please contribute by:

- Reporting bugs through [Issues](../../issues)
- Suggesting features in [Discussions](../../discussions)
- Sharing your experience in [Discussions](../../discussions)

### 🔄 Staying Updated

Keep track of development progress through:

- [Issues](../../issues) for bug tracking and feature requests
- [Releases](../../releases) for version updates and changelogs
- [Discussions](../../discussions) for community interaction

### 📌 Version Information

- **Status**: Alpha
- **Last Updated**: 2025-02-20
- **Maintainer**: @andots

### ⚖️ Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.

---

*By using this software, you acknowledge that you have read and understood the above warnings and accept the risks associated with using alpha-stage software.*

### ⛏️ Development

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

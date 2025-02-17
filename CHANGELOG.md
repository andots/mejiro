# Changelog

## [0.7.1](https://github.com/andots/mejiro/compare/v0.7.0...v0.7.1) (2025-02-17)


### Bug Fixes

* enable creation of updater artifacts in tauri configuration ([539841e](https://github.com/andots/mejiro/commit/539841e8e16de14e89ce4ca28fc9e2697d740bf5))

# [0.7.0](https://github.com/andots/mejiro/compare/v0.6.0...v0.7.0) (2025-02-17)


### Features

* implement updater functionality with dialog prompts for version updates ([7564ba8](https://github.com/andots/mejiro/commit/7564ba8105ecab8718bf545c1f506be672a7ab5a))

# 0.6.0 (2025-02-17)


### Bug Fixes

* change external state change function to return a promise ([416c941](https://github.com/andots/mejiro/commit/416c9411a35984fbb768b6cdb135ce510ad1d645))
* find target URL using starts_with ([800b6ef](https://github.com/andots/mejiro/commit/800b6ef98afc733f8fcad681048d7829093e5e17))
* folder handling in RootChildrenSelect and bookmarks store ([b1424f6](https://github.com/andots/mejiro/commit/b1424f670c525dd48c6bd9f32367fbf28dc67ba6))
* get root node data correctly ([862a699](https://github.com/andots/mejiro/commit/862a6997029e3c15b33b2386e8eafe0a68ed890d))
* handle empty URL in AddressBar and update default URL in settings ([c73b77e](https://github.com/andots/mejiro/commit/c73b77e62bfc33d72614895c1cc3211bb7cb7cd1))
* hide add bookmark context menu ([82ed86f](https://github.com/andots/mejiro/commit/82ed86f0a58646cfc2226199d20bc7bf3015e540))
* lock after file create ([f3e975c](https://github.com/andots/mejiro/commit/f3e975c0e6af327479af75e28478a57569925a4d))
* pass user settings to create_window function ([2e7bf9c](https://github.com/andots/mejiro/commit/2e7bf9cc5ec95d14a2d8b27989db9912fd2e2106))
* remove async from toggleFavorite and simplify event emission ([3ac47fe](https://github.com/andots/mejiro/commit/3ac47feb8c70a26858089621840810967d1e003e))
* remove bookmark update listener and related code ([2890658](https://github.com/andots/mejiro/commit/289065834ebde0ef8725fb6df98a73fd6d3a3f3b))
* remove onMount in RootChildrenSelect and get data in initApp() ([aa011a1](https://github.com/andots/mejiro/commit/aa011a185fcdde5fa411973d3db0b4c159350701))
* update root bookmark name from "Root" to "All Bookmarks" ([d15a157](https://github.com/andots/mejiro/commit/d15a157aee1f326d0ed90f060bbdde172af1c74a))
* update title only if it's not empty and the index is not 0 ([3f68a0b](https://github.com/andots/mejiro/commit/3f68a0ba9e8f0568dfc9ef8018de48b74bb2da0a))
* use app_data_dir() to store app data ([6385e84](https://github.com/andots/mejiro/commit/6385e8491782f1f64a379e716ce29e7807e0a911))
* use div not ul and li ([b94f65c](https://github.com/andots/mejiro/commit/b94f65c618673bed28b9639c5a422c5e13133dba))


### Features

* add add_folder method to BookmarkArena for creating new folders ([72f6d7e](https://github.com/andots/mejiro/commit/72f6d7e7fca7ac152635848886fd29472ba661ba))
* add AddFolderDialog component and integrate folder creation functionality ([9982cbf](https://github.com/andots/mejiro/commit/9982cbfbdb01318e499fc7a84dcc706fce2c23d6))
* add bookmark edit mode on frontend ([8323034](https://github.com/andots/mejiro/commit/8323034701d62c0de247bddbb3dc8e347584758a))
* add bookmark with starting index that is shown on the current top of the bookmarks ([0aa6e5a](https://github.com/andots/mejiro/commit/0aa6e5ac2848a44b244029e1c450c0fe60acf4ab))
* add BookmarkEditDialog for editing bookmark titles and manage dialog state ([b93b147](https://github.com/andots/mejiro/commit/b93b1474b96d4cc149b6a41c247859f46b0365f8))
* add context menu handler to manage external state visibility ([7b47188](https://github.com/andots/mejiro/commit/7b4718839d31f77704c83d319c0ea842895adabc))
* add dialog and context-menu from solid-ui ([76c55b7](https://github.com/andots/mejiro/commit/76c55b7c530c4a068dd3b4393b56937ede90c223))
* add FolderData type and implement get_root_children_folder method in BookmarkArena ([fea332f](https://github.com/andots/mejiro/commit/fea332f728dd5e542284872eb70a1ed8bfc12537))
* add functionality to create a new folder in bookmarks ([2ffef26](https://github.com/andots/mejiro/commit/2ffef26d3226fbb8dfb618ee111cbcf89ac4f382))
* add get_default_title method to AppHandleExt and remove unused utils ([92f9352](https://github.com/andots/mejiro/commit/92f9352bf60882bf2957c5d7123be4d87964338d))
* add handlePinnedUrl function to manage pinned URL navigation ([cc1a806](https://github.com/andots/mejiro/commit/cc1a8063c4f996959d75858c64a526685c89c185))
* add methods to retrieve root node ID and its children in BookmarkArena ([80e17a9](https://github.com/andots/mejiro/commit/80e17a94683df4a7dcfcf8178225b818503a8981))
* add pinned_urls to UserSettings with default values ([da1b0e7](https://github.com/andots/mejiro/commit/da1b0e7649c0ad083a7354c238094277e8c02ca5))
* add RootChildrenSelect component and update invokes for root children retrieval ([8deaab4](https://github.com/andots/mejiro/commit/8deaab4704fcef9ac084f9af3d103e883bd65238))
* add save_to_file method for BookmarkArena ([8687344](https://github.com/andots/mejiro/commit/868734481b2cd01e14270b2c6dcfa81c025288a9))
* add sidebar toggle functionality with Octicon icons ([8dc334e](https://github.com/andots/mejiro/commit/8dc334ecd72a70f6a2b2b54b9bff7a641c6e83ac))
* add try_new method to BookmarkData for creating bookmarks with validation ([43266e4](https://github.com/andots/mejiro/commit/43266e4ac6993ab50178a57d7ab28c06d2dc500d))
* add update_title method to modify bookmark titles in rust side ([e8016c1](https://github.com/andots/mejiro/commit/e8016c114c0f320b4f0932856dc2bca02bf96313))
* conditionally render edit and remove buttons for non-root bookmarks ([4389c92](https://github.com/andots/mejiro/commit/4389c920c359c6e3db0585d3d4e4382d23f3badd))
* conditionally show delete option in context menu for non-root bookmarks ([bd4bf3f](https://github.com/andots/mejiro/commit/bd4bf3f19eb47993d4de10ac75ed4ccdbeec1328))
* disable right-click context menu ([dc23e3e](https://github.com/andots/mejiro/commit/dc23e3e6a54252f72f3662a99c50a9109ae47e99))
* enhance BookmarkTree component with folder and bookmark icons ([def8e47](https://github.com/andots/mejiro/commit/def8e47f6f9345e900f745bbede4b50e6e59f44c))
* enhance Favicon component with customizable size ([440a070](https://github.com/andots/mejiro/commit/440a070be36ddc9a226def25a7d1dd68efa3e823))
* enhance file name handling for debug and release builds ([2d16be9](https://github.com/andots/mejiro/commit/2d16be9a47f61e428efb0c8522bddec1487da15a))
* filter nodes to only include folders when retrieving children ([92b1b24](https://github.com/andots/mejiro/commit/92b1b24bb5e82b51e3fd15d43c2057ffe7500825))
* finding automatic location to smart bookmark ([fd77eb0](https://github.com/andots/mejiro/commit/fd77eb04d1b62aa952996986a79231c8375cebd8))
* frontend can call  get_settings from state ([696cffa](https://github.com/andots/mejiro/commit/696cffa96280ee051cd3e4416f73a798232c3b5f))
* implement bookmark removal functionality from frontend ([f59085b](https://github.com/andots/mejiro/commit/f59085b4de5804e7fc347e01297265124643e493))
* implement bookmark retrieval by index and update related components ([657e989](https://github.com/andots/mejiro/commit/657e9899743219b1ff5946c9ed5d61728a450ca5))
* implement bookmark title update functionality in frontend ([7c3b3fc](https://github.com/andots/mejiro/commit/7c3b3fc9839b2a8c9c58f351fda188fbc4e99b43))
* implement get_root_children command ([26bbcba](https://github.com/andots/mejiro/commit/26bbcbaf377db38436bab964368e7f032577c527))
* implement settings synchronization and show favicon for pinned urls ([115bcda](https://github.com/andots/mejiro/commit/115bcda28635b61dad27f66419f3a4033d97c2ee))
* initialize BookmarkArena with default folder groups ([5cb27b0](https://github.com/andots/mejiro/commit/5cb27b074dac8dd7f23904f8a17df9f4b054f5f4))
* integrate new icon components in AddressBar and update icon rendering logic ([5b8e7c5](https://github.com/andots/mejiro/commit/5b8e7c5711b8fd31c3de590c9303898ae6da727c))
* integrating delete action into context menu ([12dcd1d](https://github.com/andots/mejiro/commit/12dcd1d8ee4c3bfadfbcdcc9b32f64425a356921))
* move emit_page_params to injects module and update event emission ([0508695](https://github.com/andots/mejiro/commit/050869574a3fdf193b941969c954044dcbdab84c))
* navigate to url onClick favicon ([20d8725](https://github.com/andots/mejiro/commit/20d87252478040b8d987fa38885e1740ed03092f))
* new_root, new_folder ([b4b5d23](https://github.com/andots/mejiro/commit/b4b5d238f40502db887fa716eb70575a383a4e1d))
* passing index to get nested json ([8274e09](https://github.com/andots/mejiro/commit/8274e09ed77c0cfdd1fac4432edafdc52cce5c05))
* remove bookmark with the starting index ([33146b4](https://github.com/andots/mejiro/commit/33146b4c9434d6ff020595d6eff79f2f40cac9a0))
* remove subtree ([515c0c2](https://github.com/andots/mejiro/commit/515c0c2cf58f88027ddd6e217359b21f5563facd))
* root node must not be removed ([7ea50d6](https://github.com/andots/mejiro/commit/7ea50d6eac2b813b336c98ddb0735d711e7fed71))
* set webview data directory to app dir ([a91d6f9](https://github.com/andots/mejiro/commit/a91d6f90a7afaa7de6378a5d1ad62807794892e7))
* update RootChildrenSelect to use FolderData and adjust invokes for root children retrieval ([0068789](https://github.com/andots/mejiro/commit/0068789754727ef3be714513199cb446edb13bd5))
* wrap bookmark item with ContextMenu ([db26997](https://github.com/andots/mejiro/commit/db26997cea24ed58060d7b41661b061dd95eb9df))

# Changelog

# [0.19.0](https://github.com/andots/mejiro/compare/v0.18.1...v0.19.0) (2025-02-25)


### Bug Fixes

* **front:** prevent event propagation on bookmark node toggle, set cursor-pointer correctly ([da1643b](https://github.com/andots/mejiro/commit/da1643b5ece7ac0ce9a8179d9f5b1e636d6a96ad))
* **front:** set mode to null when not droppable ([b8b0134](https://github.com/andots/mejiro/commit/b8b0134d31cfe446feb7544fd465187e8f43fcd6))


### Features

* **front:** improve drag&drop feature, simplify code using zustand ([05f28a0](https://github.com/andots/mejiro/commit/05f28a0683756acf4c594fcb021a0b9edac4001e))

## [0.18.1](https://github.com/andots/mejiro/compare/v0.18.0...v0.18.1) (2025-02-24)


### Bug Fixes

* **front:** check if the node is open and has children to determine whether to prepend/insert after ([1635f80](https://github.com/andots/mejiro/commit/1635f8053250cd729806f1ce9b03eff2ba23e462))

# [0.18.0](https://github.com/andots/mejiro/compare/v0.17.0...v0.18.0) (2025-02-24)


### Bug Fixes

* **app:** import webview label constant in cfg(debug_assertions) ([9599fdb](https://github.com/andots/mejiro/commit/9599fdb2bbb5bbbaf16c360eb64a0fecb5d45960))
* **core:** add validation to prevent prepending as first child to the parent ([db39856](https://github.com/andots/mejiro/commit/db398566c9fbc4606b742e6738e189c9c2c6d281))
* **front:** add favicon link and remove unused favicon.svg ([4f8589f](https://github.com/andots/mejiro/commit/4f8589fc3ed412f656d9e621f55326652a2b775b))
* **front:** disable default right-click context menu and remove unused lifecycle methods ([e237ca3](https://github.com/andots/mejiro/commit/e237ca3a343ba78289973897293576a5570ed72c))
* **front:** dragging signal should have destination div, and watch its hasChildren classList ([0c6888b](https://github.com/andots/mejiro/commit/0c6888bb2e315ff1d30eba4d852943503c454d91))
* **front:** dragging source check while dragover ([eab8e6d](https://github.com/andots/mejiro/commit/eab8e6d28acb3cabfc177137de99432ace2f9e6c))
* **front:** get backend state in initApp that is run before render to avoid undesired re-render ([22538d7](https://github.com/andots/mejiro/commit/22538d776f1fa0380566e6f3412b6200cf1ec1ff))
* **front:** pass bookmarks as props to BookmarkTree component and clean up unused code ([e1da182](https://github.com/andots/mejiro/commit/e1da18234245c0693a78f22b3b8927c33452430e))


### Features

* **app:** integrate insert_before functionality for bookmarks ([629e919](https://github.com/andots/mejiro/commit/629e919853a420b1144f8c8e7a567d6791560adc))
* **app:** integrate prepend_to_child functionality for app and frontend ([66a18f9](https://github.com/andots/mejiro/commit/66a18f9e062b643514affda078a108ac439cff2c))
* **core:** add insert_before method for inserting nodes before a target node ([7132fa3](https://github.com/andots/mejiro/commit/7132fa3acf8d351459693dd6dd22e8a1121a2e11))
* **core:** add prepend_to_child method for moving bookmarks and corresponding tests ([1fda647](https://github.com/andots/mejiro/commit/1fda64789654fb92d2c8fe9b6bcd9b7569a8a0cf))
* **front:** prevent to dropping to self children with DOM tree check, UI disable it while dragging ([80b2d95](https://github.com/andots/mejiro/commit/80b2d95eaa0ce3992c317da37b7d71518cc31e3b))

# [0.17.0](https://github.com/andots/mejiro/compare/v0.16.0...v0.17.0) (2025-02-23)


### Bug Fixes

* **front:** stop rendering twice on bookmarks change and remove getFolders after invoking ([27d6e33](https://github.com/andots/mejiro/commit/27d6e33a0cfd4b335a7851207528582e3de3310a))
* simplify using signals for dragging source div ([e9a842b](https://github.com/andots/mejiro/commit/e9a842bd6783f3964eb8f247d3438ffc0499f227))


### Features

* **core:** prevent moving bookmarks to descendants ([f06d2d2](https://github.com/andots/mejiro/commit/f06d2d27cd2d8f8786210d51cf0b50b3d2adbe29))

# [0.16.0](https://github.com/andots/mejiro/compare/v0.15.0...v0.16.0) (2025-02-23)


### Bug Fixes

* **app:** remove pinned URLs stuff ([0dffff5](https://github.com/andots/mejiro/commit/0dffff59718bee08c5434f899f82ddc2eb3435c0))
* **front:** adjust layout for Bookmarks and Settings pages to ensure proper height ([710547d](https://github.com/andots/mejiro/commit/710547d6d78fb06d95d23b97e0887213852c21e2))
* **front:** remove pinned URLs stuffs  from settings page and related state ([7054ede](https://github.com/andots/mejiro/commit/7054ede6e528162a98ddff156bb7596373beb06e))
* **front:** update layout and styling for App component to enhance scrollbar visibility and spacing ([1142f16](https://github.com/andots/mejiro/commit/1142f163a15208d249287d2b73679253dc8e1246))


### Features

* add functionality to retrieve toolbar bookmarks ([e7a6177](https://github.com/andots/mejiro/commit/e7a6177a8d71326ea63d9474d6091526f116e62e))
* **core:** append bookmark to toolbar functionality and error handling for missing toolbar folder ([2f95ee3](https://github.com/andots/mejiro/commit/2f95ee3fca02266629c142e670f27fe07de8f758))
* **front:** add home button to toolbar with navigation functionality ([f9bfaa2](https://github.com/andots/mejiro/commit/f9bfaa2a4cfb18b4ca84dee0ae3778283c24a41a))
* **front:** implement toolbar bookmarks retrieval and display in the toolbar ([cdc2bcd](https://github.com/andots/mejiro/commit/cdc2bcd4327ff2d4305f7085b491e1d2e14f6227))
* **front:** integrate append bookmark to toolbar functionality ([d2200f1](https://github.com/andots/mejiro/commit/d2200f10866bf45b40492bf46a43dce8ab205c78))

# [0.15.0](https://github.com/andots/mejiro/compare/v0.14.0...v0.15.0) (2025-02-22)


### Bug Fixes

* improve count_bookmarks method by filtering removed nodes first ([4fc3264](https://github.com/andots/mejiro/commit/4fc32642df58916abbf97c4a4d021802f59450ec))


### Features

*  Bookmarks::default() make root and toolbar folder ([02a695f](https://github.com/andots/mejiro/commit/02a695f3d034d0c02d29f3b331292d9e2f423d0b))
* add count method to Bookmarks and update tests ([26141dc](https://github.com/andots/mejiro/commit/26141dcce6fb205fc80662ac96d2af4c0929bb53))
* add count_all_nodes and count_bookmarks methods to Bookmarks ([abdd568](https://github.com/andots/mejiro/commit/abdd5689a9901cd3ad86ab394511339d6c6bdbf3))

# [0.14.0](https://github.com/andots/mejiro/compare/v0.13.1...v0.14.0) (2025-02-21)


### Bug Fixes

* update build targets to only include MSI ([0e9e4a7](https://github.com/andots/mejiro/commit/0e9e4a773aca3a925aab745adc437068c1d87039))


### Features

* add top-loading bar component ([ad44326](https://github.com/andots/mejiro/commit/ad443260a98147c88c76467bfdf9ea5a3a42cc65))
* integrate page navigation event with loading bar ([9990378](https://github.com/andots/mejiro/commit/999037841e37125f09a9e3ba8c821db3df70f0fc))

## [0.13.1](https://github.com/andots/mejiro/compare/v0.13.0...v0.13.1) (2025-02-21)


### Bug Fixes

* add loading state to start page URL update and update getSettings to return a promise ([2fdf3c1](https://github.com/andots/mejiro/commit/2fdf3c1f2b42e36292a068ec1ab94cb3a3010a30))
* title/url detection improved, eval scripts on page load ([314a60e](https://github.com/andots/mejiro/commit/314a60ea308b5030ad427f97cbf4b92071b5d93f))

# [0.13.0](https://github.com/andots/mejiro/compare/v0.12.0...v0.13.0) (2025-02-21)


### Bug Fixes

* add conditional rendering for folders and improve initial value handling in RootChildrenSelect ([1440c08](https://github.com/andots/mejiro/commit/1440c086d38017763c31a83fcc0b83974651765a))
* handle null bookmarks and improve current top-level retrieval in BookmarkTree ([5ad42fb](https://github.com/andots/mejiro/commit/5ad42fbc867c19eaa902e576c1c2e81554c34a09))


### Features

* add is_open property to BookmarkData and implement toggle/set methods in Bookmarks ([cad529d](https://github.com/andots/mejiro/commit/cad529d399988f16c34e1a6355e8181fb5718393))
* integrate toggle and set methods with frontend ([23e58d4](https://github.com/andots/mejiro/commit/23e58d469acca248f82ab0c749397b8dd64de5d3))

# [0.12.0](https://github.com/andots/mejiro/compare/v0.11.0...v0.12.0) (2025-02-20)


### Bug Fixes

* add error handling for moving to the same node and improve existing error checks ([ce527d4](https://github.com/andots/mejiro/commit/ce527d430ce22ee2ae26e2105b842f74f276bed2))
* append under root when destination is root ([cc1b5c9](https://github.com/andots/mejiro/commit/cc1b5c9f10f7d8d3f5e7df02bd21e03bb5156c39))
* disabling tauri's drag and drop handler ([427b617](https://github.com/andots/mejiro/commit/427b6172356a7109259febb5dcdd4837c27a9d1c))
* prepend to the root, not append ([12f4d56](https://github.com/andots/mejiro/commit/12f4d56225121dbb45155adf4c687ca7f60f8b37))
* prevent default action on bookmark node click and navigate to url ([a36f2e4](https://github.com/andots/mejiro/commit/a36f2e4b7ce283193ba366d5178bd3a56ef30673))
* root and top level node should not be draggable ([2b144fb](https://github.com/andots/mejiro/commit/2b144fb1b4f50f5c2b25df4e66b0d795c751afce))
* root should not be draggable ([8341c0a](https://github.com/andots/mejiro/commit/8341c0ac0c3c069bce86beafbcfe2ca356c0f769))
* simplify node movement logic by removing unnecessary detach calls ([e3c0639](https://github.com/andots/mejiro/commit/e3c06394e86412adfa05bc5f0c1c74b4ef319ae6))
* use createEffect for drag event listeners in BookmarkTree component ([761fdfa](https://github.com/andots/mejiro/commit/761fdfa335f5dd48282f1489f0404c725d148c99))


### Features

* add indicator for currently dragged bookmark in BookmarkTree component ([2e565a9](https://github.com/andots/mejiro/commit/2e565a905cc2151055c1d5eeb420b12cd0ce5baa))
* add move_subtree_after method ([51ec515](https://github.com/andots/mejiro/commit/51ec515e8c53c46c9add156ab201fca575700a95))
* distinguish between inside and indicator states ([0f98f5c](https://github.com/andots/mejiro/commit/0f98f5cd017d517eaa4005b303d9da3a08a57919))
* force to be inside for current top level ([c9c918e](https://github.com/andots/mejiro/commit/c9c918e64268c49ff5bd0941fbeee43e91ecdb1b))
* implement move_to_children method for moving nodes to destination children ([23b18ab](https://github.com/andots/mejiro/commit/23b18ab1db6cfd88c8d02dcf4fb06f361af4d9eb))
* integrate detach and insert after functionality for bookmarks ([b094ea6](https://github.com/andots/mejiro/commit/b094ea64d4f61b1012b0343071e099b787742c43))
* integrate move to children method to frontend ([740ff94](https://github.com/andots/mejiro/commit/740ff946ae48fc5e168b3431edf657a7949345d7))
* pass dragging state (none, after, inside) as props to BookmarkNode ([986ec5e](https://github.com/andots/mejiro/commit/986ec5e97ffb6f94d224f0b1264ab8f72d7cd481))

# [0.11.0](https://github.com/andots/mejiro/compare/v0.10.0...v0.11.0) (2025-02-18)


### Bug Fixes

* closing function BookmarkEditDialog and DeleteConfirmDialog ([3db7885](https://github.com/andots/mejiro/commit/3db78858d4c0cc0745f4a2bae60609ba612f3df5))
* dialog closure and target reset in BookmarkEditDialog ([428645b](https://github.com/andots/mejiro/commit/428645b94a7e275d51b447ebc96f76baf06e1b61))
* enhance bookmark navigation by handling hidden external state ([6dd31ae](https://github.com/andots/mejiro/commit/6dd31ae8b24d7dbc82f953cf36f5634a7d453382))
* improve folder toggle functionality and navigation in BookmarkTreeEditable ([68a4cf3](https://github.com/andots/mejiro/commit/68a4cf347b53283c6cf65b50f7f9e26db60e7f07))
* remove focus-visible:ring-ring from Button ([5bc8f6c](https://github.com/andots/mejiro/commit/5bc8f6c042cb0bd9323e81bc292f6de2e6e87c0a))
* reset target state in delete confirmation dialog ([f6521e5](https://github.com/andots/mejiro/commit/f6521e550033d701ae829e2088d84df9a0cd1034))


### Features

* add delete confirmation dialog for bookmarks ([e24dd3c](https://github.com/andots/mejiro/commit/e24dd3cc55e8380ad37c9dc90f688dd84cd6877c))

# [0.10.0](https://github.com/andots/mejiro/compare/v0.9.0...v0.10.0) (2025-02-18)


### Bug Fixes

* new pinned URLs in SettingsPage ([4e3641f](https://github.com/andots/mejiro/commit/4e3641fafc619cab848838acad712c58bdbfc0ec))


### Features

* add URL validation for pinned URLs and start page URL in SettingsPage ([5d65409](https://github.com/andots/mejiro/commit/5d654098d37ae7eae63ede9bb4db9587453b620f))

# [0.9.0](https://github.com/andots/mejiro/compare/v0.8.0...v0.9.0) (2025-02-18)


### Bug Fixes

* correct spelling of get_default_app_title in AppHandleExt trait ([ce4287f](https://github.com/andots/mejiro/commit/ce4287f5607d32f497defe757cad857251147e23))
* update product name and identifier in tauri.conf.json to avoid name collision ([515656a](https://github.com/andots/mejiro/commit/515656ac05625ce754d774e924414dc58a15e4a5))


### Features

* implement external title change and navigation handling ([b90730b](https://github.com/andots/mejiro/commit/b90730b2b4d79db8ce5a82044c96e9f494c08c25))
* update window title with external page title ([3c9d03e](https://github.com/andots/mejiro/commit/3c9d03ec9933940d268f948751829a395421d1c5))

# [0.8.0](https://github.com/andots/mejiro/compare/v0.7.2...v0.8.0) (2025-02-17)


### Bug Fixes

* update ToolBar component to manage page state transitions ([b5fec6c](https://github.com/andots/mejiro/commit/b5fec6c08cecc857b94081bf35c1967edee38ed7))


### Features

* implement updateSettings functionality in SettingsPage and backend ([ba7ccf0](https://github.com/andots/mejiro/commit/ba7ccf0acf963b4aac5405997b20fb86cbf7f560))
* sync SettingsPage with state management and default settings ([240a343](https://github.com/andots/mejiro/commit/240a3436cec4b210dcf09f94a231e10140bed758))

## [0.7.2](https://github.com/andots/mejiro/compare/v0.7.1...v0.7.2) (2025-02-17)


### Bug Fixes

* update release workflow to use signing keys for Tauri artifacts ([3fc6da1](https://github.com/andots/mejiro/commit/3fc6da1dcdf113318f04386ce364877515e31b2c))

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

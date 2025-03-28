# Changelog

# [0.33.0](https://github.com/andots/parus/compare/v0.32.3...v0.33.0) (2025-03-25)


### Bug Fixes

* **app:** set permissions send_page_url and send_page_title only for external webview ([14ee8b3](https://github.com/andots/parus/commit/14ee8b334b7b7e3f186ca87c8de6ee7ccb4cda5d))
* **front:** set activeIndex after adding bookmark ([3606dea](https://github.com/andots/parus/commit/3606dea11d6924f5b0455816df21c74898127619))


### Features

* **bookmark:** add_bookmark return the index of new node ([56de09a](https://github.com/andots/parus/commit/56de09a20e3a16e0453674f1f174521a3d08e062))
* history back/forward from toolbar ([3cfb208](https://github.com/andots/parus/commit/3cfb208e9a58c5cf6764cf05779aa52b145ef3f1))

## [0.32.3](https://github.com/andots/parus/compare/v0.32.2...v0.32.3) (2025-03-20)


### Bug Fixes

* **bookmark:** force open all ancestors when bookmarking ([e13fc0a](https://github.com/andots/parus/commit/e13fc0a5f20593ef6d8f97eb9a4346cc7a7c0d35))
* **bookmark:** rename to Error ([001641d](https://github.com/andots/parus/commit/001641db3a5bc9772aea0219807ed0630321f4e0))

## [0.32.2](https://github.com/andots/parus/compare/v0.32.1...v0.32.2) (2025-03-18)


### Bug Fixes

* set new repository url ([32e085f](https://github.com/andots/parus/commit/32e085feb62a24f1cb94aab73dff8d03ad767333))

## [0.32.1](https://github.com/andots/parus/compare/v0.32.0...v0.32.1) (2025-03-18)


### Bug Fixes

* **js-injection:** remove unnecessary dom id ([2a5436b](https://github.com/andots/parus/commit/2a5436bf53481f3d9c7b9c09c7070b07bc73e3e7))
* remove logging ([1e191f3](https://github.com/andots/parus/commit/1e191f3bb59c0d2ab2a63f9acf6246aed9d59f2f))

# [0.32.0](https://github.com/andots/parus/compare/v0.31.0...v0.32.0) (2025-03-16)


### Bug Fixes

* **app:** plugin init order to fix js inject order (required scripts -> user scripts) ([e098b2f](https://github.com/andots/parus/commit/e098b2f908a625d6d6a0769e42a846270d1c088d))
* **user-scripts:** use RwLock for state ([4d4fbdf](https://github.com/andots/parus/commit/4d4fbdfc5ba563be99d22bb533f653969e5a676f))


### Features

* **js-injection:** integrate with js-injection plugin ([4fc1852](https://github.com/andots/parus/commit/4fc18524ddab4046381869e8cd2162a00e01bcea))
* **js-injection:** merge scripts with once_cell and eval once on page load ([54693cd](https://github.com/andots/parus/commit/54693cd6b0280edfdc42b3b1c9a48b877614fbea))
* **js-injection:** move command get_external_webview_title to plugin ([46bc651](https://github.com/andots/parus/commit/46bc6517e6c2341a8f0304fa32ef5d6187251dc1))

# [0.31.0](https://github.com/andots/parus/compare/v0.30.0...v0.31.0) (2025-03-16)


### Bug Fixes

* **front:** do nothing when minimizing window ([28a3bb5](https://github.com/andots/parus/commit/28a3bb51ab1d8022909b599cd59a0cfcdbc15f35))
* **user-scripts:** check the path is *.user.js on DebounceEvent ([340511d](https://github.com/andots/parus/commit/340511d224cfe44c5bad3e0a1d61b508520502b9))
* **user-scripts:** error handing for non utf-8 path correctly ([3c6aba5](https://github.com/andots/parus/commit/3c6aba548be6cfad5daf5484949b8bf35df02438))
* **user-scripts:** error handling add/update/remove user scripts ([9572515](https://github.com/andots/parus/commit/957251566280b22cea9de99ad68f318db61131d0))
* **user-scripts:** error handling and use fs::read_to_string ([9ad44c7](https://github.com/andots/parus/commit/9ad44c768c41fb7193c3ee0e8d9b68231b209ac2))
* **user-scripts:** return Result on run_all_user_script() and run scripts on page load finished ([781d3ad](https://github.com/andots/parus/commit/781d3ad8907be750483e4345db81edb7797c2432))


### Features

* add fs crate for glob files ([0d29762](https://github.com/andots/parus/commit/0d297625ce52b64aecb6030ce5d12edecbac26cf))
* **app:** integrate with user-scripts plugin ([390f6eb](https://github.com/andots/parus/commit/390f6eb069e66d063153aabe9fbba06067e3481e))
* **user-scripts:** add, remove userscripts with file watcher ([0d051f7](https://github.com/andots/parus/commit/0d051f7e272c18339c767c6a83b275fbe567d632))
* **user-scripts:** hot reload when modified user script file ([2d0634a](https://github.com/andots/parus/commit/2d0634a13de7a2a77b7c84e7d82df46fb8c9273f))
* **user-scripts:** load userscripts in app_dir/userscripts and manage it as tauri state ([1b58096](https://github.com/andots/parus/commit/1b58096b6cffb650dad3be0d3e8b3359f03a36b0))
* **user-scripts:** parse metadata of user script ([58e69bf](https://github.com/andots/parus/commit/58e69bf48195efc8a291ba515c82d9045278c2cd))
* **user-scripts:** run scripts with [@match](https://github.com/match) metadata ([1b633f6](https://github.com/andots/parus/commit/1b633f69b3c1b55d83d9dd1f5c03cde7c7cf6d4c))
* **user-scripts:** watch file rename event (remove script -> add script) ([70f6638](https://github.com/andots/parus/commit/70f66389d21b9ac47c4023ddeca9861ad6f8f2b6))
* **user-scripts:** watch user scripts directory with notify crate ([e73f4f3](https://github.com/andots/parus/commit/e73f4f3122c1d0ccb2bc395c491858799b0afc43))

# [0.30.0](https://github.com/andots/parus/compare/v0.29.0...v0.30.0) (2025-03-11)


### Bug Fixes

* **app:** use Error from common crate ([950c6f4](https://github.com/andots/parus/commit/950c6f40b44b49215b4de2c4653c6129304091f2))
* **front:** remove ping invoke ([3019020](https://github.com/andots/parus/commit/301902076788a686d5fede3505e5b61831d77568))
* **plugin:** fix constant import module ([402d73b](https://github.com/andots/parus/commit/402d73bc76e3a556f3c8a34b386f8b29f6af0b3b))
* **plugin:** remove AppHandleExt from plugin ([fbbfcf0](https://github.com/andots/parus/commit/fbbfcf065d5cc70c2901989c073cb93c0fa933ba))
* **plugin:** simplify state management of plugin ([6ee0626](https://github.com/andots/parus/commit/6ee0626528de37a514c466ead26701459e6fd02d))
* **plugin:** use Error from common ([d51d92b](https://github.com/andots/parus/commit/d51d92b6463a9b4c2060a3aaf73f334a88e28104))
* **plugin:** use FILE_NAME constant for filename ([d682020](https://github.com/andots/parus/commit/d682020946a481de89a46d490cc5758e7b9a238e))
* remove mobile stuffs ([5881688](https://github.com/andots/parus/commit/5881688d32b6eb3baf6f3f2573f3b930fe6cabd8))
* schema issue on EvenBetterToml ([6a4545b](https://github.com/andots/parus/commit/6a4545b00d6da88207d04f2249dd99d0e8a2bb8b))
* **window-geometry:** simplify state management as a plugin ([f60cbea](https://github.com/andots/parus/commit/f60cbeadc895b474f82b55cfaaddb97cf6e701b5))


### Features

* **app:** integrate user-settings plugin ([2dd199a](https://github.com/andots/parus/commit/2dd199a4c82d8ec70b60ed2b668f0d5d036212b4))
* **app:** integrate with bookmarks plugin ([9ccb47d](https://github.com/andots/parus/commit/9ccb47df5fae9a4275d85766bbc5a75eacb29996))
* **bookmarks:** add bookmarks commands and functions as plugin ([59b9d30](https://github.com/andots/parus/commit/59b9d30609fd1b4620dfcebbc20b3ccb083e9da3))
* **common:** add common crate for sharing codes ([6392b6b](https://github.com/andots/parus/commit/6392b6b0bf427e6ccf11d5b5c0ebfa988e7edf19))
* **common:** impl AppHandlePathExt to get file path ([32d063f](https://github.com/andots/parus/commit/32d063f96f82194e37815f7a306c046b7f8ce219))
* generate permissions for internal commands to allow specific commands on app/external webviews ([7fa4407](https://github.com/andots/parus/commit/7fa4407425acc6c2f3890cf311f995c1ef2ed149))
* **plugin:** add window-geometry plugin ([f5b5612](https://github.com/andots/parus/commit/f5b5612e6886ed175454047ad65640e414dbcc7c))
* **plugin:** move app settings features and commands to tauri-plugin-app-settings ([b18206e](https://github.com/andots/parus/commit/b18206eb9e619b8a1460ea26eec6c54b7af57355))
* **plugin:** move window geometry models and commands to plugin ([bf53341](https://github.com/andots/parus/commit/bf53341293ff3cfa0b81319358d65b89f4be789c))
* **plugin:** use FileName strum ([ac0e7c5](https://github.com/andots/parus/commit/ac0e7c595160922ec86e4a18c99a713c62dfd606))
* **user-settings:** make plugin for user settings ([01743d7](https://github.com/andots/parus/commit/01743d7c004313354d0903a1ed8cabc6d04a955a))

# [0.29.0](https://github.com/andots/parus/compare/v0.28.0...v0.29.0) (2025-03-09)


### Bug Fixes

* **app:** sync last visited url in rust side ([b270fed](https://github.com/andots/parus/commit/b270fed5f3d1e75d180c59224b1983dd70629525))
* **mouse-gesture:** create canvas if not found ([89a6c73](https://github.com/andots/parus/commit/89a6c7380e24235e1d94cb9bb2689d00857417b8))
* **mouse-gesture:** don't need to preventDefault on mousedown, it caused all mousedown refused ([4a64941](https://github.com/andots/parus/commit/4a64941740d272791545e6beb3e1ac58e58748a2))
* **mouse-gesture:** eval mouse gesture scripts on page load to make it works on every webpage ([44e89c5](https://github.com/andots/parus/commit/44e89c57dd037815a6789ced602a510f18e3ab8c))
* **mouse-gesture:** simplify append overlay and canvas, add comments ([bd0d25e](https://github.com/andots/parus/commit/bd0d25e38fe4f8cbfb239b37e875c2ecc68ee4d5))
* **mouse-gesture:** use overlay and canvas for mouse gesture ([562e55c](https://github.com/andots/parus/commit/562e55c1d485386e2a14b111de85941e46c3766c))
* **mouse-gesture:** use style.cssText ([092789b](https://github.com/andots/parus/commit/092789ba12c99386b9640fd93221380145e837e6))


### Features

* add simple mouse gesture (history back/forward, scroll to top/bottom) ([2af2b86](https://github.com/andots/parus/commit/2af2b86a0fee8603d3ee7325bb9d1f48a37262c2))

# [0.28.0](https://github.com/andots/parus/compare/v0.27.0...v0.28.0) (2025-03-08)


### Bug Fixes

* **favicon-server:** favicon size to 16px ([eb71b55](https://github.com/andots/parus/commit/eb71b5515a8e5e4426b53dd1715e6e49e68a3a8e))
* **favicon-server:** update allowed origins for favicon server ([c1a9453](https://github.com/andots/parus/commit/c1a9453d57ca1c460e42ecbcd250d21f4fac8eb6))


### Features

* **app,front:** set sidebar font size from user settings ([30cf143](https://github.com/andots/parus/commit/30cf143f50a5cd32e011c0c331de3fcbfb760755))
* **front:** change sidebar font size from settings page ([283de35](https://github.com/andots/parus/commit/283de35b866410cad10ade89dbe88139b93006a1))

# [0.27.0](https://github.com/andots/parus/compare/v0.26.0...v0.27.0) (2025-03-06)


### Bug Fixes

* **favicon-server:** update fetch_favicon to use host from URL ([2455025](https://github.com/andots/parus/commit/2455025018f27cd135855d64a9a88e9dafddd67d))


### Features

* **app:** integrate favicon server with tauri app ([0bd8a6c](https://github.com/andots/parus/commit/0bd8a6c752ac7ad2567135dbba019e7bf9a8342f))
* **favicon-server:** add 404 handler and update routing to include fallback ([1ee9f81](https://github.com/andots/parus/commit/1ee9f810a282f0d9d46b9bb7dd0e40a3b5cec84a))
* **favicon-server:** add CORS support with tower-http ([50ba1cf](https://github.com/andots/parus/commit/50ba1cfb44a3ce9f04192f249b5eddb57a68fe14))
* **favicon-server:** add delete_all endpoint to remove all favicons and health check endpoint ([b16298f](https://github.com/andots/parus/commit/b16298f89f059238c2300d7c78fb64786e0b2e6e))
* **favicon-server:** fetch favicon if not found in database and write it to database ([bf72bc6](https://github.com/andots/parus/commit/bf72bc67c7b8d12c87eac1984be5baf56cf4617d))
* **favicon-server:** initial commit of favicon server for cache image server ([136ab45](https://github.com/andots/parus/commit/136ab45d91caa556432c6665c8ce2ee508ddaf2a))
* **favicon-server:** integrate logging for error handling and server events ([2d86bee](https://github.com/andots/parus/commit/2d86bee9c92276e33f1d0ff643fdca2fff7639f5))
* **favicon-server:** return default image response on error in favicon retrieval ([f423648](https://github.com/andots/parus/commit/f423648d1f960ea64830bf2807807c889adae550))
* **favicon-server:** return default image response when error occurs ([d786c4a](https://github.com/andots/parus/commit/d786c4a2f4db4bea46017409adf09c0e45799642))

# [0.26.0](https://github.com/andots/parus/compare/v0.25.1...v0.26.0) (2025-03-05)


### Bug Fixes

* **front:** handle sidebar width correctly when user closed window without sidebar ([fd668f6](https://github.com/andots/parus/commit/fd668f6d97e583db533a512677e00021ff9c8a34))


### Features

* **app,front:** add home page URL setting and update related components ([79c6c34](https://github.com/andots/parus/commit/79c6c34b3a9088d6ed06d58b60e01fc8acc3607d))
* **app,front:** introduce AppSettings type and related commands for managing application settings ([d20145e](https://github.com/andots/parus/commit/d20145eb79512998b2917ec5083f109b674f0d4a))
* **app,front:** set initial sidebar width by getting window geometry from tauri state ([167035d](https://github.com/andots/parus/commit/167035d7db10c18b00ec5c0244cddf172abebe15))
* **app:** add app and external capability configurations and remove default capabilities ([2844930](https://github.com/andots/parus/commit/28449302be9b4c7b24b39dc189eae305f74f5ce3))
* **app:** add AppSettings struct and load_app_settings method for restart required settings ([179e307](https://github.com/andots/parus/commit/179e30725fc94ac244c93628d572678e1068c0fe))
* **app:** add save_app_settings method to persist application settings ([e2a34fe](https://github.com/andots/parus/commit/e2a34fe64b56635433122d28a44a54439fae5bef))
* **app:** manage window geometry state as tauri state ([3a41294](https://github.com/andots/parus/commit/3a412949b2f95ad880b59aba452b9e424dca67c2))
* **front:** add listener for close requested events to update last visited URL ([3219c58](https://github.com/andots/parus/commit/3219c58eb33a93d6bbcdd6040501698367d60f53))

## [0.25.1](https://github.com/andots/parus/compare/v0.25.0...v0.25.1) (2025-03-03)


### Bug Fixes

* **front:** fixed node container height, update EditableTitle to use dynamic font size from props ([de3a6b4](https://github.com/andots/parus/commit/de3a6b46e7ebd392d771ffdaa54ee7588878b963))
* **front:** highlight NodeIcon and Title while dragging inside ([c768302](https://github.com/andots/parus/commit/c768302e51a4423b6d42766d3d6e591ca0f9ca81))
* **front:** remove unnecessary div in BookmarkNode component for improved structure ([83467ea](https://github.com/andots/parus/commit/83467eadc986697865a7f6eb57a4f266b2052428))
* **front:** reset active index on drag start in BookmarkNode component ([034ae91](https://github.com/andots/parus/commit/034ae9111305b0bb4678ca922ee89f59f4b42c47))
* **front:** update BookmarkNode component to use consistent sizing for icons and font ([08daba8](https://github.com/andots/parus/commit/08daba8d137e8d9be1051d41a450b27c2e3acaa7))
* **front:** update BookmarkNode component to use dynamic sizing for icons and navigation arrows ([49ff5e1](https://github.com/andots/parus/commit/49ff5e136f6fb9a9a4cbf9f7d469a89c2a7f36ed))

# [0.25.0](https://github.com/andots/parus/compare/v0.24.1...v0.25.0) (2025-03-03)


### Bug Fixes

* **front:** enhance focus behavior in EditableTitle and clean up bookmarks store imports ([17dc963](https://github.com/andots/parus/commit/17dc9635d3ee1ae745d71839cffb01f06c97dff3))
* **front:** enhance layout and styling in BookmarkNode and EditableTitle components ([0535e47](https://github.com/andots/parus/commit/0535e474183df05175038e0ca84c55eebb99c2d7))
* **front:** fix unnecessary data retrieval and rendering by getFolders and FolderSelect ([97eb2b4](https://github.com/andots/parus/commit/97eb2b48376ffcfc50a4d742324b5691e0988f9b))
* **front:** getFolders should be outside of state management ([0bdeaa7](https://github.com/andots/parus/commit/0bdeaa7b574f0f441d760a49542689705ba46be0))
* **front:** initialize EditableTitle value on edit start ([8747875](https://github.com/andots/parus/commit/87478757c25a47c32ee2265a400973430785d754))
* **front:** remove development logging from Sidebar component ([d5a0f76](https://github.com/andots/parus/commit/d5a0f762c776633e681764aaeee148a2748340b9))
* **front:** remove unused autofocus dependency and update focus handling in EditableTitle component ([111aceb](https://github.com/andots/parus/commit/111aceb2778ee07648789e37678910428416425e))


### Features

* **app,front:** return AddFolderResponse with new folder's index and it can be auto editable ([5b24ad0](https://github.com/andots/parus/commit/5b24ad0f2ca5a75a391c0b9e486874a3a262aadd))
* **front:** add active index state for selecting highlight ([c2e1db2](https://github.com/andots/parus/commit/c2e1db200755a48bd5b3786d627c422d2f83bede))

## [0.24.1](https://github.com/andots/parus/compare/v0.24.0...v0.24.1) (2025-03-02)


### Bug Fixes

* **front:** add context menu for copy, paste, and cut actions, update title handling to be async ([73284de](https://github.com/andots/parus/commit/73284dee2e9bd36dba7df1a6c79b1291248ceb2b))
* **front:** prevent update title twice using ref().blur() on KeyDown ([bf35ddd](https://github.com/andots/parus/commit/bf35ddd63d60e03d109457efd6e32bdb19b24e5a))

# [0.24.0](https://github.com/andots/parus/compare/v0.23.0...v0.24.0) (2025-03-02)


### Bug Fixes

* **front:** set external position x based on external state (full or others) for resize event ([a776c1b](https://github.com/andots/parus/commit/a776c1b7ffd2e0b10d09e94bf0c08204fdc81751))


### Features

* **app:** add default window dimensions and minimum size constants ([17c9883](https://github.com/andots/parus/commit/17c988321138a9f996a5d42f1498aa5b9f904e79))
* **app:** commands return NestedBookmarks, JSON.parse() now can be removed ([29f8dfc](https://github.com/andots/parus/commit/29f8dfcafa06cd5dfded073f899772fa8291ab6b))
* **app:** disabled auto_resize on external webview and control its size by listening resize event ([f0688d8](https://github.com/andots/parus/commit/f0688d813e72d20716df90dafddd1a66b45a6f00))
* **core, app, front:** skip toolbar folder when adding bookmark, swap parameter for consistency ([4f46d92](https://github.com/andots/parus/commit/4f46d925b7fb4e821824abea3f7086e20831152c))
* **core:** bookmark retrieval to use NestedBookmarks structure ([9d81fad](https://github.com/andots/parus/commit/9d81fad794402b12ecabf7ae46f543372db39ca2))
* **front:** force to open folder when selected from RootChildrenSelect ([df5ab8f](https://github.com/andots/parus/commit/df5ab8f8b0ac8e49f4c76bca33557edd9bfb22ca))

# [0.23.0](https://github.com/andots/parus/compare/v0.22.0...v0.23.0) (2025-03-01)


### Bug Fixes

* **app:** remove unnecessary async in tauri::command ([8df9fef](https://github.com/andots/parus/commit/8df9fefbe68308c39ce17344fb7259be66e95626))
* **front:** enhance progress handling for external page loading ([34cfdbd](https://github.com/andots/parus/commit/34cfdbd8ddaf09bdb5dbdf21eae7c3510291096d))
* **front:** integrate Tauri event listeners and state management in App component ([aaf5597](https://github.com/andots/parus/commit/aaf559732bd167429eb369bfb0b6c4c4fcea7078))
* **front:** reorder context menu items in BookmarkNode component ([cb52383](https://github.com/andots/parus/commit/cb523832374de4d6e94058779f2fd5c2ac1d0729))
* **front:** update bookmark title only if it has changed in EditableTitle component ([8839435](https://github.com/andots/parus/commit/883943558da34fe71cdebee794bd4cc5ef3be19d))


### Features

* **front:** add folder from context menu ([a3a9a76](https://github.com/andots/parus/commit/a3a9a76639f8b667a751dc49e7b213f0032b8506))
* **front:** edit title with editable input box with autofocus ([f9374ca](https://github.com/andots/parus/commit/f9374cad9ec859373efda7b048157c08a6cb6579))
* **front:** implement EditableTitle component for inline editing of bookmarks ([78e01b9](https://github.com/andots/parus/commit/78e01b9abbe1580776c6ee2d10103a70db82806d))
* **front:** lock tree while editing ([d3a9de8](https://github.com/andots/parus/commit/d3a9de8e4a4611e8c5a1b91025bb799cb3e8d4ca))
* **front:** replace ContextMenu with Tauri Menu in BookmarkNode component ([ef792d5](https://github.com/andots/parus/commit/ef792d5a318467e45a5c84c4fc63fae9c62a0ed3))

# [0.22.0](https://github.com/andots/parus/compare/v0.21.1...v0.22.0) (2025-02-28)


### Bug Fixes

* **app:** disable default right-click context menu only in main div ([eadc9c8](https://github.com/andots/parus/commit/eadc9c803cb13373b06fec2932d5577020916bab))
* **front:** disable default context menu only in Sidebar component ([2ac6412](https://github.com/andots/parus/commit/2ac6412c2ebf90f2fa56001b80bac25d8eed75b6))
* **front:** prepare dashboard page and update navigation logic ([a9a7529](https://github.com/andots/parus/commit/a9a7529c380077ec1d988e39f3a7477145cca797))


### Features

* **front:** layout with MainLayout ([45c7bcb](https://github.com/andots/parus/commit/45c7bcb07fee28e9f8a0dea64733d0f03d8198b7))

## [0.21.1](https://github.com/andots/parus/compare/v0.21.0...v0.21.1) (2025-02-28)


### Bug Fixes

* **front:** fix text overflow issue in RootChildrenSelect with ellipsis and adjust SELECT_BOX_WIDTH ([41fa0a4](https://github.com/andots/parus/commit/41fa0a4e6829b32d106aee38927f30a4652dce50))

# [0.21.0](https://github.com/andots/parus/compare/v0.20.0...v0.21.0) (2025-02-27)


### Features

* **front:** integrate sidebar resizing with external webview ([8d2404b](https://github.com/andots/parus/commit/8d2404b898340948e72934f8fd4c5ff83333dd01))

# [0.20.0](https://github.com/andots/parus/compare/v0.19.2...v0.20.0) (2025-02-27)


### Bug Fixes

* **app:** manage user settings before creating the window ([c1e0ab0](https://github.com/andots/parus/commit/c1e0ab0da0a575f1ab797587cccf9060ff83e969))
* **app:** should panic when failing app dir check ([fc936cf](https://github.com/andots/parus/commit/fc936cfae216f36eb68b8e43bfe67db7df3e9ae4))


### Features

* **app:** app runs as single instance with single-instance plugin ([f5ff45d](https://github.com/andots/parus/commit/f5ff45decdfc673577caf1e3d69c00a7150d8a8d))
* **app:** create backup file before loading bookmarks ([05ba16d](https://github.com/andots/parus/commit/05ba16d9787ef2afe70bbd87a2ac8b5948f0cc2a))
* **app:** enable devtools for Windows in release builds ([97ca7e1](https://github.com/andots/parus/commit/97ca7e1ab174e55bc6913df91712de51cb37d19e))
* **app:** retrieve external webview title for the start url page ([e4df401](https://github.com/andots/parus/commit/e4df401c5c285b28edda16703487187201230c6a))

## [0.19.2](https://github.com/andots/parus/compare/v0.19.1...v0.19.2) (2025-02-25)

## [0.19.1](https://github.com/andots/parus/compare/v0.19.0...v0.19.1) (2025-02-25)


### Bug Fixes

* **front:** don't show Delete context menu if it's not removable (root or current top level) ([67f533a](https://github.com/andots/parus/commit/67f533a21d797789d75b60fc77c301c007587b39))
* **front:** ensure folders list updates after bookmark operations ([96cae15](https://github.com/andots/parus/commit/96cae1595aa19c4e0ba9bc0cca990577a186e0d3))

# [0.19.0](https://github.com/andots/parus/compare/v0.18.1...v0.19.0) (2025-02-25)


### Bug Fixes

* **front:** prevent event propagation on bookmark node toggle, set cursor-pointer correctly ([da1643b](https://github.com/andots/parus/commit/da1643b5ece7ac0ce9a8179d9f5b1e636d6a96ad))
* **front:** set mode to null when not droppable ([b8b0134](https://github.com/andots/parus/commit/b8b0134d31cfe446feb7544fd465187e8f43fcd6))


### Features

* **front:** improve drag&drop feature, simplify code using zustand ([05f28a0](https://github.com/andots/parus/commit/05f28a0683756acf4c594fcb021a0b9edac4001e))

## [0.18.1](https://github.com/andots/parus/compare/v0.18.0...v0.18.1) (2025-02-24)


### Bug Fixes

* **front:** check if the node is open and has children to determine whether to prepend/insert after ([1635f80](https://github.com/andots/parus/commit/1635f8053250cd729806f1ce9b03eff2ba23e462))

# [0.18.0](https://github.com/andots/parus/compare/v0.17.0...v0.18.0) (2025-02-24)


### Bug Fixes

* **app:** import webview label constant in cfg(debug_assertions) ([9599fdb](https://github.com/andots/parus/commit/9599fdb2bbb5bbbaf16c360eb64a0fecb5d45960))
* **core:** add validation to prevent prepending as first child to the parent ([db39856](https://github.com/andots/parus/commit/db398566c9fbc4606b742e6738e189c9c2c6d281))
* **front:** add favicon link and remove unused favicon.svg ([4f8589f](https://github.com/andots/parus/commit/4f8589fc3ed412f656d9e621f55326652a2b775b))
* **front:** disable default right-click context menu and remove unused lifecycle methods ([e237ca3](https://github.com/andots/parus/commit/e237ca3a343ba78289973897293576a5570ed72c))
* **front:** dragging signal should have destination div, and watch its hasChildren classList ([0c6888b](https://github.com/andots/parus/commit/0c6888bb2e315ff1d30eba4d852943503c454d91))
* **front:** dragging source check while dragover ([eab8e6d](https://github.com/andots/parus/commit/eab8e6d28acb3cabfc177137de99432ace2f9e6c))
* **front:** get backend state in initApp that is run before render to avoid undesired re-render ([22538d7](https://github.com/andots/parus/commit/22538d776f1fa0380566e6f3412b6200cf1ec1ff))
* **front:** pass bookmarks as props to BookmarkTree component and clean up unused code ([e1da182](https://github.com/andots/parus/commit/e1da18234245c0693a78f22b3b8927c33452430e))


### Features

* **app:** integrate insert_before functionality for bookmarks ([629e919](https://github.com/andots/parus/commit/629e919853a420b1144f8c8e7a567d6791560adc))
* **app:** integrate prepend_to_child functionality for app and frontend ([66a18f9](https://github.com/andots/parus/commit/66a18f9e062b643514affda078a108ac439cff2c))
* **core:** add insert_before method for inserting nodes before a target node ([7132fa3](https://github.com/andots/parus/commit/7132fa3acf8d351459693dd6dd22e8a1121a2e11))
* **core:** add prepend_to_child method for moving bookmarks and corresponding tests ([1fda647](https://github.com/andots/parus/commit/1fda64789654fb92d2c8fe9b6bcd9b7569a8a0cf))
* **front:** prevent to dropping to self children with DOM tree check, UI disable it while dragging ([80b2d95](https://github.com/andots/parus/commit/80b2d95eaa0ce3992c317da37b7d71518cc31e3b))

# [0.17.0](https://github.com/andots/parus/compare/v0.16.0...v0.17.0) (2025-02-23)


### Bug Fixes

* **front:** stop rendering twice on bookmarks change and remove getFolders after invoking ([27d6e33](https://github.com/andots/parus/commit/27d6e33a0cfd4b335a7851207528582e3de3310a))
* simplify using signals for dragging source div ([e9a842b](https://github.com/andots/parus/commit/e9a842bd6783f3964eb8f247d3438ffc0499f227))


### Features

* **core:** prevent moving bookmarks to descendants ([f06d2d2](https://github.com/andots/parus/commit/f06d2d27cd2d8f8786210d51cf0b50b3d2adbe29))

# [0.16.0](https://github.com/andots/parus/compare/v0.15.0...v0.16.0) (2025-02-23)


### Bug Fixes

* **app:** remove pinned URLs stuff ([0dffff5](https://github.com/andots/parus/commit/0dffff59718bee08c5434f899f82ddc2eb3435c0))
* **front:** adjust layout for Bookmarks and Settings pages to ensure proper height ([710547d](https://github.com/andots/parus/commit/710547d6d78fb06d95d23b97e0887213852c21e2))
* **front:** remove pinned URLs stuffs  from settings page and related state ([7054ede](https://github.com/andots/parus/commit/7054ede6e528162a98ddff156bb7596373beb06e))
* **front:** update layout and styling for App component to enhance scrollbar visibility and spacing ([1142f16](https://github.com/andots/parus/commit/1142f163a15208d249287d2b73679253dc8e1246))


### Features

* add functionality to retrieve toolbar bookmarks ([e7a6177](https://github.com/andots/parus/commit/e7a6177a8d71326ea63d9474d6091526f116e62e))
* **core:** append bookmark to toolbar functionality and error handling for missing toolbar folder ([2f95ee3](https://github.com/andots/parus/commit/2f95ee3fca02266629c142e670f27fe07de8f758))
* **front:** add home button to toolbar with navigation functionality ([f9bfaa2](https://github.com/andots/parus/commit/f9bfaa2a4cfb18b4ca84dee0ae3778283c24a41a))
* **front:** implement toolbar bookmarks retrieval and display in the toolbar ([cdc2bcd](https://github.com/andots/parus/commit/cdc2bcd4327ff2d4305f7085b491e1d2e14f6227))
* **front:** integrate append bookmark to toolbar functionality ([d2200f1](https://github.com/andots/parus/commit/d2200f10866bf45b40492bf46a43dce8ab205c78))

# [0.15.0](https://github.com/andots/parus/compare/v0.14.0...v0.15.0) (2025-02-22)


### Bug Fixes

* improve count_bookmarks method by filtering removed nodes first ([4fc3264](https://github.com/andots/parus/commit/4fc32642df58916abbf97c4a4d021802f59450ec))


### Features

*  Bookmarks::default() make root and toolbar folder ([02a695f](https://github.com/andots/parus/commit/02a695f3d034d0c02d29f3b331292d9e2f423d0b))
* add count method to Bookmarks and update tests ([26141dc](https://github.com/andots/parus/commit/26141dcce6fb205fc80662ac96d2af4c0929bb53))
* add count_all_nodes and count_bookmarks methods to Bookmarks ([abdd568](https://github.com/andots/parus/commit/abdd5689a9901cd3ad86ab394511339d6c6bdbf3))

# [0.14.0](https://github.com/andots/parus/compare/v0.13.1...v0.14.0) (2025-02-21)


### Bug Fixes

* update build targets to only include MSI ([0e9e4a7](https://github.com/andots/parus/commit/0e9e4a773aca3a925aab745adc437068c1d87039))


### Features

* add top-loading bar component ([ad44326](https://github.com/andots/parus/commit/ad443260a98147c88c76467bfdf9ea5a3a42cc65))
* integrate page navigation event with loading bar ([9990378](https://github.com/andots/parus/commit/999037841e37125f09a9e3ba8c821db3df70f0fc))

## [0.13.1](https://github.com/andots/parus/compare/v0.13.0...v0.13.1) (2025-02-21)


### Bug Fixes

* add loading state to start page URL update and update getSettings to return a promise ([2fdf3c1](https://github.com/andots/parus/commit/2fdf3c1f2b42e36292a068ec1ab94cb3a3010a30))
* title/url detection improved, eval scripts on page load ([314a60e](https://github.com/andots/parus/commit/314a60ea308b5030ad427f97cbf4b92071b5d93f))

# [0.13.0](https://github.com/andots/parus/compare/v0.12.0...v0.13.0) (2025-02-21)


### Bug Fixes

* add conditional rendering for folders and improve initial value handling in RootChildrenSelect ([1440c08](https://github.com/andots/parus/commit/1440c086d38017763c31a83fcc0b83974651765a))
* handle null bookmarks and improve current top-level retrieval in BookmarkTree ([5ad42fb](https://github.com/andots/parus/commit/5ad42fbc867c19eaa902e576c1c2e81554c34a09))


### Features

* add is_open property to BookmarkData and implement toggle/set methods in Bookmarks ([cad529d](https://github.com/andots/parus/commit/cad529d399988f16c34e1a6355e8181fb5718393))
* integrate toggle and set methods with frontend ([23e58d4](https://github.com/andots/parus/commit/23e58d469acca248f82ab0c749397b8dd64de5d3))

# [0.12.0](https://github.com/andots/parus/compare/v0.11.0...v0.12.0) (2025-02-20)


### Bug Fixes

* add error handling for moving to the same node and improve existing error checks ([ce527d4](https://github.com/andots/parus/commit/ce527d430ce22ee2ae26e2105b842f74f276bed2))
* append under root when destination is root ([cc1b5c9](https://github.com/andots/parus/commit/cc1b5c9f10f7d8d3f5e7df02bd21e03bb5156c39))
* disabling tauri's drag and drop handler ([427b617](https://github.com/andots/parus/commit/427b6172356a7109259febb5dcdd4837c27a9d1c))
* prepend to the root, not append ([12f4d56](https://github.com/andots/parus/commit/12f4d56225121dbb45155adf4c687ca7f60f8b37))
* prevent default action on bookmark node click and navigate to url ([a36f2e4](https://github.com/andots/parus/commit/a36f2e4b7ce283193ba366d5178bd3a56ef30673))
* root and top level node should not be draggable ([2b144fb](https://github.com/andots/parus/commit/2b144fb1b4f50f5c2b25df4e66b0d795c751afce))
* root should not be draggable ([8341c0a](https://github.com/andots/parus/commit/8341c0ac0c3c069bce86beafbcfe2ca356c0f769))
* simplify node movement logic by removing unnecessary detach calls ([e3c0639](https://github.com/andots/parus/commit/e3c06394e86412adfa05bc5f0c1c74b4ef319ae6))
* use createEffect for drag event listeners in BookmarkTree component ([761fdfa](https://github.com/andots/parus/commit/761fdfa335f5dd48282f1489f0404c725d148c99))


### Features

* add indicator for currently dragged bookmark in BookmarkTree component ([2e565a9](https://github.com/andots/parus/commit/2e565a905cc2151055c1d5eeb420b12cd0ce5baa))
* add move_subtree_after method ([51ec515](https://github.com/andots/parus/commit/51ec515e8c53c46c9add156ab201fca575700a95))
* distinguish between inside and indicator states ([0f98f5c](https://github.com/andots/parus/commit/0f98f5cd017d517eaa4005b303d9da3a08a57919))
* force to be inside for current top level ([c9c918e](https://github.com/andots/parus/commit/c9c918e64268c49ff5bd0941fbeee43e91ecdb1b))
* implement move_to_children method for moving nodes to destination children ([23b18ab](https://github.com/andots/parus/commit/23b18ab1db6cfd88c8d02dcf4fb06f361af4d9eb))
* integrate detach and insert after functionality for bookmarks ([b094ea6](https://github.com/andots/parus/commit/b094ea64d4f61b1012b0343071e099b787742c43))
* integrate move to children method to frontend ([740ff94](https://github.com/andots/parus/commit/740ff946ae48fc5e168b3431edf657a7949345d7))
* pass dragging state (none, after, inside) as props to BookmarkNode ([986ec5e](https://github.com/andots/parus/commit/986ec5e97ffb6f94d224f0b1264ab8f72d7cd481))

# [0.11.0](https://github.com/andots/parus/compare/v0.10.0...v0.11.0) (2025-02-18)


### Bug Fixes

* closing function BookmarkEditDialog and DeleteConfirmDialog ([3db7885](https://github.com/andots/parus/commit/3db78858d4c0cc0745f4a2bae60609ba612f3df5))
* dialog closure and target reset in BookmarkEditDialog ([428645b](https://github.com/andots/parus/commit/428645b94a7e275d51b447ebc96f76baf06e1b61))
* enhance bookmark navigation by handling hidden external state ([6dd31ae](https://github.com/andots/parus/commit/6dd31ae8b24d7dbc82f953cf36f5634a7d453382))
* improve folder toggle functionality and navigation in BookmarkTreeEditable ([68a4cf3](https://github.com/andots/parus/commit/68a4cf347b53283c6cf65b50f7f9e26db60e7f07))
* remove focus-visible:ring-ring from Button ([5bc8f6c](https://github.com/andots/parus/commit/5bc8f6c042cb0bd9323e81bc292f6de2e6e87c0a))
* reset target state in delete confirmation dialog ([f6521e5](https://github.com/andots/parus/commit/f6521e550033d701ae829e2088d84df9a0cd1034))


### Features

* add delete confirmation dialog for bookmarks ([e24dd3c](https://github.com/andots/parus/commit/e24dd3cc55e8380ad37c9dc90f688dd84cd6877c))

# [0.10.0](https://github.com/andots/parus/compare/v0.9.0...v0.10.0) (2025-02-18)


### Bug Fixes

* new pinned URLs in SettingsPage ([4e3641f](https://github.com/andots/parus/commit/4e3641fafc619cab848838acad712c58bdbfc0ec))


### Features

* add URL validation for pinned URLs and start page URL in SettingsPage ([5d65409](https://github.com/andots/parus/commit/5d654098d37ae7eae63ede9bb4db9587453b620f))

# [0.9.0](https://github.com/andots/parus/compare/v0.8.0...v0.9.0) (2025-02-18)


### Bug Fixes

* correct spelling of get_default_app_title in AppHandleExt trait ([ce4287f](https://github.com/andots/parus/commit/ce4287f5607d32f497defe757cad857251147e23))
* update product name and identifier in tauri.conf.json to avoid name collision ([515656a](https://github.com/andots/parus/commit/515656ac05625ce754d774e924414dc58a15e4a5))


### Features

* implement external title change and navigation handling ([b90730b](https://github.com/andots/parus/commit/b90730b2b4d79db8ce5a82044c96e9f494c08c25))
* update window title with external page title ([3c9d03e](https://github.com/andots/parus/commit/3c9d03ec9933940d268f948751829a395421d1c5))

# [0.8.0](https://github.com/andots/parus/compare/v0.7.2...v0.8.0) (2025-02-17)


### Bug Fixes

* update ToolBar component to manage page state transitions ([b5fec6c](https://github.com/andots/parus/commit/b5fec6c08cecc857b94081bf35c1967edee38ed7))


### Features

* implement updateSettings functionality in SettingsPage and backend ([ba7ccf0](https://github.com/andots/parus/commit/ba7ccf0acf963b4aac5405997b20fb86cbf7f560))
* sync SettingsPage with state management and default settings ([240a343](https://github.com/andots/parus/commit/240a3436cec4b210dcf09f94a231e10140bed758))

## [0.7.2](https://github.com/andots/parus/compare/v0.7.1...v0.7.2) (2025-02-17)


### Bug Fixes

* update release workflow to use signing keys for Tauri artifacts ([3fc6da1](https://github.com/andots/parus/commit/3fc6da1dcdf113318f04386ce364877515e31b2c))

## [0.7.1](https://github.com/andots/parus/compare/v0.7.0...v0.7.1) (2025-02-17)


### Bug Fixes

* enable creation of updater artifacts in tauri configuration ([539841e](https://github.com/andots/parus/commit/539841e8e16de14e89ce4ca28fc9e2697d740bf5))

# [0.7.0](https://github.com/andots/parus/compare/v0.6.0...v0.7.0) (2025-02-17)


### Features

* implement updater functionality with dialog prompts for version updates ([7564ba8](https://github.com/andots/parus/commit/7564ba8105ecab8718bf545c1f506be672a7ab5a))

# 0.6.0 (2025-02-17)


### Bug Fixes

* change external state change function to return a promise ([416c941](https://github.com/andots/parus/commit/416c9411a35984fbb768b6cdb135ce510ad1d645))
* find target URL using starts_with ([800b6ef](https://github.com/andots/parus/commit/800b6ef98afc733f8fcad681048d7829093e5e17))
* folder handling in RootChildrenSelect and bookmarks store ([b1424f6](https://github.com/andots/parus/commit/b1424f670c525dd48c6bd9f32367fbf28dc67ba6))
* get root node data correctly ([862a699](https://github.com/andots/parus/commit/862a6997029e3c15b33b2386e8eafe0a68ed890d))
* handle empty URL in AddressBar and update default URL in settings ([c73b77e](https://github.com/andots/parus/commit/c73b77e62bfc33d72614895c1cc3211bb7cb7cd1))
* hide add bookmark context menu ([82ed86f](https://github.com/andots/parus/commit/82ed86f0a58646cfc2226199d20bc7bf3015e540))
* lock after file create ([f3e975c](https://github.com/andots/parus/commit/f3e975c0e6af327479af75e28478a57569925a4d))
* pass user settings to create_window function ([2e7bf9c](https://github.com/andots/parus/commit/2e7bf9cc5ec95d14a2d8b27989db9912fd2e2106))
* remove async from toggleFavorite and simplify event emission ([3ac47fe](https://github.com/andots/parus/commit/3ac47feb8c70a26858089621840810967d1e003e))
* remove bookmark update listener and related code ([2890658](https://github.com/andots/parus/commit/289065834ebde0ef8725fb6df98a73fd6d3a3f3b))
* remove onMount in RootChildrenSelect and get data in initApp() ([aa011a1](https://github.com/andots/parus/commit/aa011a185fcdde5fa411973d3db0b4c159350701))
* update root bookmark name from "Root" to "All Bookmarks" ([d15a157](https://github.com/andots/parus/commit/d15a157aee1f326d0ed90f060bbdde172af1c74a))
* update title only if it's not empty and the index is not 0 ([3f68a0b](https://github.com/andots/parus/commit/3f68a0ba9e8f0568dfc9ef8018de48b74bb2da0a))
* use app_data_dir() to store app data ([6385e84](https://github.com/andots/parus/commit/6385e8491782f1f64a379e716ce29e7807e0a911))
* use div not ul and li ([b94f65c](https://github.com/andots/parus/commit/b94f65c618673bed28b9639c5a422c5e13133dba))


### Features

* add add_folder method to BookmarkArena for creating new folders ([72f6d7e](https://github.com/andots/parus/commit/72f6d7e7fca7ac152635848886fd29472ba661ba))
* add AddFolderDialog component and integrate folder creation functionality ([9982cbf](https://github.com/andots/parus/commit/9982cbfbdb01318e499fc7a84dcc706fce2c23d6))
* add bookmark edit mode on frontend ([8323034](https://github.com/andots/parus/commit/8323034701d62c0de247bddbb3dc8e347584758a))
* add bookmark with starting index that is shown on the current top of the bookmarks ([0aa6e5a](https://github.com/andots/parus/commit/0aa6e5ac2848a44b244029e1c450c0fe60acf4ab))
* add BookmarkEditDialog for editing bookmark titles and manage dialog state ([b93b147](https://github.com/andots/parus/commit/b93b1474b96d4cc149b6a41c247859f46b0365f8))
* add context menu handler to manage external state visibility ([7b47188](https://github.com/andots/parus/commit/7b4718839d31f77704c83d319c0ea842895adabc))
* add dialog and context-menu from solid-ui ([76c55b7](https://github.com/andots/parus/commit/76c55b7c530c4a068dd3b4393b56937ede90c223))
* add FolderData type and implement get_root_children_folder method in BookmarkArena ([fea332f](https://github.com/andots/parus/commit/fea332f728dd5e542284872eb70a1ed8bfc12537))
* add functionality to create a new folder in bookmarks ([2ffef26](https://github.com/andots/parus/commit/2ffef26d3226fbb8dfb618ee111cbcf89ac4f382))
* add get_default_title method to AppHandleExt and remove unused utils ([92f9352](https://github.com/andots/parus/commit/92f9352bf60882bf2957c5d7123be4d87964338d))
* add handlePinnedUrl function to manage pinned URL navigation ([cc1a806](https://github.com/andots/parus/commit/cc1a8063c4f996959d75858c64a526685c89c185))
* add methods to retrieve root node ID and its children in BookmarkArena ([80e17a9](https://github.com/andots/parus/commit/80e17a94683df4a7dcfcf8178225b818503a8981))
* add pinned_urls to UserSettings with default values ([da1b0e7](https://github.com/andots/parus/commit/da1b0e7649c0ad083a7354c238094277e8c02ca5))
* add RootChildrenSelect component and update invokes for root children retrieval ([8deaab4](https://github.com/andots/parus/commit/8deaab4704fcef9ac084f9af3d103e883bd65238))
* add save_to_file method for BookmarkArena ([8687344](https://github.com/andots/parus/commit/868734481b2cd01e14270b2c6dcfa81c025288a9))
* add sidebar toggle functionality with Octicon icons ([8dc334e](https://github.com/andots/parus/commit/8dc334ecd72a70f6a2b2b54b9bff7a641c6e83ac))
* add try_new method to BookmarkData for creating bookmarks with validation ([43266e4](https://github.com/andots/parus/commit/43266e4ac6993ab50178a57d7ab28c06d2dc500d))
* add update_title method to modify bookmark titles in rust side ([e8016c1](https://github.com/andots/parus/commit/e8016c114c0f320b4f0932856dc2bca02bf96313))
* conditionally render edit and remove buttons for non-root bookmarks ([4389c92](https://github.com/andots/parus/commit/4389c920c359c6e3db0585d3d4e4382d23f3badd))
* conditionally show delete option in context menu for non-root bookmarks ([bd4bf3f](https://github.com/andots/parus/commit/bd4bf3f19eb47993d4de10ac75ed4ccdbeec1328))
* disable right-click context menu ([dc23e3e](https://github.com/andots/parus/commit/dc23e3e6a54252f72f3662a99c50a9109ae47e99))
* enhance BookmarkTree component with folder and bookmark icons ([def8e47](https://github.com/andots/parus/commit/def8e47f6f9345e900f745bbede4b50e6e59f44c))
* enhance Favicon component with customizable size ([440a070](https://github.com/andots/parus/commit/440a070be36ddc9a226def25a7d1dd68efa3e823))
* enhance file name handling for debug and release builds ([2d16be9](https://github.com/andots/parus/commit/2d16be9a47f61e428efb0c8522bddec1487da15a))
* filter nodes to only include folders when retrieving children ([92b1b24](https://github.com/andots/parus/commit/92b1b24bb5e82b51e3fd15d43c2057ffe7500825))
* finding automatic location to smart bookmark ([fd77eb0](https://github.com/andots/parus/commit/fd77eb04d1b62aa952996986a79231c8375cebd8))
* frontend can call  get_settings from state ([696cffa](https://github.com/andots/parus/commit/696cffa96280ee051cd3e4416f73a798232c3b5f))
* implement bookmark removal functionality from frontend ([f59085b](https://github.com/andots/parus/commit/f59085b4de5804e7fc347e01297265124643e493))
* implement bookmark retrieval by index and update related components ([657e989](https://github.com/andots/parus/commit/657e9899743219b1ff5946c9ed5d61728a450ca5))
* implement bookmark title update functionality in frontend ([7c3b3fc](https://github.com/andots/parus/commit/7c3b3fc9839b2a8c9c58f351fda188fbc4e99b43))
* implement get_root_children command ([26bbcba](https://github.com/andots/parus/commit/26bbcbaf377db38436bab964368e7f032577c527))
* implement settings synchronization and show favicon for pinned urls ([115bcda](https://github.com/andots/parus/commit/115bcda28635b61dad27f66419f3a4033d97c2ee))
* initialize BookmarkArena with default folder groups ([5cb27b0](https://github.com/andots/parus/commit/5cb27b074dac8dd7f23904f8a17df9f4b054f5f4))
* integrate new icon components in AddressBar and update icon rendering logic ([5b8e7c5](https://github.com/andots/parus/commit/5b8e7c5711b8fd31c3de590c9303898ae6da727c))
* integrating delete action into context menu ([12dcd1d](https://github.com/andots/parus/commit/12dcd1d8ee4c3bfadfbcdcc9b32f64425a356921))
* move emit_page_params to injects module and update event emission ([0508695](https://github.com/andots/parus/commit/050869574a3fdf193b941969c954044dcbdab84c))
* navigate to url onClick favicon ([20d8725](https://github.com/andots/parus/commit/20d87252478040b8d987fa38885e1740ed03092f))
* new_root, new_folder ([b4b5d23](https://github.com/andots/parus/commit/b4b5d238f40502db887fa716eb70575a383a4e1d))
* passing index to get nested json ([8274e09](https://github.com/andots/parus/commit/8274e09ed77c0cfdd1fac4432edafdc52cce5c05))
* remove bookmark with the starting index ([33146b4](https://github.com/andots/parus/commit/33146b4c9434d6ff020595d6eff79f2f40cac9a0))
* remove subtree ([515c0c2](https://github.com/andots/parus/commit/515c0c2cf58f88027ddd6e217359b21f5563facd))
* root node must not be removed ([7ea50d6](https://github.com/andots/parus/commit/7ea50d6eac2b813b336c98ddb0735d711e7fed71))
* set webview data directory to app dir ([a91d6f9](https://github.com/andots/parus/commit/a91d6f90a7afaa7de6378a5d1ad62807794892e7))
* update RootChildrenSelect to use FolderData and adjust invokes for root children retrieval ([0068789](https://github.com/andots/parus/commit/0068789754727ef3be714513199cb446edb13bd5))
* wrap bookmark item with ContextMenu ([db26997](https://github.com/andots/parus/commit/db26997cea24ed58060d7b41661b061dd95eb9df))

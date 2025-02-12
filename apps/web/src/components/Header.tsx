import { Button } from "@repo/ui/button";
import type { Component } from "solid-js";
import {
  invokeGetAppWebviewBounds,
  invokeGetExternalWebviewBounds,
  invokeSetExternalWebviewBounds,
} from "../invokes";
import AddressBar from "./AddressBar";

const Header: Component = () => {
  const handleRefresh = () => {
    // console.log("Refreshing page...");
    // ここに更新ロジックを実装
  };

  const handleFavorite = () => {
    // console.log("Toggling favorite...");
    // ここにお気に入り処理を実装
  };

  const handleMenuClick = async () => {
    const appBounds = await invokeGetAppWebviewBounds();
    const externalBounds = await invokeGetExternalWebviewBounds();
    // TODO: must be user defined state
    const headerHeight = 40;
    const sidebarWidth = 200;
    if (externalBounds.position.Physical.x === 0) {
      // 全画面状態なので、サイドバー分の幅を引く
      await invokeSetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width - sidebarWidth,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: sidebarWidth, y: headerHeight },
      });
    } else {
      await invokeSetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: 0, y: headerHeight },
      });
    }
  };

  return (
    <header class="sticky top-0 z-50 w-full h-[40px] border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div class="flex justify-center items-center w-full h-full">
        <Button
          class="w-8 h-8 m-2 p-2 [&_svg]:size-6 [&_svg]:shrink-0"
          variant="ghost"
          onClick={handleMenuClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <title>menu</title>
            <path fill="currentColor" d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
          </svg>
        </Button>
        <AddressBar onRefresh={handleRefresh} onFavorite={handleFavorite} />
      </div>
    </header>
  );
};

export default Header;

import * as mc from "@minecraft/server";

declare module "@minecraft/server" {
  interface Player {
    money: number;
    id: number;
  }
  interface World {
    id: number;
  }
}

import * as mc from "@minecraft/server";

let world = mc.world;
let system = mc.system;

let hpMax;
let atk;
let atkSpd;
let atkSpdDelay;
let def;
let move;

// 1/n*20

system.runInterval(() => {
  for (let player of world.getPlayers()) {
    hpMax = 100;
    atk = 10;
    atkSpd = 1 / (35 /*spd*/ / 20);
    def = 5;
    move = 0.5; //1;

    if (player.hasTag("zombie")) {
      hpMax *= 1.2;
      atk *= 1;
      def *= 0.9;
      atkSpd *= 0.8;
      atkSpdDelay = Math.round((1 / atkSpd) * 20);
      move *= 0.8;
    } else {
      hpMax = undefined;
      player.hp = undefined;
      atk = undefined;
      def = undefined;
      atkSpd = undefined;
      move = undefined;
    }

    if (player.hp == undefined) player.hp = hpMax;

    if (atkSpd <= 0) {
      atkSpd = 1;
    }

    if (atk <= 0) {
      atk = 1;
    }

    if (def < 0) {
      def = 0;
    }

    if (hpMax > 2147483647) {
      hpMax = 2147483647;
    }

    if (atk > 2147483647) {
      atk = 2147483647;
    }

    if (def > 2147483647) {
      def = 2147483647;
    }

    if (move > 2147483647) {
      move = 2147483647;
    }

    player.hpMax = hpMax;
    player.atk = atk;
    player.atkSpd = atkSpd.toFixed(2);
    player.def = def;
    player.move = move;
  }
});

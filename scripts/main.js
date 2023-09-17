import * as mc from "@minecraft/server";

import "./entity";
import "./attr";

let world = mc.world;
let system = mc.system;

world.afterEvents.worldInitialize.subscribe((ev) => {
  const def = new mc.DynamicPropertiesDefinition();
  def.defineNumber("hp");
  def.defineNumber("hpMax");
  def.defineNumber("atk");
  def.defineNumber("def");
  def.defineNumber("atkSpd");
  def.defineNumber("atkSpdDelay");
  def.defineNumber("move");
  def.defineNumber("skill1");
  def.defineNumber("skill2");
  def.defineNumber("skillCool1");
  def.defineNumber("skillCool2");
  def.defineNumber("moveLocationX");
  def.defineNumber("moveLocationZ");
  def.defineNumber("atkLocationX");
  def.defineNumber("atkLocationZ");
  ev.propertyRegistry.registerEntityTypeDynamicProperties(
    def,
    mc.MinecraftEntityTypes.player
  );
});

system.runInterval(() => {
  for (let player of world.getPlayers()) {
    player.onScreenDisplay.setActionBar(
      `체력: ${player.hp}/${player.hpMax}\n공격력: ${player.atk}, 방어력: ${
        player.def
      }\n공격속도: ${player.atkSpd}, 이동속도: ${player.move / 0.5}`
    );
    if (
      Math.floor(player.location.x) == 8 &&
      Math.floor(player.location.y) == -60 &&
      Math.floor(player.location.z) == -15
    ) {
      player.addTag("zombie");
      player.runCommandAsync("spreadplayers -6 30 1 20 @s");
      player.runCommandAsync(`summon zombie ${player.name} ~ -60 ~`);
    }
  }
});

world.beforeEvents.chatSend.subscribe((re) => {
  if (re.sender.isOp() && re.message == "\\c/.") {
    re.cancel = true;
    if (re.sender.hasTag("c")) {
      re.sender.runCommandAsync("tag @s remove c");
    } else {
      re.sender.runCommandAsync("tag @s add c");
      re.sender.runCommandAsync("clear @s");
    }
  }
});

world.afterEvents.itemUse.subscribe((re) => {
  let item = re.itemStack;
  let player = re.source;
  if (item.typeId == "minecraft:leather_boots") {
    player.runCommandAsync(`tag @e[name=${player.name}] remove attack`);
    player.runCommandAsync(`tag @e[name=${player.name}] add move`);
    player.moveLocationX = player.location.x;
    player.moveLocationZ = player.location.z;
    player.runCommandAsync("playsound random.orb @s ~~-1~");
    player.runCommandAsync("particle minecraft:villager_happy ~ -53.5 ~");
  } else if (item.typeId == "minecraft:iron_sword") {
    player.runCommandAsync(`tag @e[name=${player.name}] remove move`);
    player.runCommandAsync(`tag @e[name=${player.name}] add attack`);
    player.atkLocationX = player.location.x;
    player.atkLocationZ = player.location.z;
    player.runCommandAsync("playsound random.orb @s ~~-1~");
  }
});

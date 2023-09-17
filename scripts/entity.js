import * as mc from "@minecraft/server";

let world = mc.world;
let system = mc.system;

system.runInterval(() => {
  for (let entity of world.getDimension("overworld").getEntities()) {
    if (entity.hasTag("entity")) {
      if (entity.hasTag("move")) {
        let mx = world.getPlayers({ name: entity.nameTag })[0].moveLocationX;
        let mz = world.getPlayers({ name: entity.nameTag })[0].moveLocationZ;
        let m = world.getPlayers({ name: entity.nameTag })[0].move;
        if (mx != undefined) {
          entity.teleport(
            { x: entity.location.x, y: -60, z: entity.location.z },
            { facingLocation: { x: mx, y: -60, z: mz } }
          );
          entity.applyKnockback(
            entity.getViewDirection().x,
            entity.getViewDirection().z,
            m,
            0
          );
        }
        if (
          Math.floor(entity.location.x) == Math.floor(mx) &&
          Math.floor(entity.location.z) == Math.floor(mz)
        ) {
          entity.removeTag("move");
        }
      }
      if (entity.hasTag("attack")) {
        let ax = world.getPlayers({ name: entity.nameTag })[0].atkLocationX;
        let az = world.getPlayers({ name: entity.nameTag })[0].atkLocationZ;
        if (ax != undefined) {
          entity.runCommandAsync(
            `execute as @s at @s positioned ^^^1 run damage @a[r=1.2,c=1,name=!${entity.nameTag}] 1 entity_attack entity @s`
          );
        }
        entity.removeTag("attack");
      }
      if (!entity.hasTag("move")) {
        let ry = world.getPlayers({ name: entity.nameTag })[0].getRotation().y;
        entity.teleport(
          { x: entity.location.x, y: -60, z: entity.location.z },
          { rotation: { x: 0, y: ry } }
        );
      }
    }
  }
});

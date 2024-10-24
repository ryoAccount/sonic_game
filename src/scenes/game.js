import { makeMotobug } from "../entities/motobug";
import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function game() {
  k.setGravity(3100);

  const bgPieceWidth = 1920;
  const bgPieces = [
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8), k.area()]),
    k.add([k.sprite("chemical-bg"), k.pos(bgPieceWidth * 2, 0), k.scale(2), k.opacity(0.8), k.area()]),
  ];

  const platformsWidth = 1280;
  const platforms = [k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]), k.add([k.sprite("platforms"), k.pos(platformsWidth * 4, 450), k.scale(4)])];

  const sonic = makeSonic(k.vec2(200, 745));
  sonic.setControls();
  sonic.setEvents();

  let gameSpeed = 300;
  k.loop(1, () => {
    gameSpeed += 50;
  });

  const spawnMotoBug = () => {
    const motobug = makeMotobug(k.vec2(1950, 773));
    motobug.onUpdate(() => {
      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return;
      }

      motobug.move(-gameSpeed, 0);
    });

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) {
        k.destroy(motobug);
      }
    });

    const waitTime = k.rand(0.5, 2.5);
    k.wait(waitTime, spawnMotoBug);
  };
  spawnMotoBug();

  k.add([k.rect(1920, 300), k.opacity(0), k.area(), k.pos(0, 832), k.body({ isStatic: true })]);

  k.onUpdate(() => {
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      bgPieces.push(bgPieces.shift());
    }

    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platformsWidth * 4, 450);
      platforms.push(platforms.shift());
    }

    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platformsWidth * 4, 450);
  });
}

declare module "three" {
  export class CanvasTexture {
    constructor(canvas: HTMLCanvasElement);
  }

  export class SpriteMaterial {
    constructor(params: {
      map: CanvasTexture;
      transparent?: boolean;
      depthWrite?: boolean;
    });
  }

  export class Sprite {
    position: { set(x: number, y: number, z: number): void };
    scale: { set(x: number, y: number, z: number): void };
    constructor(material?: SpriteMaterial);
  }
}

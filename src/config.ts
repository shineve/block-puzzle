export const tileCountPerRowOrColumn: number = 4;
export const animationDuration: number = 250;
export const pixelSize: number = Number(
  getComputedStyle(document.body).getPropertyValue('--pixel-size'),
);
export const boardMargin: number = 2 * pixelSize;

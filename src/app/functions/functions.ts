export interface Color {
  r: number;
  g: number;
  b: number;
}

export function rgbToLab(color: Color): number[] {
  let { r, g, b } = color;
  r /= 255;
  g /= 255;
  b /= 255;

  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;

  let fx = x > 0.008856 ? Math.pow(x, 1 / 3) : (903.3 * x + 16) / 116;
  let fy = y > 0.008856 ? Math.pow(y, 1 / 3) : (903.3 * y + 16) / 116;
  let fz = z > 0.008856 ? Math.pow(z, 1 / 3) : (903.3 * z + 16) / 116;

  const l = Math.max(0, 116 * fy - 16);
  const a = 500 * (fx - fy);
  const b1 = 200 * (fy - fz);

  return [l, a, b1];
}

export function calculateDistance(color1: Color, color2: Color): number {
  const lab1 = rgbToLab(color1);
  const lab2 = rgbToLab(color2);

  const deltaL = lab2[0] - lab1[0];
  const deltaA = lab2[1] - lab1[1];
  const deltaB = lab2[2] - lab1[2];

  const distance = Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2);
  return distance;
}

export function findClosestColor(
  targetColor: Color,
  colorArray: Color[]
): Color | null {
  let closestColor: Color | null = null;
  let minDistance: number = Infinity;

  for (const color of colorArray) {
    const distance = calculateDistance(targetColor, color);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }

  return closestColor;
}

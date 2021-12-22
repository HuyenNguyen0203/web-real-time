export enum Devices {
  Video = 'Video',
  Audio = 'Audio'
}

export enum ShapeTypes {
  Circle,
  Square,
  Triangle
}

export const ShapeTypesLabel = new Map<ShapeTypes, string>([
  [ShapeTypes.Circle, 'Circle'],
  [ShapeTypes.Square, 'Square'],
  [ShapeTypes.Triangle, 'Triangle']
]);
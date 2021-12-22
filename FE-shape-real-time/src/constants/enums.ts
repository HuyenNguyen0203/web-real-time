export enum Devices {
  Video = 'Video',
  Audio = 'Audio'
}

export enum ShapeTypes {
  Circle,
  Square,
  Triangle
}

export const ShapeTypesLabel = [
  {
    value: ShapeTypes.Circle, text: 'Circle', icon: 'circle outline'
  },
  {
    value: ShapeTypes.Square, text: 'Square', icon: 'square outline'
  },
  {
    value: ShapeTypes.Triangle, text: 'Triangle', icon: '', imgUrl: require('../assets/images/triangle-a.png')
  },
];

// new Map<ShapeTypes, string, string>([
//   [ShapeTypes.Circle, 'Circle'],
//   [ShapeTypes.Square, 'Square'],
//   [ShapeTypes.Triangle, 'Triangle']
// ]);
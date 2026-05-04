export interface IconDefinition {
  id: string;
  name: string;
  path: string;
  viewBox: string;
}

export const ICONS: IconDefinition[] = [
  {
    id: 'circle',
    name: 'Circle',
    path: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
    viewBox: '0 0 200 200'
  },
  {
    id: 'square',
    name: 'Square',
    path: 'M 25,25 L 175,25 L 175,175 L 25,175 Z',
    viewBox: '0 0 200 200'
  },
  {
    id: 'triangle',
    name: 'Triangle',
    path: 'M 100,25 L 175,175 L 25,175 Z',
    viewBox: '0 0 200 200'
  },
  {
    id: 'star',
    name: 'Star',
    path: 'M 100,10 L 123,80 L 198,80 L 138,125 L 160,195 L 100,150 L 40,195 L 62,125 L 2,80 L 77,80 Z',
    viewBox: '0 0 200 200'
  },
  {
    id: 'heart',
    name: 'Heart',
    path: 'M 100,50 C 100,20 150,20 150,50 C 150,110 100,150 100,180 C 100,150 50,110 50,50 C 50,20 100,20 100,50 Z',
    viewBox: '0 0 200 200'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    path: 'M 100,0 L 200,100 L 100,200 L 0,100 Z',
    viewBox: '0 0 200 200'
  },
  {
    id: 'bolt',
    name: 'Bolt',
    path: 'M 120,0 L 40,110 L 90,110 L 80,200 L 160,90 L 110,90 Z',
    viewBox: '0 0 200 200'
  }
];

export const FONTS = [
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Outfit', value: '"Outfit", sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { name: 'Unbounded', value: '"Unbounded", sans-serif' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
  { name: 'Syne', value: '"Syne", sans-serif' }
];

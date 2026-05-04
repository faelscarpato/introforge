export enum AnimationType {
  FADE = 'fade',
  SLIDE_UP = 'slide_up',
  SCALE = 'scale',
  TYPEWRITER = 'typewriter',
  BLUR_REVEAL = 'blur_reveal',
  Glitch = 'glitch',
  SVG_STROKE = 'svg_stroke',
  ELASTIC_POP = 'elastic_pop',
  MORPH = 'morph',
  TEXT_STROKE = 'text_stroke'
}

export enum ExportFormat {
  REACT_FRAMER = 'react_framer',
  HTML_CSS = 'html_css'
}

export type IconPosition = 'top' | 'bottom' | 'left' | 'right';

export interface AnimationConfig {
  text: string;
  subText: string;
  type: AnimationType;
  duration: number;
  delay: number;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontSize: number;
  letterSpacing: number;
  easing: string;
  fontFamily?: string;
  iconId?: string;
  morphIconId?: string;
  iconColor?: string;
  strokeWidth?: number;
  iconPosition?: IconPosition;
  itemSpacing?: number;
}

export interface GeneratedCode {
  code: string;
  language: string;
}

export interface Presets {
  [key: string]: Partial<AnimationConfig>;
}

export type Direction = '事业' | '感情' | '财运';

export interface UserInput {
  birthday: string;
  direction: Direction;
}

export interface FortuneResult {
  content: string;
  zodiac: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

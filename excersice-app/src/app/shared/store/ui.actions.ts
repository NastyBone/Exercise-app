import { Action } from '@ngrx/store';

export const START_LOADING = '[UI] Start Loading Spinner';
export const STOP_LOADING = '[UI] Stop Loading Spinner';

export class StartLoading implements Action {
  readonly type: string = START_LOADING;
}

export class StopLoading implements Action {
  readonly type: string = STOP_LOADING;
}

export type UIActionsType = StartLoading | StopLoading;

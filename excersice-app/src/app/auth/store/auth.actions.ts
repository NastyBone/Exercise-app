import { Action } from '@ngrx/store';

export const SET_AUTH = '[Auth] Set Aunhenticated User';
export const SET_UNAUTH = '[UI] Set Unauthenticated User';

export class SetAuth implements Action {
  readonly type: string = SET_AUTH;
}

export class SetUnauth implements Action {
  readonly type: string = SET_UNAUTH;
}

export type AuthActionsType = SetAuth | SetUnauth;

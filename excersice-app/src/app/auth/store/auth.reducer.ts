//import { Action } from '@ngrx/store';
import { STOP_LOADING } from 'src/app/shared/store/ui.actions';
import { SET_AUTH, SET_UNAUTH, AuthActionsType } from './auth.actions';
export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false,
};

export function appReducer(state = initialState, action: AuthActionsType) {
  switch (action.type) {
    case SET_AUTH:
      return {
        isAuthenticated: true,
      };
    case SET_UNAUTH:
      return {
        isAuthenticated: false,
      };
  }
  return state;
}

export const getIsAuthenticated = (state: State) => state.isAuthenticated;

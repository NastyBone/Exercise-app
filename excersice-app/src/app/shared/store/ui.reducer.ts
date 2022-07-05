//import { Action } from '@ngrx/store';
import { START_LOADING, STOP_LOADING, UIActionsType } from './ui.actions';
export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false,
};

export function appReducer(state = initialState, action: UIActionsType) {
  switch (action.type) {
    case START_LOADING:
      return {
        isLoading: true,
      };
    case STOP_LOADING:
      return {
        isLoading: false,
      };
  }
  return state;
}

export const getIsLoading = (state: State) => state.isLoading;

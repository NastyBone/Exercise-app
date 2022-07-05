import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import * as fromUIReducer from '../shared/store/ui.reducer';
import * as fromAuthReducer from '../auth/store/auth.reducer';

export interface State {
  ui: fromUIReducer.State;
  auth: fromAuthReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: fromUIReducer.appReducer,
  auth: fromAuthReducer.appReducer,
};

export const getUIState = createFeatureSelector<fromUIReducer.State>('ui');
export const getIsLoading = createSelector(
  getUIState,
  fromUIReducer.getIsLoading
);

export const getAuthState =
  createFeatureSelector<fromAuthReducer.State>('auth');
export const getisAuthenticated = createSelector(
  getAuthState,
  fromAuthReducer.getIsAuthenticated
);

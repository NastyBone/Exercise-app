//import { Action } from '@ngrx/store';
import { Exercise } from '../exercise.model';
import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
  TrainingActionsType,
} from './training.actions';
import * as fromState from '../../store/app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromState.State {
  trainingState: TrainingState;
}
export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise | null;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export function appReducer(state = initialState, action: TrainingActionsType) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload,
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload,
      };

    case START_TRAINING:
      return {
        ...state,
        activeTraining: {
          ...state.availableExercises.find((ex) => ex.id === action.payload),
        },
      };

    case STOP_TRAINING:
      return {
        activeTraining: null,
      };
  }
  return state;
}

export const getInitialState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(
  getInitialState,
  (state: TrainingState) => state.availableExercises
);

export const getFinishedExercises = createSelector(
  getInitialState,
  (state: TrainingState) => state.finishedExercises
);
export const getActiveTraining = createSelector(
  getInitialState,
  (state: TrainingState) => state.activeTraining
);

export const getIsTraining = createSelector(
  getInitialState,
  (state: TrainingState) => state.activeTraining != null
);

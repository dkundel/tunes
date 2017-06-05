import { combineReducers, Action } from 'redux';

import player from './player';

const rootReducer = combineReducers<Action>({
  player
});

export * from './state-types';

export default rootReducer;

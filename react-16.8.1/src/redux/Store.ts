
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as Redux from "redux";

import {ReduxTemplate,} from "./ReduxTemplate";
import {ReduxPageCount,} from "./ReduxPageCount";

import middleware99Template from "./Middleware99Template";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// ストア状態受信構造体
export interface ReduxStoreState{
	stateTemplate: ReduxTemplate.State;
	statePageCount: ReduxPageCount.State;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// ストア作成
export const store: Redux.Store = Redux.createStore(Redux.combineReducers({
	stateTemplate: ReduxTemplate.reducer,
	statePageCount: ReduxPageCount.reducer,
}), Redux.applyMiddleware(
	middleware99Template
));

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


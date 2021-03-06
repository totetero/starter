
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as Redux from "redux";

import { StateTemplate, stateTemplate, } from "@client/redux/state/template";

import middlewareTemplate from "@client/redux/middleware/template";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// ストア状態受信構造体
export interface ReduxStoreState {
	stateTemplate: StateTemplate;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// ストア作成
export const store: Redux.Store = Redux.createStore(Redux.combineReducers({
	stateTemplate,
}), Redux.applyMiddleware(
	middlewareTemplate
));

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


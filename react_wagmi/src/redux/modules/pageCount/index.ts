
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as Redux from "redux";
import { ReduxStoreState, } from "../../store";
import * as reducerCount from "./reducerCount";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 状態構造体
export interface State {
	count: number;
}

// 状態構造体の初期値
const initialState: State = {
	count: 0,
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 状態初期化と処理集積
export const reducer: Redux.Reducer = (state: State | undefined, action: Redux.Action<number>): State => {
	if (state === undefined) { state = Object.assign({}, initialState); }
	state = reducerCount.reducer(state, action);
	return state;
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 処理集積
type TypeArgument1 = Redux.Action<number>;
type TypeArgument2 = Redux.Dispatch<TypeArgument1>;
type TypeArgument3 = Redux.MiddlewareAPI<Redux.Dispatch, ReduxStoreState>;
type TypeReturn1 = Promise<void>;
type TypeReturn2 = (action: TypeArgument1) => TypeReturn1;
type TypeReturn3 = (next: TypeArgument2) => TypeReturn2;
export const middleware: Redux.Middleware = (api: TypeArgument3): TypeReturn3 => (next: TypeArgument2): TypeReturn2 => async (action: TypeArgument1): TypeReturn1 => {
	next(action);
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


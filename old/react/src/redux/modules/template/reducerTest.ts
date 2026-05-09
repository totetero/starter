
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as Redux from "redux";
import createActionType from "../../createActionType";
import { State, } from ".";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 命令識別子
export const actionType: number = createActionType();

// ----------------------------------------------------------------

// 命令構造体
interface Action extends Redux.Action<number> {
	value: number;
}

// ----------------------------------------------------------------

// 命令作成
export function createAction(value: number): Action {
	return {
		type: actionType,
		value,
	};
}

// ----------------------------------------------------------------

// 命令処理
export function reducer(state: State, action: Redux.Action<number>): State {
	if (action.type !== actionType) { return state; }
	const myAction: Action = action as Action;
	const newState: State = Object.assign({}, state);
	newState.value = newState.value + myAction.value;
	return newState;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


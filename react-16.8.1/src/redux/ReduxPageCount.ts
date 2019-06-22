
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as Redux from "redux";

import {ActionBase, ActionTypes,} from "./ActionTypes";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export namespace ReduxPageCount{
	// ----------------------------------------------------------------

	// Redux状態構造体
	export interface State{
		count: number;
	}

	// Redux状態初期値
	const initialState: State = {
		count: 0,
	};

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// カウント命令構造体
	interface ActionCount extends ActionBase{
		count: number;
	}

	// ----------------------------------------------------------------

	// カウント命令作成
	export function createActionCount(count: number): ActionCount{
		return {
			type: ActionTypes.pageCountCount,
			count: count,
		};
	}

	// ----------------------------------------------------------------

	// カウント命令処理
	const reducerCount: Redux.Reducer<State> = (state: State, action: ActionBase): State => {
		if(action.type !== ActionTypes.pageCountCount){return state;}
		const myAction: ActionCount = action as ActionCount;
		const newState: State = Object.assign({}, state);
		newState.count = newState.count + myAction.count;
		return newState;
	};

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// 状態初期化と処理集積
	export const reducer: Redux.Reducer<State> = (state: State, action: ActionBase): State => {
		if(state === undefined){state = initialState;}
		state = reducerCount(state, action);
		return state;
	};

	// ----------------------------------------------------------------
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


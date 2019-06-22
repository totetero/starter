
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as Redux from "redux";

import {ActionBase, ActionTypes,} from "./ActionTypes";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export namespace ReduxTemplate{
	// ----------------------------------------------------------------

	// Redux状態構造体
	export interface State{
		value: number;
	}

	// Redux状態初期値
	const initialState: State = {
		value: 0,
	};

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// テスト命令構造体
	interface ActionTest extends ActionBase{
		value: number;
	}

	// ----------------------------------------------------------------

	// テスト命令作成
	export function createActionTest(value: number): ActionTest{
		return {
			type: ActionTypes.templateTest,
			value: value,
		};
	}

	// ----------------------------------------------------------------

	// テスト命令処理
	const reducerTest: Redux.Reducer<State> = (state: State, action: ActionBase): State => {
		if(action.type !== ActionTypes.templateTest){return state;}
		const myAction: ActionTest = action as ActionTest;
		const newState: State = Object.assign({}, state);
		newState.value = newState.value + myAction.value;
		return newState;
	};

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// 状態初期化と処理集積
	export const reducer: Redux.Reducer<State> = (state: State, action: ActionBase): State => {
		if(state === undefined){state = initialState;}
		state = reducerTest(state, action);
		return state;
	};

	// ----------------------------------------------------------------
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


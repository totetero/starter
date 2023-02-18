
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as Redux from "redux";
import createActionType from "../../createActionType";
import { ReduxStoreState, } from "../../store_";

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
type TypeArgument1 = Redux.Action<number>;
type TypeArgument2 = Redux.Dispatch<TypeArgument1>;
type TypeArgument3 = Redux.MiddlewareAPI<Redux.Dispatch, ReduxStoreState>;
export async function middleware(api: TypeArgument3, next: TypeArgument2, action: TypeArgument1): Promise<boolean> {
	if (action.type !== actionType) { return false; }
	const myAction: Action = action as Action;
	console.log(myAction);
	return true;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------



// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactRedux from "react-redux";
import * as ReactRouterDom from "react-router-dom";
import * as Redux from "redux";

import { ReduxStoreState, } from "../../../redux/store_";
import * as reducerCount from "../../../redux/modules/pageCount/reducerCount";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

interface ComponentProps {
	localCountInit: number;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element | null => {
	const dispatch: Redux.Dispatch = ReactRedux.useDispatch();

	// メインループ設定
	setMainloop((): void => {
		console.log("mainloop");
	});

	// ステート設定 ストアカウント
	const storeCountCurr: number = ReactRedux.useSelector((state: ReduxStoreState): number => state.pageCount.count);
	const setStoreCount: (count: number) => void = (count: number): void => {dispatch(reducerCount.createAction(count));};

	// ステート設定 ローカルカウント
	const [localCountCurr, setLocalCount,]: [number, (localCountNext: number) => void,] = React.useState<number>(props.localCountInit);

	return <div>
		<div>
			<button onClick={(): void => setStoreCount(1)}>+</button>
			<button onClick={(): void => setStoreCount(-1)}>-</button>
			<span>ストアカウント: {storeCountCurr}</span>
		</div>
		<div>
			<button onClick={(): void => setLocalCount(localCountCurr + 1)}>+</button>
			<button onClick={(): void => setLocalCount(localCountCurr - 1)}>-</button>
			<span>ローカルカウント: {localCountCurr}</span>
		</div>
		<div><ReactRouterDom.Link to='/'>top</ReactRouterDom.Link></div>
	</div>;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// メインループ設定
const setMainloop = (mainloop: () => void): void => {
	React.useEffect((): () => void => {
		let requestID: number = -1;
		const callback: FrameRequestCallback = (time: number): void => {
			mainloop();
			requestID = window.requestAnimationFrame(callback);
		};
		callback(0);
		return () => {
			window.cancelAnimationFrame(requestID);
		};
	}, []);
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


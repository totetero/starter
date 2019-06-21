
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactRedux from "react-redux";
import * as Redux from "redux";
import {Link,} from "react-router-dom";

import {ReduxStoreState} from "../redux/Store";
import {ReduxPageCount,} from "../redux/ReduxPageCount";

const Component: React.FunctionComponent<{
	localCountInit: number;
}> = ({
	localCountInit = 10,
}): JSX.Element => {
	const dispatch: Redux.Dispatch = ReactRedux.useDispatch();

	// メインループ設定
	setMainloop((): void => {
		console.log("mainloop");
	});

	// ステート設定 ストアカウント
	const storeCountCurr: number = ReactRedux.useSelector((state: ReduxStoreState): number => state.statePageCount.count);

	// ステート設定 ローカルカウント
	const [localCountCurr, setLocalCount,]: [number, (localCountNext: number) => void,] = React.useState<number>(localCountInit);

	return (
		<div>
			<div>
				<button onClick={(): void => ReduxPageCount.dispatchCount(dispatch, 1)}>+</button>
				<button onClick={(): void => ReduxPageCount.dispatchCount(dispatch, -1)}>-</button>
				<span>ストアカウント: {storeCountCurr}</span>
			</div>
			<div>
				<button onClick={(): void => setLocalCount(localCountCurr + 1)}>+</button>
				<button onClick={(): void => setLocalCount(localCountCurr - 1)}>-</button>
				<span>ローカルカウント: {localCountCurr}</span>
			</div>
			<div><Link to='/'>top</Link></div>
		</div>
	);
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


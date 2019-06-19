
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import {Link,} from "react-router-dom";

const Component: React.FunctionComponent<{
	localCountInit: number;
}> = ({
	localCountInit = 10,
}): JSX.Element => {
	// メインループ設定
	setMainloop((): void => {
		console.log("mainloop");
	});

	// ステート設定 ローカルカウント
	const [localCountCurr, setLocalCount,]: [number, (localCountNext: number) => void,] = React.useState<number>(localCountInit);

	return (
		<div>
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


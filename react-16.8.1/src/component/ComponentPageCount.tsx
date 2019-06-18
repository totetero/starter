
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";

const Component: React.FunctionComponent<{
	countInit: number;
}> = ({
	countInit = 10,
}): JSX.Element => {
	const [countCurr, setCount,]: [number, (countNext: number) => void,] = React.useState<number>(countInit);
	return (
		<div>
			<div>Clicks: {countCurr}</div>
			<button onClick={(): void => setCount(countCurr + 1)}>+</button>
			<button onClick={(): void => setCount(countCurr - 1)}>-</button>
		</div>
	);
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


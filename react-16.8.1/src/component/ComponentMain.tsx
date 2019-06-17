
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";

const Component: React.FunctionComponent<{
	count: number;
}> = ({
	count = 10,
}): JSX.Element => {
	const [clicks, setClicks] = React.useState<number>(count);
	return (
		<div>
			<div>Clicks: {clicks}</div>
			<button onClick={(): void => setClicks(clicks + 1)}>+</button>
			<button onClick={(): void => setClicks(clicks - 1)}>-</button>
		</div>
	);
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


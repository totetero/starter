
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import {Link,} from "react-router-dom";

const Component: React.FunctionComponent<{}> = (): JSX.Element => {
	return (
		<div>
			<div>top</div>
			<Link to='/count'>count</Link>
		</div>
	);
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


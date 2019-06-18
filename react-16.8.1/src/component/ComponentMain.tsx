
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import {
	HashRouter,
	Switch,
	Route,
} from "react-router-dom";
import ComponentPageTop from "./ComponentPageTop";
import ComponentPageCount from "./ComponentPageCount";

const Component: React.FunctionComponent<{}> = (): JSX.Element => {
	return (
		<HashRouter>
			<Switch>
				<Route path="/count" component={ComponentPageCount} />
				<Route component={ComponentPageTop} />
			</Switch>
		</HashRouter>
	);
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


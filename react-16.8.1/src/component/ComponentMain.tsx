
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactRedux from "react-redux";
import {
	HashRouter,
	Switch,
	Route,
} from "react-router-dom";
import {store} from "../redux/Store";
import ComponentPageTop from "./ComponentPageTop";
import ComponentPageCount from "./ComponentPageCount";

const Component: React.FunctionComponent<{}> = (): JSX.Element => {
	return (
		<ReactRedux.Provider store = {store}>
			<HashRouter>
				<Switch>
					<Route path="/count" component={ComponentPageCount} />
					<Route component={ComponentPageTop} />
				</Switch>
			</HashRouter>
		</ReactRedux.Provider>
	);
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


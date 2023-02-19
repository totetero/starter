
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactRedux from "react-redux";
import * as ReactRouterDom from "react-router-dom";
import { store, } from "../redux/store";
import Pages from "./pages";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// interface ComponentProps {}
type ComponentProps = unknown

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element => {
	return <React.StrictMode>
		<ReactRedux.Provider store = {store}>
			<ReactRouterDom.HashRouter>
				<Pages />
			</ReactRouterDom.HashRouter>
		</ReactRedux.Provider>
	</React.StrictMode>;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


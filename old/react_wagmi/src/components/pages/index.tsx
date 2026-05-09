
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactRouterDom from "react-router-dom";
import PageCount from "./pageCount";
import Top from "./top";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// interface ComponentProps {}
type ComponentProps = unknown

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element | null => {
	return <ReactRouterDom.Routes>
		<ReactRouterDom.Route path="/count" element={<PageCount localCountInit={10} />} />
		<ReactRouterDom.Route path="*" element={<Top />} />
	</ReactRouterDom.Routes>;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


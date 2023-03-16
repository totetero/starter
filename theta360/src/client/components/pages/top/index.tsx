
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactRouterDom from "react-router-dom";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// interface ComponentProps {}
type ComponentProps = unknown;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element | null => {
	return <div>
		<div>top</div>
		<ReactRouterDom.Link to='/theta'>theta</ReactRouterDom.Link>
	</div>;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

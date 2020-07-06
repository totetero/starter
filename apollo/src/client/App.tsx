
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import { ApolloProvider, } from "@apollo/react-hooks";
import { apolloClient, } from "./apolloClient";
import ComponentHello from "./ComponentHello";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<{}> = ({}): JSX.Element => {
	return (
		<ApolloProvider client={apolloClient}>
			<ComponentHello/>
		</ApolloProvider>
	);
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


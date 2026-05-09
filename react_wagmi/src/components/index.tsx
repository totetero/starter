
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactRedux from "react-redux";
import * as ReactRouterDom from "react-router-dom";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
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

const client = createClient({
	autoConnect: true,
	provider: getDefaultProvider(),
  })

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element => {
	return <React.StrictMode>
		<WagmiConfig client={client}>
			<ReactRedux.Provider store = {store}>
				<ReactRouterDom.HashRouter>
					<Pages />
				</ReactRouterDom.HashRouter>
			</ReactRedux.Provider>
		</WagmiConfig>
	</React.StrictMode>;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


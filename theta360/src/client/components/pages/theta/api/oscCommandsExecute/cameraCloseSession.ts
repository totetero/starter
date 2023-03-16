
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import ApiOscCommandsExecuteRequest from "./request";
import ApiOscCommandsExecuteResponse from "./response";

export default async function (sessionId: string | null): Promise<boolean> {
	if (sessionId === null) { return false; }

	const request: ApiOscCommandsExecuteRequest = {
		name: "camera.closeSession",
		parameters: { sessionId, },
	};

	const responseRow: Response = await fetch("/osc/commands/execute", {
		method: "POST",
		headers: { "Content-Type": "application/json", },
		body: JSON.stringify(request),
	});

	const responseJson: ApiOscCommandsExecuteResponse = await responseRow.json();
	if (responseJson.state !== "done") { return false; }

	return true;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------



// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import ApiOscCommandsExecuteRequest from "./request";
import ApiOscCommandsExecuteResponse from "./response";

export default async function (): Promise<string | null> {
	const request: ApiOscCommandsExecuteRequest = {
		name: "camera.startSession",
	};

	const responseRow: Response = await fetch("/osc/commands/execute", {
		method: "POST",
		headers: { "Content-Type": "application/json", },
		body: JSON.stringify(request),
	});

	const responseJson: ApiOscCommandsExecuteResponse = await responseRow.json();
	if (responseJson.name !== "camera.startSession") { return null; }
	if (responseJson.state !== "done") { return null; }

	return responseJson.results.sessionId;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


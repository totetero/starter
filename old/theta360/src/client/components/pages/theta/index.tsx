
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import Canvas from "./canvas";
import Image from "./image";
import apiOscCommandsExecuteCameraStartSession from "./api/oscCommandsExecute/cameraStartSession";
import apiOscCommandsExecuteCameraCloseSession from "./api/oscCommandsExecute/cameraCloseSession";

//import testImage from "./testImage";
const testImage: string | null = null;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// interface ComponentProps {}
type ComponentProps = unknown;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element => {
	type StateResponse<T> = [T, React.Dispatch<React.SetStateAction<T>>,];
	const [sessionId, setSessionId,]: StateResponse<string | null> = React.useState<string | null>(null);

	const handlerThetaOpen: () => Promise<void> = React.useCallback(async (): Promise<void> => {
		const sessionId: string | null = await apiOscCommandsExecuteCameraStartSession();
		if (sessionId !== null) { setSessionId(sessionId); }
	}, []);

	const handlerThetaClose: () => Promise<void> = React.useCallback(async (): Promise<void> => {
		const isSuccess: boolean = await apiOscCommandsExecuteCameraCloseSession(sessionId);
		if (isSuccess) { setSessionId(null); }
	}, [sessionId,]);

	return <div>
		<div>Hello theta</div>
		<div><button onClick={handlerThetaOpen}>open</button></div>
		<div><button onClick={handlerThetaClose}>close</button></div>
		<div><Canvas width={360} height={360} /></div>
		<div>{sessionId !== null ? (
			<Image src={`/live_preview/${sessionId}`} width={360} height={180} />
		) : testImage !== null ? (
			<Image src={testImage} width={360} height={180} />
		) : <React.Fragment />}</div>
	</div>;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------



// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	const inputTest: HTMLInputElement = window.document.getElementById("inputTest") as HTMLInputElement;
	const buttonTest: HTMLButtonElement = window.document.getElementById("buttonTest") as HTMLButtonElement;
	const textareaTest: HTMLTextAreaElement = window.document.getElementById("textareaTest") as HTMLTextAreaElement;

	const ws: WebSocket = new WebSocket(`ws://${window.location.host}/ws`);
	ws.addEventListener("open", (event: Event): void => { textareaTest.value = "Connected"; });
	ws.addEventListener("message", (event: MessageEvent): void => {
		const data: { Message: string; } = JSON.parse(event.data);
		textareaTest.value = `${data.Message}\n${textareaTest.value}`;
	});

	buttonTest.addEventListener("click", (event: Event): void => {
		const message: string = inputTest.value;
		if (message === "") { return; }
		inputTest.value = "";
		ws.send(JSON.stringify({ message, }));
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


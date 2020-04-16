
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", async (event: Event): Promise<void> => {
	const button: HTMLButtonElement = document.createElement("button");
	button.innerHTML = "test";
	button.addEventListener("click", (event: Event): void => {
		console.log("aaaaaaa");
	});
	document.getElementById("root")?.appendChild(button);
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


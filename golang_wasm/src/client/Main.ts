
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

declare class Go {
	importObject: any;
	run: any;
}

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", async (event: Event): Promise<void> => {
	const go: Go = new Go();

	const wasm: Response = await fetch("index.wasm");
	const buff: ArrayBuffer = await wasm.arrayBuffer();
	const result: any = await WebAssembly.instantiate(buff, go.importObject);
	const module: any = result.module;
	let instance: any = result.instance;

	document.getElementById("button")?.addEventListener("click", async (event: Event): Promise<void> => {
		await go.run(instance);
		instance = await WebAssembly.instantiate(module, go.importObject);
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


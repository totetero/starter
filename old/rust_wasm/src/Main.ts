
const wasmModule = import(/* webpackChunkName: "wasmModule" */ "../crate/pkg");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

type Module = {
	rs_alert: (message: string) => void;
};

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", async (event: Event): Promise<void> => {
	const module: Module = await wasmModule;
	await new Promise((resolve: () => void, reject: (error: Error) => void): void => { setTimeout(resolve, 1000); });
	module.rs_alert("world");
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


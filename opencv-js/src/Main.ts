
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import cv, { OpenCVModule, Mat, } from "./OpenCV"; 

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	const button1: HTMLButtonElement = document.createElement("button");
	document.getElementById("root")?.appendChild(button1);
	button1.innerHTML = "test";
	button1.addEventListener("click", (event: Event): void => {
		const canvas1: HTMLCanvasElement = document.createElement("canvas");
		canvas1.width = 100;
		canvas1.height = 100;
		const context: CanvasRenderingContext2D | null = canvas1.getContext("2d");
		if (context === null) { return; }
		context.fillStyle = "red";
		context.fillRect(0, 0, canvas1.width, canvas1.height);
		document.getElementById("root")?.appendChild(canvas1);

		cv.then((cv: OpenCVModule): void => {
			const button2: HTMLButtonElement = document.createElement("button");
			document.getElementById("root")?.appendChild(button2);
			button2.innerHTML = "test";
			button2.addEventListener("click", (event: Event): void => {
				const canvas2: HTMLCanvasElement = document.createElement("canvas");
				canvas2.width = canvas1.width;
				canvas2.height = canvas1.height;
				const src: Mat = cv.imread(canvas1);
				const dst: Mat = new cv.Mat();
				cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
				cv.imshow(canvas2, dst);
				src.delete();
				dst.delete();
				document.getElementById("root")?.appendChild(canvas2);
			});
		});
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


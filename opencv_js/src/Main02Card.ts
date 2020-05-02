
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import cv, { Mat, MatVector, Size, } from "./OpenCV"; 

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	// ローディング開始
	const div: HTMLDivElement = document.createElement("div");
	div.innerHTML = "loading";
	document.getElementById("root")?.appendChild(div);

	// カメラデバイス取得
	window.navigator.mediaDevices.getUserMedia({
		video: { facingMode: "environment" },
		audio: false,
	}).then(async (stream: MediaStream): Promise<void> => {
		// ビデオ設定
		const setting: MediaTrackSettings = stream.getVideoTracks()[0].getSettings();
		const settingWidth: number = setting.width || 100 ;
		const settingHeight: number = setting.height || 100;
		const video: HTMLVideoElement = document.createElement("video");
		document.getElementById("root")?.appendChild(video);
		video.width = Math.floor(100 * (settingWidth < settingHeight ? 1 : settingWidth / settingHeight));
		video.height = Math.floor(100 * (settingHeight < settingWidth ? 1 : settingHeight / settingWidth));
		video.srcObject = stream;
		video.play();

		// 画像処理キャンバス作成
		const canvasDraw: HTMLCanvasElement = document.createElement("canvas");
		canvasDraw.width = 256;
		canvasDraw.height = 256;
		const context: CanvasRenderingContext2D | null = canvasDraw.getContext("2d");
		if (context === null) { return; }
		// 表示キャンバス作成
		const canvasView1: HTMLCanvasElement = document.createElement("canvas");
		const canvasView2: HTMLCanvasElement = document.createElement("canvas");
		const canvasView3: HTMLCanvasElement = document.createElement("canvas");
		document.getElementById("root")?.appendChild(canvasView1);
		document.getElementById("root")?.appendChild(canvasView2);
		document.getElementById("root")?.appendChild(canvasView3);

		// ロード中
		await new Promise((resolve: () => void, reject: (error: Error) => void): void => { cv.then((): void => { resolve(); }); });
		// ロード完了
		div.innerHTML = "start";

		// メインループ作成
		const mainloop: FrameRequestCallback = (time: number): void => {
			// カメラから画像を抽出
			const aspectRatioVideo: number = video.videoWidth / video.videoHeight;
			const aspectRatioCanvas: number = canvasDraw.width / canvasDraw.height;
			const srcw: number = Math.floor(aspectRatioVideo < aspectRatioCanvas ? video.videoWidth : video.videoHeight * canvasDraw.width / canvasDraw.height);
			const srch: number = Math.floor(aspectRatioVideo > aspectRatioCanvas ? video.videoHeight : video.videoWidth * canvasDraw.height / canvasDraw.width);
			const srcx: number = Math.floor((video.videoWidth - srcw) / 2);
			const srcy: number = Math.floor((video.videoHeight - srch) / 2);
			context.drawImage(video, srcx, srcy, srcw, srch, 0, 0, canvasDraw.width, canvasDraw.height);

			const src: Mat = cv.imread(canvasDraw);
			const matGray: Mat = new cv.Mat();
			const hierarchy: Mat = new cv.Mat();
			const contours: MatVector = new cv.MatVector();

			// 白黒変換
			const thresh: number = Math.floor(Math.random() * 128) + 64;
			cv.cvtColor(src, matGray, cv.COLOR_RGBA2GRAY, 0);
			cv.threshold(matGray, matGray, thresh, 255, cv.THRESH_BINARY);

			// 輪郭検出
			let matKeep: Mat | null = null;
			cv.findContours(matGray, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
			for (let i: number = 0; i < contours.size(); i++) {
				const contour: Mat = contours.get(i);
				const area: number = cv.contourArea(contour, false);
				if (area < 1000) { continue; }
				const matPoly: Mat = new cv.Mat();
				const epsilon: number = 0.1 * cv.arcLength(contour, true);
				cv.approxPolyDP(contour, matPoly, epsilon, true);
				if (matPoly.rows === 4) { cv.drawContours(src, contours, i, [255, 0, 0, 255], 4); }
				if (matPoly.rows === 4 && matKeep === null) { matKeep = matPoly; } else { matPoly.delete(); }
			}

			if (matKeep !== null) {
				const matAffine: Mat = cv.imread(canvasDraw);
				const w: number = canvasView3.width;
				const h: number = canvasView3.height;
				const srcPos: Mat = cv.matFromArray(matKeep.rows, matKeep.cols, cv.CV_32FC2, matKeep.data32S);
				const dstPos: Mat = cv.matFromArray(matKeep.rows, matKeep.cols, cv.CV_32FC2, [0, 0, 0, h, w, h, w, 0]);
				const matrix: Mat = cv.getPerspectiveTransform(srcPos, dstPos);
				const size: Size = new cv.Size(matAffine.rows, matAffine.cols);
				cv.warpPerspective(matAffine, matAffine, matrix, size);
				cv.imshow(canvasView3, matAffine);
				matKeep.delete();
				matAffine.delete();
			}

			// 描画
			cv.imshow(canvasView1, matGray);
			cv.imshow(canvasView2, src);

			src.delete();
			matGray.delete();
			hierarchy.delete();
			contours.delete();

			window.requestAnimationFrame(mainloop);
		};

		// メインループ開始
		window.requestAnimationFrame(mainloop);
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


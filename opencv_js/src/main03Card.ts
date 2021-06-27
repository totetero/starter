
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import cv, { Mat, } from "@/types/opencv";

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
		document.getElementById("root")?.appendChild(canvasView1);

		// ロード中
		await new Promise((resolve: Function): void => { cv.then((): void => { resolve(); }); });
		// ロード完了
		div.innerHTML = "start";

		// メインループ
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

			// 白黒変換
			cv.cvtColor(src, matGray, cv.COLOR_RGBA2GRAY, 0);
			cv.Canny(matGray, matGray, 50, 100);

			// 境界線の描画
			const ww: number = 256;
			const wh: number = 256;
			for (let i: number = 0; i < ww; i++) {
				for (let j: number = 0; j < wh; j++) {
					if (matGray.data[i + j * wh] > 128) {
						cv.circle(src, new cv.Point(i, j), 1, [255, 255, 255, 255], -1);
					}
				}
			}

			// カード検出
			let outerCount: number = 0;
			let outerTotal: number = 0;
			const cw: number = 856 / 5;
			const ch: number = 540 / 5;
			const x0: number = Math.floor((ww - cw) / 2);
			const y0: number = Math.floor((wh - ch) / 2);
			const x1: number = Math.floor((ww + cw) / 2);
			const y1: number = Math.floor((wh + ch) / 2);
			[[x0, y0, x1, y0], [x1, y0, x1, y1], [x1, y1, x0, y1], [x0, y1, x0, y0]].forEach(points => {
				const x0: number = points[0];
				const y0: number = points[1];
				const x1: number = points[2];
				const y1: number = points[3];
				const r: number = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
				const num: number = Math.floor(r / 15);
				for (let k: number = 0; k < num; k++) {
					const r: number = 5;
					const t: number = k / num;
					const x: number = Math.floor(x0 * t + x1 * (1 - t));
					const y: number = Math.floor(y0 * t + y1 * (1 - t));
					let innerCount: number = 0;
					let innerTotal: number = 0;
					for (let i: number = x - r; i <= x + r; i++) {
						for (let j: number = y - r; j <= y + r; j++) {
							if (matGray.data[i + j * wh] > 128) { innerCount++; }
							innerTotal++;
						}
					}
					const isSuccess: boolean = (innerCount / innerTotal > 0);
					if (isSuccess) { outerCount++; }
					outerTotal++;
					cv.rectangle(src, new cv.Point(x - r, y - r), new cv.Point(x + r, y + r), isSuccess ? [255, 0, 0, 255] : [0, 0, 0, 255]);
				}
			});
			const isSuccess: boolean = (outerCount / outerTotal > 0.95);
			cv.line(src, new cv.Point(x0, y0), new cv.Point(x1, y0), isSuccess ? [255, 0, 0, 255] : [0, 0, 0, 255], 3);
			cv.line(src, new cv.Point(x1, y0), new cv.Point(x1, y1), isSuccess ? [255, 0, 0, 255] : [0, 0, 0, 255], 3);
			cv.line(src, new cv.Point(x1, y1), new cv.Point(x0, y1), isSuccess ? [255, 0, 0, 255] : [0, 0, 0, 255], 3);
			cv.line(src, new cv.Point(x0, y1), new cv.Point(x0, y0), isSuccess ? [255, 0, 0, 255] : [0, 0, 0, 255], 3);

			// 描画
			cv.imshow(canvasView1, src);

			src.delete();
			matGray.delete();

			window.requestAnimationFrame(mainloop);
		};

		// メインループ開始
		window.requestAnimationFrame(mainloop);
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


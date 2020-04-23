
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import cv, { Mat, Size, Rect, RectVector, CascadeClassifier, } from "./OpenCV"; 

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	// ローディング開始
	const div: HTMLDivElement = document.createElement("div");
	div.innerHTML = "loading";
	document.getElementById("root")?.appendChild(div);

	// xmlファイルの読み込み
	const fileHaarcascadeFrontalfaceDefault: string = "fileHaarcascadeFrontalfaceDefault";
	const fileHaarcascadeEye: string = "fileHaarcascadeEye";
	const loadXml = (file: string, path: string): Promise<void> => new Promise((resolve: () => void, reject: (error: Error) => void): void => {
		const xhr: XMLHttpRequest = new XMLHttpRequest();
		xhr.open("GET", path, true);
		xhr.responseType = "arraybuffer";
		xhr.addEventListener("readystatechange", () => {
			if(xhr.readyState !== 4){return;}
			if(xhr.status === 200){
				cv.then((): void => {
					const data: Uint8Array = new Uint8Array(xhr.response);
					cv.FS_createDataFile("/", file, data, true, false, false);
					xhr.abort();
					resolve();
				});
			} else {
				reject(new Error());
			}
		});
		xhr.send();
	});
	const loadHaarcascadeFrontalfaceDefault: Promise<void> = loadXml(fileHaarcascadeFrontalfaceDefault, "./haarcascade_frontalface_default.xml");
	const loadHaarcascadeEye: Promise<void> = loadXml(fileHaarcascadeEye, "./haarcascade_eye.xml");

	// 画像処理キャンバス作成
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	document.getElementById("root")?.appendChild(canvas);
	const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
	if (context === null) { return; }
	context.strokeStyle = "red";

	// カメラデバイス取得
	window.navigator.mediaDevices.getUserMedia({
		video: true,
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

		// ロード中
		await new Promise((resolve: () => void, reject: (error: Error) => void): void => { cv.then((): void => { resolve(); }); });
		await Promise.all([loadHaarcascadeFrontalfaceDefault, loadHaarcascadeEye]);
		// ロード完了
		div.innerHTML = "start";

		// 顔検出の準備
		const faceSizeMin: Size = new cv.Size(0, 0);
		const faceSizeMax: Size = new cv.Size(0, 0);
		const faceRects: RectVector = new cv.RectVector();
		const faceClassifier: CascadeClassifier = new cv.CascadeClassifier();
		faceClassifier.load(fileHaarcascadeFrontalfaceDefault);
		// 目検出の準備
		const eyeSizeMin: Size = new cv.Size(0, 0);
		const eyeSizeMax: Size = new cv.Size(0, 0);
		const eyeRects: RectVector = new cv.RectVector();
		const eyeClassifier: CascadeClassifier = new cv.CascadeClassifier();
		eyeClassifier.load(fileHaarcascadeEye);
		// メインループ
		const matGray: Mat = new cv.Mat();
		const mainloop: FrameRequestCallback = (time: number): void => {
			// カメラから画像を抽出
			const aspectRatioVideo: number = video.videoWidth / video.videoHeight;
			const aspectRatioCanvas: number = canvas.width / canvas.height;
			const srcw: number = Math.floor(aspectRatioVideo < aspectRatioCanvas ? video.videoWidth : video.videoHeight * canvas.width / canvas.height);
			const srch: number = Math.floor(aspectRatioVideo > aspectRatioCanvas ? video.videoHeight : video.videoWidth * canvas.height / canvas.width);
			const srcx: number = Math.floor((video.videoWidth - srcw) / 2);
			const srcy: number = Math.floor((video.videoHeight - srch) / 2);
			context.drawImage(video, srcx, srcy, srcw, srch, 0, 0, canvas.width, canvas.height);

			// 顔検出
			const src: Mat = cv.imread(canvas);
			cv.cvtColor(src, matGray, cv.COLOR_RGBA2GRAY, 0);
			faceClassifier.detectMultiScale(matGray, faceRects, 1.1, 3, 0, faceSizeMin, faceSizeMax);
			for (let i: number = 0; i < faceRects.size(); i++) {
				const faceRect: Rect = faceRects.get(i);
				context.strokeRect(faceRect.x, faceRect.y, faceRect.width, faceRect.height);
				// 目検出
				const matFace: Mat = matGray.roi(faceRect);
				eyeClassifier.detectMultiScale(matFace, eyeRects, 1.1, 3, 0, eyeSizeMin, eyeSizeMax);
				for (let j: number = 0; j < eyeRects.size(); j++) {
					const eyeRect: Rect = eyeRects.get(j);
					context.strokeRect(faceRect.x + eyeRect.x, faceRect.y + eyeRect.y, eyeRect.width, eyeRect.height);
				}
				matFace.delete();
			}
			src.delete();

			window.requestAnimationFrame(mainloop);
		};
		window.requestAnimationFrame(mainloop);
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


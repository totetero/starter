
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export interface Mat {
	delete: () => void;
}

export interface OpenCVModule {
	then: (callback: (cv: OpenCVModule) => void) => void;
	imread: (canvas: HTMLCanvasElement) => Mat;
	imshow: (canvas: HTMLCanvasElement, mat: Mat) => void;
	cvtColor: (src: Mat, dst: Mat, code: number, dstChannel: number) => void;
	COLOR_RGBA2GRAY: number;
	Mat: any;
}

declare const cv: OpenCVModule;

export default cv;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


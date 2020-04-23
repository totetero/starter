
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export interface Mat {
	roi: (rect: Rect) => Mat;
	delete: () => void;
}

export interface Size {}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface RectVector {
	get: (index: number) => Rect;
	size: () => number;
}

export interface CascadeClassifier {
	load: (filename: string) => void;
	detectMultiScale: (image: Mat, objects: RectVector, scaleFactor: number, minNeighbors: number, flags: number, minSize: Size, maxSize: Size) => void;
}

export interface OpenCVModule {
	COLOR_RGBA2GRAY: number;

	Mat: any;
	Size: any;
	RectVector: any;
	CascadeClassifier: any;

	then: (callback: () => void) => void;
	FS_createDataFile: (parent: string, name: string, data: Uint8Array, canRead: boolean, canWrite: boolean, canOwn: boolean) => void;
	imread: (canvas: HTMLCanvasElement) => Mat;
	imshow: (canvas: HTMLCanvasElement, mat: Mat) => void;
	cvtColor: (src: Mat, dst: Mat, code: number, dstChannel: number) => void;
}

declare const cv: OpenCVModule;

export default cv;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


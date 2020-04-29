
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export interface Mat {
	rows: number;
	roi: (rect: Rect) => Mat;
	delete: () => void;
}

export interface MatVector {
	size: () => number;
	get: (index: number) => Mat;
	delete: () => void;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface RectVector {
	size: () => number;
	get: (index: number) => Rect;
}

export interface Point {
	x: number;
	y: number;
}

export interface PointVector {
	size: () => number;
	get: (index: number) => Point;
}

export interface Size {}

export interface CascadeClassifier {
	load: (filename: string) => void;
	detectMultiScale: (image: Mat, objects: RectVector, scaleFactor: number, minNeighbors: number, flags: number, minSize: Size, maxSize: Size) => void;
}

export interface OpenCVModule {
	COLOR_RGBA2GRAY: number;
	THRESH_BINARY: number;
	RETR_EXTERNAL: number;
	CHAIN_APPROX_SIMPLE: number;

	Mat: any;
	MatVector: any;
	RectVector: any;
	Size: any;
	CascadeClassifier: any;

	then: (callback: () => void) => void;
	FS_createDataFile: (parent: string, name: string, data: Uint8Array, canRead: boolean, canWrite: boolean, canOwn: boolean) => void;
	imread: (canvas: HTMLCanvasElement) => Mat;
	imshow: (canvas: HTMLCanvasElement, mat: Mat) => void;
	cvtColor: (src: Mat, dst: Mat, code: number, dstChannel: number) => void;
	threshold: (src: Mat, dst: Mat, thresh: number, maxval: number, type: number) => number;
	findContours: (mat: Mat, contours: MatVector, hierarchy: Mat, mode: number, method: number) => void;
	drawContours: (mat: Mat, contours: MatVector, contourIdx: number, color: number[], thickness: number) => void;
	arcLength: (contour: Mat, oriented: boolean) => number;
	contourArea: (contour: Mat, oriented: boolean) => number;
	approxPolyDP: (curve: Mat, approxCurve: Mat, epsilon: number, closed: boolean) => void;
}

declare const cv: OpenCVModule;

export default cv;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------



// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export declare class Mat {
	rows: number;
	cols: number;
	data: number[];
	data32S: number[];
	roi(rect: Rect): Mat;
	delete(): void;
}

export declare class MatVector {
	size(): number;
	get(index: number): Mat;
	delete(): void;
}

export declare class Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export declare class RectVector {
	size(): number;
	get(index: number): Rect;
}

export declare class Size {}

export declare class CascadeClassifier {
	load(filename: string): void;
	detectMultiScale(image: Mat, objects: RectVector, scaleFactor: number, minNeighbors: number, flags: number, minSize: Size, maxSize: Size): void;
}

declare const cv: {
	CHAIN_APPROX_SIMPLE: number;
	COLOR_RGBA2GRAY: number;
	CV_32FC2: number;
	RETR_EXTERNAL: number;
	THRESH_BINARY: number;

	CascadeClassifier: any;
	Mat: any;
	MatVector: any;
	Point: any;
	RectVector: any;
	Size: any;

	then: (callback: () => void) => void;
	Canny: any;
	FS_createDataFile: (parent: string, name: string, data: Uint8Array, canRead: boolean, canWrite: boolean, canOwn: boolean) => void;
	approxPolyDP: (curve: Mat, approxCurve: Mat, epsilon: number, closed: boolean) => void;
	arcLength: (contour: Mat, oriented: boolean) => number;
	circle: any;
	contourArea: (contour: Mat, oriented: boolean) => number;
	cvtColor: (src: Mat, dst: Mat, code: number, dstChannel: number) => void;
	drawContours: (mat: Mat, contours: MatVector, contourIdx: number, color: number[], thickness: number) => void;
	findContours: (mat: Mat, contours: MatVector, hierarchy: Mat, mode: number, method: number) => void;
	getPerspectiveTransform: (src: Mat, dst: Mat) => Mat;
	imread: (canvas: HTMLCanvasElement) => Mat;
	imshow: (canvas: HTMLCanvasElement, mat: Mat) => void;
	line: any;
	matFromArray: (rows: number, cols: number, type: number, array: number[]) => Mat;
	rectangle: any;
	threshold: (src: Mat, dst: Mat, thresh: number, maxval: number, type: number) => number;
	warpPerspective: (src: Mat, dst: Mat, mat: Mat, dsize: Size) => void;
};

export default cv;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


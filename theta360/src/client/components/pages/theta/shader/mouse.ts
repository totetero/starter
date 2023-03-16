
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { mat4, quat, } from "gl-matrix";

let mx: number = 0;
let my: number = 0;
let mdn = false;
let mmv = false;
let mxFirst: number = 0;
let myFirst: number = 0;
let rotMx: number = 0;
let rotMy: number = 0;
let rotAxisX: number = 0;
let rotAxisY: number = 0;

let rotQuat: quat = quat.create();
let rotMat: mat4 = mat4.create();
quat.set(rotQuat, 0, 1, 0, Math.PI * 0.0);
mat4.fromQuat(rotMat, rotQuat);

// マウス位置計算
const getMousePosition = (event: MouseEvent | TouchEvent): boolean => {
	if (!(event.target instanceof HTMLElement)) { return false; }
	const windowRect: DOMRect = event.target.getBoundingClientRect();

	if (event instanceof MouseEvent) {
		mx = event.clientX - windowRect.left;
		my = event.clientY - windowRect.top;
	} else if (event instanceof TouchEvent) {
		mx = event.changedTouches[0].clientX - windowRect.left;
		my = event.changedTouches[0].clientY - windowRect.top;
	} else {
		return false;
	}

	return (0 <= mx && mx < windowRect.width && 0 <= my && my < windowRect.height);
};

// マウス押下
const mdnEvent = (event: MouseEvent | TouchEvent): void => {
	getMousePosition(event);
	mdn = true;
	mmv = false;
	mxFirst = mx;
	myFirst = my;
	event.preventDefault();
};

// マウス移動
const mmvEvent = (event: MouseEvent | TouchEvent): void => {
	if (!mdn) { return; }
	getMousePosition(event);
	if (!mmv) { mmv = Math.hypot(mx - mxFirst, my - myFirst) > 5; }
	event.preventDefault();
};

// マウス解放
const mupEvent = (event: MouseEvent | TouchEvent): void => {
	if (!mdn) { return; }
	getMousePosition(event);
	mdn = false;
	event.preventDefault();
};

export const init = (element: HTMLElement): void => {
	if ("ontouchstart" in window) {
		element.addEventListener("touchstart", mdnEvent);
		element.addEventListener("touchmove", mmvEvent);
		element.addEventListener("touchend", mupEvent);
	} else {
		element.addEventListener("mousedown", mdnEvent);
		element.addEventListener("mousemove", mmvEvent);
		element.addEventListener("mouseup", mupEvent);
		element.addEventListener("mouseout", event => {
			const rect = element.getBoundingClientRect();
			const isHorizontalOut = (event.clientX <= rect.left || rect.right <= event.clientX);
			const isVerticalOut = (event.clientY <= rect.top || rect.bottom <= event.clientY);
			if (isHorizontalOut || isVerticalOut) { mupEvent(event); }
		});
	}
};

export const calc = (): void => {
	if (mdn && mmv) {
		rotAxisX += my - rotMy;
		rotAxisY += mx - rotMx;
	}
	const speed = Math.min(Math.hypot(rotAxisX, rotAxisY), 16);
	if (1 < speed) {
		let tmpQuat: quat = quat.create();
		quat.setAxisAngle(tmpQuat, [rotAxisX, rotAxisY, 0,], speed / 10000);
		quat.multiply(rotQuat, tmpQuat, rotQuat)
		quat.normalize(rotQuat, rotQuat);
		mat4.fromQuat(rotMat, rotQuat);
	}
	rotAxisX *= 0.9;
	rotAxisY *= 0.9;
	rotMx = mx;
	rotMy = my;
};

export const getRotMat = (): mat4 => rotMat;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


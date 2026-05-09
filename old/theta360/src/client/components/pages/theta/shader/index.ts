
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { mat4, } from "gl-matrix";
import shader_vert from "./shader.vert";
import shader_frag from "./shader.frag";
import * as Mouse from "./mouse";
import PrimitiveSphere from "./primitiveSphere";

let gl: WebGLRenderingContext | null = null;
let attr_pos: number = -1;
let attr_uvc: number = -1;
let unif_mat: WebGLUniformLocation | null = null;

let primitiveSphere: PrimitiveSphere | null = null;

let imageTexture: WebGLTexture | null = null;
let imageCanvas: HTMLCanvasElement | null = null;
let imageContext: CanvasRenderingContext2D | null = null;

export function start(canvas: HTMLCanvasElement): void {
	gl = canvas.getContext("webgl");
	if (gl === null) { return; }

	// 頂点シェーダーの作成
	const vshader: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
	if (vshader === null) { return; }
	gl.shaderSource(vshader, shader_vert);
	gl.compileShader(vshader);

	// フラグメントシェーダーの作成
	const fshader: WebGLShader | null = gl.createShader(gl.FRAGMENT_SHADER);
	if (fshader === null) { return; }
	gl.shaderSource(fshader, shader_frag);
	gl.compileShader(fshader);

	// プログラムオブジェクトを作成
	const program: WebGLProgram | null = gl.createProgram();
	if (program === null) { return; }
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);
	attr_pos = gl.getAttribLocation(program, "vs_attr_pos");
	attr_uvc = gl.getAttribLocation(program, "vs_attr_uvc");
	unif_mat = gl.getUniformLocation(program, "vs_unif_mat");

	gl.useProgram(program);
	gl.enableVertexAttribArray(attr_pos);
	gl.enableVertexAttribArray(attr_uvc);

	gl.clearColor(0.0, 0.0, 1.0, 1.0);
	gl.clearDepth(1.0);
	//gl.cullFace(gl.FRONT);
	gl.cullFace(gl.BACK);
	//gl.enable(gl.TEXTURE_2D);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	primitiveSphere = new PrimitiveSphere(gl);

	imageCanvas = document.createElement("canvas");
	imageCanvas.width = 1024;
	imageCanvas.height = 512;
	imageContext = imageCanvas.getContext("2d");
	if (imageContext !== null) {
		imageContext.fillStyle = "white";
		imageContext.fillRect(0, 0, canvas.width, canvas.height);
	}

	imageTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, imageTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageCanvas);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);

	Mouse.init(canvas);
}

export function calc(image: HTMLImageElement | null): void {
	if (gl === null) { return; }

	if (image !== null && imageCanvas !== null && imageContext !== null) {
		imageContext.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
		gl.bindTexture(gl.TEXTURE_2D, imageTexture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageCanvas);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	Mouse.calc();
}

export function draw(): void {
	if (gl === null) { return; }
	if (primitiveSphere === null) { return; }

	const tempMat: mat4 = mat4.create();
	mat4.identity(tempMat);
	//mat4.scale(tempMat, tempMat, [2.5, 2.5, 0.1,]);
	//mat4.rotateX(tempMat, tempMat, step / 100);
	//mat4.rotateY(tempMat, tempMat, step / 50);
	mat4.multiply(tempMat, tempMat, Mouse.getRotMat())
	gl.uniformMatrix4fv(unif_mat, false, tempMat);

	gl.bindTexture(gl.TEXTURE_2D, imageTexture);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	primitiveSphere.draw(gl, attr_pos, attr_uvc);
	gl.flush();
}

export function close(): void {
	if (gl === null) { return; }

	if (primitiveSphere !== null) { primitiveSphere.dispose(gl); }
	primitiveSphere = null;

	gl = null;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


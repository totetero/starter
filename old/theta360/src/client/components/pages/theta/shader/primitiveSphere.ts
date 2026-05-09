
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export default class {
	public vertBuffer: WebGLBuffer | null = null;
	public faceBuffer: WebGLBuffer | null = null;
	public pointNum: number = -1;

	constructor(gl: WebGLRenderingContext) {
		const radius: number = 1.0;
		const quality: number = 32;

		const vert: number[] = [];
		for(let i: number = 0; i < (quality + 1); i++){
			const v: number = i / quality;
			const y: number = Math.cos(Math.PI * v);
			const r: number = Math.sin(Math.PI * v);
			for(let j: number = 0; j < (quality * 2 + 1); j++){
				const u: number = j / (quality * 2);
				const x: number = r * Math.cos(2 * Math.PI * u);
				const z: number = r * Math.sin(2 * Math.PI * u);
				vert[(i * (quality * 2 + 1) + j) * 5 + 0] = radius * x;
				vert[(i * (quality * 2 + 1) + j) * 5 + 1] = radius * y;
				vert[(i * (quality * 2 + 1) + j) * 5 + 2] = radius * z;
				vert[(i * (quality * 2 + 1) + j) * 5 + 3] = 1 - u;
				vert[(i * (quality * 2 + 1) + j) * 5 + 4] = v;
			}
		}

		const face: number[] = [];
		for(let i: number = 0; i < quality; i++){
			for(let j: number = 0; j < (quality * 2); j++){
				face[(i * (quality * 2) + j) * 6 + 0] = (i + 0) * (quality * 2 + 1) + (j + 0);
				face[(i * (quality * 2) + j) * 6 + 1] = (i + 0) * (quality * 2 + 1) + (j + 1);
				face[(i * (quality * 2) + j) * 6 + 2] = (i + 1) * (quality * 2 + 1) + (j + 0);
				face[(i * (quality * 2) + j) * 6 + 3] = (i + 1) * (quality * 2 + 1) + (j + 0);
				face[(i * (quality * 2) + j) * 6 + 4] = (i + 0) * (quality * 2 + 1) + (j + 1);
				face[(i * (quality * 2) + j) * 6 + 5] = (i + 1) * (quality * 2 + 1) + (j + 1);
			}
		}

		this.vertBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert), gl.STATIC_DRAW);
		this.faceBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(face), gl.STATIC_DRAW);
		this.pointNum = face.length;
	}

	public draw(gl: WebGLRenderingContext, attr_pos: number, attr_uvc: number): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.vertexAttribPointer(attr_pos, 3, gl.FLOAT, false, 20, 0);
		gl.vertexAttribPointer(attr_uvc, 2, gl.FLOAT, false, 20, 12);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
		gl.drawElements(gl.TRIANGLES, this.pointNum, gl.UNSIGNED_SHORT, 0);
	}

	public dispose(gl: WebGLRenderingContext): void {
		gl.deleteBuffer(this.vertBuffer);
		gl.deleteBuffer(this.faceBuffer);
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


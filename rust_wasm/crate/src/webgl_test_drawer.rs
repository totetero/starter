
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

use std::mem::size_of;
use wasm_bindgen::JsValue;
use js_sys::Float32Array;
use js_sys::Uint16Array;
use web_sys::WebGlRenderingContext;
use web_sys::WebGlBuffer;
use webgl_test_program::WebglTestProgram;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

pub struct WebglTestDrawer {
	vert_buffer: WebGlBuffer,
	face_buffer: WebGlBuffer,
	point_num: i32,
}

impl WebglTestDrawer {
	pub fn create(
		context: &WebGlRenderingContext,
	) -> Result<WebglTestDrawer, JsValue> {
		let vert: [f32; 12] = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0,];
		let face: [u16; 6] = [0, 1, 2, 0, 2, 3,];

		// 頂点バッファ作成
		let vbuffer: WebGlBuffer = context.create_buffer().ok_or(JsValue::from_str("failed972F"))?;
		context.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Option::Some(&vbuffer));
		unsafe {
			let vert: Float32Array = Float32Array::view(&vert);
			context.buffer_data_with_array_buffer_view(WebGlRenderingContext::ARRAY_BUFFER, &vert, WebGlRenderingContext::STATIC_DRAW);
		}

		// インデックスバッファ作成
		let fbuffer: WebGlBuffer = context.create_buffer().ok_or(JsValue::from_str("failed919D"))?;
		context.bind_buffer(WebGlRenderingContext::ELEMENT_ARRAY_BUFFER, Option::Some(&fbuffer));
		unsafe {
			let face: Uint16Array = Uint16Array::view(&face);
			context.buffer_data_with_array_buffer_view(WebGlRenderingContext::ELEMENT_ARRAY_BUFFER, &face, WebGlRenderingContext::STATIC_DRAW);
		}

		return Result::Ok(WebglTestDrawer {
			vert_buffer: vbuffer,
			face_buffer: fbuffer,
			point_num: face.len() as i32,
		});
	}

	// webglの動作確認
	pub fn test(
		self,
		context: &WebGlRenderingContext,
		program: &WebglTestProgram,
	) -> Result<(), JsValue> {
		// プログラム使用宣言
		context.use_program(Option::Some(&program.program));
		context.enable_vertex_attrib_array(program.attr_pos);

		// バッファのクリア
		context.clear(WebGlRenderingContext::COLOR_BUFFER_BIT);

		// 頂点バッファ設定
		context.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Option::Some(&self.vert_buffer));
		context.vertex_attrib_pointer_with_i32(program.attr_pos, 3, WebGlRenderingContext::FLOAT, false, 0, 0);

		// インデックスバッファ設定
		context.bind_buffer(WebGlRenderingContext::ELEMENT_ARRAY_BUFFER, Option::Some(&self.face_buffer));

		// 行列設定
		let m: [f32; 16] = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0,
		];
		context.uniform_matrix4fv_with_f32_array(Option::Some(&program.unif_mat), false, &m);

		// 色設定
		let c: [f32; 4] = [1.0, 1.0, 1.0, 1.0];
		context.uniform4fv_with_f32_array(Option::Some(&program.unif_col), &c);

		// 描画
		let offset: i32 = 0;
		let count: i32 = self.point_num;
		context.draw_elements_with_i32(WebGlRenderingContext::TRIANGLES, count, WebGlRenderingContext::UNSIGNED_SHORT, offset * size_of::<u16>() as i32);

		return Result::Ok(());
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


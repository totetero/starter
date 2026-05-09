
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

use wasm_bindgen::JsValue;
use web_sys::WebGlShader;
use web_sys::WebGlProgram;
use web_sys::WebGlRenderingContext;
use web_sys::WebGlUniformLocation;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

//バーテックスシェーダー
static SOURCE_VERTEX_SHADER: &str = r#"
	precision highp float;
	attribute vec3 vs_attr_pos;
	uniform mat4 vs_unif_mat;
	void main() {
		gl_Position = vs_unif_mat * vec4(vs_attr_pos, 1.0);
	}
"#;

// フラグメントシェーダー
static SOURCE_FRAGMENT_SHADER: &str = r#"
	precision highp float;
	uniform vec4 fs_unif_col;
	void main() {
		gl_FragColor = fs_unif_col;
	}
"#;

pub struct WebglTestProgram {
	program: WebGlProgram,
	attr_pos: u32,
	unif_mat: WebGlUniformLocation,
	unif_col: WebGlUniformLocation,
}

impl WebglTestProgram {
	// 初期化
	pub fn create(
		context: &WebGlRenderingContext,
	) -> Result<WebglTestProgram, JsValue> {
		// バーテックスシェーダー作成
		let vshader: WebGlShader = context.create_shader(WebGlRenderingContext::VERTEX_SHADER).ok_or(JsValue::from_str("failedB733"))?;
		context.shader_source(&vshader, SOURCE_VERTEX_SHADER);
		context.compile_shader(&vshader);
		if !context.get_shader_parameter(&vshader, WebGlRenderingContext::COMPILE_STATUS).as_bool().unwrap_or(false) {
			let log: String = context.get_shader_info_log(&vshader).unwrap_or("failed8E19".to_string());
			return Result::Err(JsValue::from_str(&log));
		}

		// フラグメントシェーダー作成
		let fshader: WebGlShader = context.create_shader(WebGlRenderingContext::FRAGMENT_SHADER).ok_or(JsValue::from_str("failedFCC6"))?;
		context.shader_source(&fshader, SOURCE_FRAGMENT_SHADER);
		context.compile_shader(&fshader);
		if !context.get_shader_parameter(&fshader, WebGlRenderingContext::COMPILE_STATUS).as_bool().unwrap_or(false) {
			let log: String = context.get_shader_info_log(&fshader).unwrap_or("failed4757".to_string());
			return Result::Err(JsValue::from_str(&log));
		}

		// プログラム作成
		let program: WebGlProgram = context.create_program().ok_or(JsValue::from_str("failed6329"))?;
		context.attach_shader(&program, &vshader);
		context.attach_shader(&program, &fshader);
		context.link_program(&program);
		if !context.get_program_parameter(&program, WebGlRenderingContext::LINK_STATUS).as_bool().unwrap_or(false) {
			let log: String = context.get_program_info_log(&program).unwrap_or("failed57E1".to_string());
			return Result::Err(JsValue::from_str(&log));
		}

		// 変数インデックスの取得
		let attr_pos: u32 = context.get_attrib_location(&program, "vs_attr_pos") as u32;
		let unif_mat: WebGlUniformLocation = context.get_uniform_location(&program, "vs_unif_mat").ok_or(JsValue::from_str("failed6EE2"))?;
		let unif_col: WebGlUniformLocation = context.get_uniform_location(&program, "fs_unif_col").ok_or(JsValue::from_str("failed98E9"))?;

		// プログラムをコンテキストに紐付け
		context.use_program(Option::Some(&program));

		return Result::Ok(WebglTestProgram {
			program: program,
			attr_pos: attr_pos,
			unif_mat: unif_mat,
			unif_col: unif_col,
		});
	}

	// 使用
	pub fn use_program(
		&self,
		context: &WebGlRenderingContext,
	) {
		context.use_program(Option::Some(&self.program));
		context.enable_vertex_attrib_array(self.attr_pos);
	}

	// 取得
	pub fn get_attr_pos(&self) -> u32 { return self.attr_pos; }

	// 設定
	pub fn set_matrix(&self, context: &WebGlRenderingContext, m: [f32; 16]) { context.uniform_matrix4fv_with_f32_array(Option::Some(&self.unif_mat), false, &m); }
	pub fn set_color(&self, context: &WebGlRenderingContext, c: [f32; 4]) { context.uniform4fv_with_f32_array(Option::Some(&self.unif_col), &c); }

	// 破棄
	pub fn dispose(
		&self,
		context: &WebGlRenderingContext,
	) {
		context.delete_program(Option::Some(&self.program));
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


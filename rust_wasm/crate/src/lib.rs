
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

extern crate wasm_bindgen;
extern crate js_sys;
extern crate web_sys;
mod webgl_get_context;
mod webgl_test_program;
mod webgl_test_drawer;

use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;
use web_sys::Window;
use web_sys::Document;
use web_sys::HtmlElement;
use web_sys::WebGlRenderingContext;
use webgl_get_context::webgl_get_context;
use webgl_test_program::WebglTestProgram;
use webgl_test_drawer::WebglTestDrawer;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

#[wasm_bindgen]
extern "C" {
	fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
	alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
	let window: Window = web_sys::window().ok_or(JsValue::from_str("failedFD28"))?;
	let document: Document = window.document().ok_or(JsValue::from_str("failedA42A"))?;
	let body: HtmlElement = document.body().ok_or(JsValue::from_str("failedAFCC"))?;

	let context: WebGlRenderingContext = webgl_get_context(&document, &body)?;
	let program: WebglTestProgram = WebglTestProgram::create(&context)?;
	let drawer: WebglTestDrawer = WebglTestDrawer::create(&context)?;
	drawer.test(&context, &program)?;

	return Result::Ok(());
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


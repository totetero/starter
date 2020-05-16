
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
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use web_sys::Window;
use web_sys::Document;
use web_sys::Element;
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
	#[wasm_bindgen(js_name="alert")]
	fn js_alert(message: &str);

	#[wasm_bindgen(js_namespace = console, js_name="log")]
	fn js_trace(message: &str);
}

#[wasm_bindgen]
pub fn rs_alert(name: &str) {
	js_alert(&format!("hello, {}!", name));
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
	js_trace(&format!("hello, {}!", "world"));

	let window: Window = web_sys::window().ok_or(JsValue::from_str("failedFD28"))?;
	let document: Document = window.document().ok_or(JsValue::from_str("failedA42A"))?;
	let root: Element = document.get_element_by_id("root").ok_or(JsValue::from_str("failedAFCC"))?;
	let root: HtmlElement = root.dyn_into::<HtmlElement>()?;

	let context: WebGlRenderingContext = webgl_get_context(&document, &root)?;
	let program: WebglTestProgram = WebglTestProgram::create(&context)?;
	let drawer: WebglTestDrawer = WebglTestDrawer::create(&context)?;
	drawer.test(&context, &program)?;

	program.dispose(&context);

	return Result::Ok(());
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


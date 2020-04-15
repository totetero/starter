
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

extern crate wasm_bindgen;
extern crate js_sys;
extern crate web_sys;

use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

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

	return Result::Ok(());
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


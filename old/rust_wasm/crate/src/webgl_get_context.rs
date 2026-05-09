
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use web_sys::Document;
use web_sys::Element;
use web_sys::HtmlElement;
use web_sys::HtmlCanvasElement;
use web_sys::WebGlRenderingContext;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// コンテキスト取得
pub fn webgl_get_context(
	document: &Document,
	element: &HtmlElement,
) -> Result<WebGlRenderingContext, JsValue> {
	// キャンバス作成
	let canvas: Element = document.create_element("canvas")?;
	let canvas: HtmlCanvasElement = canvas.dyn_into::<HtmlCanvasElement>()?;
	canvas.set_width(128);
	canvas.set_height(128);
	element.append_child(&canvas)?;

	// コンテキスト取得
	let context_options: JsValue = JsValue::undefined();
	let context: js_sys::Object = canvas.get_context_with_context_options("webgl", &context_options)?.ok_or(JsValue::from_str("failed1C73"))?;
	let context: WebGlRenderingContext = context.dyn_into::<WebGlRenderingContext>()?;

	// コンテキスト設定
	context.clear_color(0.0, 0.0, 0.0, 1.0);

	return Result::Ok(context);
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


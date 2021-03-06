
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { BrowserQRCodeSvgWriter, } from "@zxing/library";
import { BrowserQRCodeReader, Result, } from "@zxing/library";

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	const writer: BrowserQRCodeSvgWriter = new BrowserQRCodeSvgWriter();
	const svg: SVGSVGElement = writer.write("hoge", 300, 300);
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	const blob: Blob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8", });
	const url: string = URL.createObjectURL(blob);
	// TODO safariでうまく動いていないかも

	const img: HTMLImageElement = new Image();
	img.src = "data:image/png;base64,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";
	//img.src = url;
	img.addEventListener("load", (): void => {
		try {
			const browserQRCodeReader: BrowserQRCodeReader = new BrowserQRCodeReader();
			browserQRCodeReader.decodeFromImage(img).then((result: Result): void => { console.log(result); });
		} catch(err) {
			console.error(err);
		}
	});

	document.getElementById("app").appendChild(svg);
	document.getElementById("app").appendChild(img);
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


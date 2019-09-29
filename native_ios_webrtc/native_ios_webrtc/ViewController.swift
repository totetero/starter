
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler{
	private var webView: WKWebView!

	override func viewDidLoad() {
		super.viewDidLoad()

		let controller: WKUserContentController = WKUserContentController()
		controller.add(self, name: "nativeAction")
		controller.add(self, name: "fuhahaAction")

		let configuration: WKWebViewConfiguration = WKWebViewConfiguration()
		configuration.userContentController = controller

		self.webView = WKWebView(frame: CGRect.zero, configuration: configuration)
		self.webView.uiDelegate = self
		self.webView.navigationDelegate = self
		self.view.addSubview(webView)

		//let url: URL = URL(string: "https://127.0.0.1:8080")!
		let url: URL = URL(fileURLWithPath: Bundle.main.path(forResource: "assets/index", ofType: "html")!)
		let request: URLRequest = URLRequest(url: url)
		self.webView.load(request)
	}

	override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews()
		let width: CGFloat = self.view.bounds.size.width
		let height: CGFloat = self.view.bounds.size.height
		let frame: CGRect = CGRect(x:0, y:0, width: width, height: height)
		self.webView.frame = frame
	}

	func webView(_ webView: WKWebView, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
		print("webView didReceive")
		// 認証周りの件以外は無視する
		if challenge.protectionSpace.authenticationMethod != NSURLAuthenticationMethodServerTrust { return completionHandler(URLSession.AuthChallengeDisposition.performDefaultHandling, nil) }
		// 認証の状態を確認する
		var result: SecTrustResultType = SecTrustResultType.invalid
		guard let trust: SecTrust = challenge.protectionSpace.serverTrust else { return completionHandler(URLSession.AuthChallengeDisposition.rejectProtectionSpace, nil) }
		guard SecTrustEvaluate(trust, &result) == noErr else { return completionHandler(URLSession.AuthChallengeDisposition.rejectProtectionSpace, nil) }
		// 信頼出来ない証明書の件以外は無視する
		if result != SecTrustResultType.recoverableTrustFailure { return completionHandler(URLSession.AuthChallengeDisposition.rejectProtectionSpace, nil) }
		// 信頼する
		completionHandler(URLSession.AuthChallengeDisposition.useCredential, URLCredential(trust: trust))
	}

	func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
		print("webView didFinish")

		let script: String = "webkit.messageHandlers.nativeAction.postMessage('test');"
		webView.evaluateJavaScript(script, completionHandler: { (html: Any?, error: Error?) in print(html) })
	}

	func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		if message.name == "nativeAction" {
			print(message.body)
		} else if message.name == "fuhahaAction" {
			guard let body: Dictionary<String, String> = message.body as? Dictionary<String, String> else { return }
			guard let callback: String = body["callback"] else { return }
			guard let value2: String = body["value1"] else { return }
			webView.evaluateJavaScript(String(format: "window.fuhahaCallbacks['%@']('%@');", callback, value2))
		}
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

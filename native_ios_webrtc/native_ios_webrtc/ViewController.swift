
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate{

    private var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let webConfiguration: WKWebViewConfiguration = WKWebViewConfiguration()
        self.webView = WKWebView(frame: CGRect.zero, configuration: webConfiguration)
        self.webView.uiDelegate = self
        self.webView.navigationDelegate = self
        self.view.addSubview(webView)

        let url: URL = URL(string: "https://127.0.0.1:8080")!
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
        var result: SecTrustResultType = SecTrustResultType.invalid
        if challenge.protectionSpace.authenticationMethod != NSURLAuthenticationMethodServerTrust { return completionHandler(URLSession.AuthChallengeDisposition.performDefaultHandling, nil) }
        guard let trust: SecTrust = challenge.protectionSpace.serverTrust else { return completionHandler(URLSession.AuthChallengeDisposition.rejectProtectionSpace, nil) }
        guard SecTrustEvaluate(trust, &result) == noErr else { return completionHandler(URLSession.AuthChallengeDisposition.rejectProtectionSpace, nil) }
        if result != SecTrustResultType.recoverableTrustFailure { return completionHandler(URLSession.AuthChallengeDisposition.rejectProtectionSpace, nil) }
        // 信頼出来ない証明書
        completionHandler(URLSession.AuthChallengeDisposition.useCredential, URLCredential(trust: trust))
    }
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

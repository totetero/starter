//
//  ViewController.swift
//  native_ios_webrtc
//
//  Created by totetero on 2019/09/13.
//  Copyright © 2019 totetero. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    private var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let url: URL = URL(string: "https://google.com")!
        let request: URLRequest = URLRequest(url: url)
        self.webView = WKWebView(frame: CGRect.zero)
        self.webView.load(request)
        self.view.addSubview(webView)
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        let width: CGFloat = self.view.bounds.size.width
        let height: CGFloat = self.view.bounds.size.height
        let frame: CGRect = CGRect(x:0, y:0, width: width, height: height)
        self.webView.frame = frame
    }
}


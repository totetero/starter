import UIKit
import WebKit
import AVFoundation

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class ViewController: UIViewController {
	private var webView: WKWebView?
	private var cameraSession: AVCaptureSession?
	private var cameraPhotoOutput : AVCapturePhotoOutput?
	private var cameraVideoOutput : AVCaptureVideoDataOutput?
	private var cameraLayer : AVCaptureVideoPreviewLayer?
	private var cameraFront: AVCaptureDevice?
	private var cameraBack: AVCaptureDevice?
	private var textureWidth: Int = 0
	private var textureHeight: Int = 0
	private var textureBuffer: [GLubyte]? = nil

	@IBOutlet weak var imageView: UIImageView!

	override func viewDidLoad() {
		super.viewDidLoad()
		self.webviewViewDidLoad()
		self.cameraViewDidLoad()
	}

	override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews()
		self.webviewViewDidLayoutSubviews()
		self.cameraViewDidLayoutSubviews()
	}

	override func viewDidDisappear(_ animated: Bool) {
		super.viewDidDisappear(animated)
		self.cameraViewDidDisappear(animated)
	}

	// 撮影ボタン
	@IBAction func onButton(_ sender: UIButton) -> Void {
		self.onCameraButton()
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

extension ViewController: WKNavigationDelegate, WKScriptMessageHandler {
	// ウエブビュー設定
	private func webviewViewDidLoad() -> Void {
		let controller: WKUserContentController = WKUserContentController()
		controller.add(self, name: "nativeAction")
		controller.add(self, name: "fuhahaAction")
		controller.add(self, name: "textureAction")

		let configuration: WKWebViewConfiguration = WKWebViewConfiguration()
		configuration.userContentController = controller
		configuration.allowsInlineMediaPlayback = true

		let webView: WKWebView = WKWebView(frame: CGRect.zero, configuration: configuration)
		webView.isOpaque = false
		webView.backgroundColor = UIColor.clear
		webView.scrollView.backgroundColor = UIColor.clear
		webView.navigationDelegate = self
		self.webView = webView
		self.view.addSubview(webView)

		//let url: URL = URL(string: "https://127.0.0.1:8080")!
		let url: URL = URL(fileURLWithPath: Bundle.main.path(forResource: "assets/index", ofType: "html")!)
		let request: URLRequest = URLRequest(url: url)
		webView.load(request)
	}

	// ウエブビュー設定
	private func webviewViewDidLayoutSubviews() -> Void {
		guard let webView: WKWebView = self.webView  else { return }
		let width: CGFloat = self.view.bounds.size.width
		let height: CGFloat = self.view.bounds.size.height
		let frame: CGRect = CGRect(x: 0, y: 0, width: width, height: height)
		webView.frame = frame
	}

	// ウエブビューのテクスチャ更新
	private func webviewTextureUpdate(_ buffer: String) -> Void {
		guard let webView: WKWebView = self.webView  else { return }
		DispatchQueue.main.async(execute: { webView.evaluateJavaScript(String(format: "window.textureUpdate(%@);", buffer)) })
	}

	func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
		print("webView decidePolicyFor action")
		decisionHandler(WKNavigationActionPolicy.allow)
	}

	func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
		print("webView didStartProvisionalNavigation")
	}

	func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {
		print("webView didReceiveServerRedirectForProvisionalNavigation")
	}

	// 認証確認
	func webView(_ webView: WKWebView, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
		print("webView didReceive")
		// 認証の種類を確認してSSL/TLS認証以外はデフォルト処理
		if challenge.protectionSpace.authenticationMethod != NSURLAuthenticationMethodServerTrust { return completionHandler(URLSession.AuthChallengeDisposition.performDefaultHandling, nil) }
		// 証明書が取得できなかった場合はデフォルト処理
		guard let trust: SecTrust = challenge.protectionSpace.serverTrust else { return completionHandler(URLSession.AuthChallengeDisposition.performDefaultHandling, nil) }
		// とりあえず信頼してみる
		return completionHandler(URLSession.AuthChallengeDisposition.useCredential, URLCredential(trust: trust))
		//return completionHandler(URLSession.AuthChallengeDisposition.rejectProtectionSpace, nil)
	}

	func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
		print("webView decidePolicyFor response")
		decisionHandler(WKNavigationResponsePolicy.allow)
	}

	func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
		print("webView didCommit")
	}

	func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
		print("webView didFinish")
		let script: String = "webkit.messageHandlers.nativeAction.postMessage('test');"
		webView.evaluateJavaScript(script, completionHandler: { (html: Any, error: Error?) in print(html) })
	}

	func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
		print("webView didFail")
	}

	func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
		print("webView didFailProvisionalNavigation")
		print(error)
	}

	func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		guard let webView: WKWebView = self.webView  else { return }
		if message.name == "nativeAction" {
			print(message.body)
		} else if message.name == "fuhahaAction" {
			guard let body: Dictionary<String, String> = message.body as? Dictionary<String, String> else { return }
			guard let callback: String = body["callback"] else { return }
			guard let value2: String = body["value1"] else { return }
			webView.evaluateJavaScript(String(format: "window.fuhahaCallbacks['%@']('%@');", callback, value2))
		} else if message.name == "textureAction" {
			guard let body: Dictionary<String, Int> = message.body as? Dictionary<String, Int> else { return }
			guard let width: Int = body["width"] else { return }
			guard let height: Int = body["height"] else { return }
			self.textureWidth = width
			self.textureHeight = height
			self.textureBuffer = [GLubyte](repeating: 0, count: width * height * 4)
		}
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

#if targetEnvironment(simulator)
	extension ViewController {
		private func cameraViewDidLoad() -> Void {}
		private func cameraViewDidLayoutSubviews() -> Void {}
		private func onCameraButton() -> Void {}
		private func cameraViewDidDisappear(_ animated: Bool) -> Void {}
	}
#else
	extension ViewController: AVCapturePhotoCaptureDelegate, AVCaptureVideoDataOutputSampleBufferDelegate {
		// カメラ設定
		private func cameraViewDidLoad() -> Void {
			let cameraSession: AVCaptureSession = AVCaptureSession()
			self.cameraSession = cameraSession

			// カメラの画質の設定
			cameraSession.sessionPreset = AVCaptureSession.Preset.photo

			// カメラデバイスのプロパティ設定
			let deviceTypes: [AVCaptureDevice.DeviceType] = [AVCaptureDevice.DeviceType.builtInWideAngleCamera]
			let mediaType: AVMediaType = AVMediaType.video
			let position: AVCaptureDevice.Position = AVCaptureDevice.Position.unspecified
			let deviceDiscoverySession: AVCaptureDevice.DiscoverySession = AVCaptureDevice.DiscoverySession(deviceTypes: deviceTypes, mediaType: mediaType, position: position)

			// プロパティの条件を満たしたカメラデバイスの取得
			let devices: [AVCaptureDevice] = deviceDiscoverySession.devices
			for device: AVCaptureDevice in devices {
				if device.position == AVCaptureDevice.Position.back { self.cameraBack = device }
				if device.position == AVCaptureDevice.Position.front { self.cameraFront = device }
			}

			do {
				// 入力データの設定
				let captureDeviceInput: AVCaptureDeviceInput = try AVCaptureDeviceInput(device: self.cameraBack!)
				if cameraSession.canAddInput(captureDeviceInput) { cameraSession.addInput(captureDeviceInput) }
			} catch {}

			// 出力データの設定
			let cameraPhotoOutput: AVCapturePhotoOutput = AVCapturePhotoOutput()
			let setting: AVCapturePhotoSettings = AVCapturePhotoSettings(format: [AVVideoCodecKey : AVVideoCodecType.jpeg])
			cameraPhotoOutput.setPreparedPhotoSettingsArray([setting], completionHandler: nil)
			if cameraSession.canAddOutput(cameraPhotoOutput) { cameraSession.addOutput(cameraPhotoOutput) }
			self.cameraPhotoOutput = cameraPhotoOutput

			// 出力データの設定
			let cameraVideoOutput: AVCaptureVideoDataOutput = AVCaptureVideoDataOutput()
			cameraVideoOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey: kCVPixelFormatType_32BGRA] as [String : Any]
			cameraVideoOutput.setSampleBufferDelegate(self, queue: DispatchQueue(label: "fuhahaTakeCameraDevice"))
			cameraVideoOutput.alwaysDiscardsLateVideoFrames = true
			if cameraSession.canAddOutput(cameraVideoOutput) { cameraSession.addOutput(cameraVideoOutput) }
			self.cameraVideoOutput = cameraVideoOutput

			// カメラのプレビューを表示するレイヤの設定
			let cameraLayer: AVCaptureVideoPreviewLayer = AVCaptureVideoPreviewLayer(session: cameraSession)
			cameraLayer.videoGravity = AVLayerVideoGravity.resizeAspectFill
			self.view.layer.insertSublayer(cameraLayer, at: 0)
			self.cameraLayer = cameraLayer

			// カメラ開始
			cameraSession.startRunning()
		}

		// カメラ設定
		private func cameraViewDidLayoutSubviews() -> Void {
			if let cameraLayer: AVCaptureVideoPreviewLayer = self.cameraLayer {
				let width: CGFloat = self.view.bounds.size.width
				let height: CGFloat = self.view.bounds.size.height
				let frame: CGRect = CGRect(x: 0, y: 0, width: width, height: height)
				cameraLayer.frame = frame

				if let connection: AVCaptureConnection = cameraLayer.connection {
					if connection.isVideoOrientationSupported {
						switch UIDevice.current.orientation {
							case UIDeviceOrientation.landscapeLeft: connection.videoOrientation = AVCaptureVideoOrientation.landscapeRight; break
							case UIDeviceOrientation.landscapeRight: connection.videoOrientation = AVCaptureVideoOrientation.landscapeLeft; break
							case UIDeviceOrientation.portraitUpsideDown: connection.videoOrientation = AVCaptureVideoOrientation.portraitUpsideDown; break
							case UIDeviceOrientation.portrait: connection.videoOrientation = AVCaptureVideoOrientation.portrait; break
							default: break
						}
					}
				}
			}
		}

		// カメラ撮影開始
		private func onCameraButton() -> Void {
			if let cameraPhotoOutput: AVCapturePhotoOutput = self.cameraPhotoOutput {
				for connection: AVCaptureConnection in cameraPhotoOutput.connections {
					if connection.isVideoOrientationSupported {
						switch UIDevice.current.orientation {
							case UIDeviceOrientation.landscapeLeft: connection.videoOrientation = AVCaptureVideoOrientation.landscapeRight; break
							case UIDeviceOrientation.landscapeRight: connection.videoOrientation = AVCaptureVideoOrientation.landscapeLeft; break
							case UIDeviceOrientation.portraitUpsideDown: connection.videoOrientation = AVCaptureVideoOrientation.portraitUpsideDown; break
							case UIDeviceOrientation.portrait: connection.videoOrientation = AVCaptureVideoOrientation.portrait; break
							default: break
						}
					}
				}

				let settings: AVCapturePhotoSettings = AVCapturePhotoSettings()
				settings.flashMode = AVCaptureDevice.FlashMode.auto
				settings.isAutoStillImageStabilizationEnabled = true
				cameraPhotoOutput.capturePhoto(with: settings, delegate: self)
			}
		}

		// カメラ撮影完了
		internal func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) -> Void {
			if let data: Data = photo.fileDataRepresentation() {
				let image: UIImage? = UIImage(data: data)
				self.imageView.image = image
			}
		}

		// 毎フレーム画像処理
		internal func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
			if connection.isVideoOrientationSupported {
				switch UIDevice.current.orientation {
					case UIDeviceOrientation.landscapeLeft: connection.videoOrientation = AVCaptureVideoOrientation.landscapeRight; break
					case UIDeviceOrientation.landscapeRight: connection.videoOrientation = AVCaptureVideoOrientation.landscapeLeft; break
					case UIDeviceOrientation.portraitUpsideDown: connection.videoOrientation = AVCaptureVideoOrientation.portraitUpsideDown; break
					case UIDeviceOrientation.portrait: connection.videoOrientation = AVCaptureVideoOrientation.portrait; break
					default: break
				}
			}

			let dateStart: Date = Date()

			if true {
				guard let imageBuffer: CVImageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
				guard var texBuf: [GLubyte] = self.textureBuffer else { return }
				let texw: Int = self.textureWidth
				let texh: Int = self.textureHeight
				let texBytesPerRow: Int = texw * 4

				CVPixelBufferLockBaseAddress(imageBuffer, CVPixelBufferLockFlags(rawValue: 0))
				guard let data: UnsafeMutableRawPointer = CVPixelBufferGetBaseAddressOfPlane(imageBuffer, 0) else { return }
				let camBuf: UnsafeMutablePointer<GLubyte> = data.assumingMemoryBound(to: GLubyte.self)
				let camw: Int = CVPixelBufferGetWidth(imageBuffer)
				let camh: Int = CVPixelBufferGetHeight(imageBuffer)
				let camBytesPerRow: Int = CVPixelBufferGetBytesPerRow(imageBuffer)
				for texy: Int in 0..<texh {
					for texx: Int in 0..<texw {
						let camx: Int = min(texx * camw / texw, camw - 1)
						let camy: Int = min(texy * camh / texh, camh - 1)
						let camIndex: Int = camBytesPerRow * camy + camx * 4
						let texIndex: Int = texBytesPerRow * texy + texx * 4
						texBuf[texIndex + 0] = camBuf[camIndex + 2]
						texBuf[texIndex + 1] = camBuf[camIndex + 1]
						texBuf[texIndex + 2] = camBuf[camIndex + 0]
						texBuf[texIndex + 3] = camBuf[camIndex + 3]
					}
				}
				CVPixelBufferUnlockBaseAddress(imageBuffer, CVPixelBufferLockFlags(rawValue: 0))

				let buffer: String = String(format: "[%@]", texBuf.map({ (value: GLubyte) -> String in return String(value) }).joined(separator: ","))
				self.webviewTextureUpdate(buffer)
			} else {
				guard let imageBuffer: CVImageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }

				// イメージバッファのロック
				CVPixelBufferLockBaseAddress(imageBuffer, CVPixelBufferLockFlags(rawValue: 0))
				// 画像情報を取得
				guard let data: UnsafeMutableRawPointer = CVPixelBufferGetBaseAddressOfPlane(imageBuffer, 0) else { return }
				let width: Int = CVPixelBufferGetWidth(imageBuffer)
				let height: Int = CVPixelBufferGetHeight(imageBuffer)
				let bytesPerRow: Int = CVPixelBufferGetBytesPerRow(imageBuffer)
				// ビットマップコンテキスト作成
				let space: CGColorSpace = CGColorSpaceCreateDeviceRGB()
				let bitsPerComponent: Int = 8
				let bitmapInfoRawValue: UInt32 = (CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue) as UInt32
				let bitmapInfo: CGBitmapInfo = CGBitmapInfo(rawValue: bitmapInfoRawValue)
				guard let newContext: CGContext = CGContext(data: data, width: width, height: height, bitsPerComponent: bitsPerComponent, bytesPerRow: bytesPerRow, space: space, bitmapInfo: bitmapInfo.rawValue) else { return }
				// 画像作成
				guard let imageRef: CGImage = newContext.makeImage() else { return }
				let image: UIImage = UIImage(cgImage: imageRef, scale: 1.0, orientation: UIImage.Orientation.right)
				// イメージバッファのアンロック
				CVPixelBufferUnlockBaseAddress(imageBuffer, CVPixelBufferLockFlags(rawValue: 0))

				let size: CGSize = CGSize(width: self.textureWidth, height: self.textureHeight)
				let rect: CGRect = CGRect(origin: .zero, size: size)
				UIGraphicsBeginImageContextWithOptions(size, false, UIScreen.main.scale)
				image.draw(in: rect)
				guard let reSizeImage: UIImage = UIGraphicsGetImageFromCurrentImageContext() else { return }
				UIGraphicsEndImageContext() 

				guard let cgImage: CGImage = reSizeImage.cgImage else { return }
				guard let dataProvider: CGDataProvider = cgImage.dataProvider else { return }
				let length: Int = CFDataGetLength(dataProvider.data)
				var rawData: [UInt8] = [UInt8](repeating: 0, count: length)
				CFDataGetBytes(dataProvider.data, CFRange(location: 0, length: length), &rawData)

				let buffer: String = String(format: "[%@]", rawData.map({ (value: UInt8) -> String in return String(value) }).joined(separator: ","))
				self.webviewTextureUpdate(buffer)
			}

			let elapsed: TimeInterval = Date().timeIntervalSince(dateStart)
			print(elapsed)
		}

		// カメラ破棄
		private func cameraViewDidDisappear(_ animated: Bool) {
			if let cameraSession: AVCaptureSession = self.cameraSession {
				cameraSession.stopRunning()
				for output: AVCaptureOutput in cameraSession.outputs { cameraSession.removeOutput(output) }
				for input: AVCaptureInput in cameraSession.inputs { cameraSession.removeInput(input) }
				self.cameraSession = nil
				self.cameraPhotoOutput = nil
				self.cameraVideoOutput = nil
				self.cameraLayer = nil
				self.cameraFront = nil
				self.cameraBack = nil
			}
		}
	}
#endif

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


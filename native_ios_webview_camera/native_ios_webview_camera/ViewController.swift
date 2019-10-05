import UIKit
import AVFoundation

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class ViewController: UIViewController {
	private var cameraSession: AVCaptureSession?;
	private var cameraOutput : AVCapturePhotoOutput?;
	private var cameraLayer : AVCaptureVideoPreviewLayer?;
	private var cameraFront: AVCaptureDevice?;
	private var cameraBack: AVCaptureDevice?;

	@IBOutlet weak var imageView: UIImageView!;

	override func viewDidLoad(){
		super.viewDidLoad();
		self.cameraViewDidLoad();
	}

	override func viewDidLayoutSubviews() {
		super.viewDidLayoutSubviews();
		self.cameraViewDidLayoutSubviews();
	}

	override func viewDidDisappear(_ animated: Bool) {
		super.viewDidDisappear(animated)
		self.cameraViewDidDisappear(animated);
	}

	// 撮影ボタン
	@IBAction func onButton(_ sender: UIButton) -> Void{
		self.onCameraButton();
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

#if targetEnvironment(simulator)
	extension ViewController{
		private func cameraViewDidLoad() -> Void{}
		private func cameraViewDidLayoutSubviews() -> Void{}
		private func onCameraButton() -> Void{}
		private func cameraViewDidDisappear(_ animated: Bool) -> Void{}
	}
#else
	extension ViewController: AVCapturePhotoCaptureDelegate{
		// カメラ設定
		private func cameraViewDidLoad() -> Void{
			let cameraSession: AVCaptureSession = AVCaptureSession()
			self.cameraSession = cameraSession;

			// カメラの画質の設定
			cameraSession.sessionPreset = AVCaptureSession.Preset.photo;

			// カメラデバイスのプロパティ設定
			let deviceTypes: [AVCaptureDevice.DeviceType] = [AVCaptureDevice.DeviceType.builtInWideAngleCamera];
			let mediaType: AVMediaType = AVMediaType.video;
			let position: AVCaptureDevice.Position = AVCaptureDevice.Position.unspecified;
			let deviceDiscoverySession: AVCaptureDevice.DiscoverySession = AVCaptureDevice.DiscoverySession(deviceTypes: deviceTypes, mediaType: mediaType, position: position);

			// プロパティの条件を満たしたカメラデバイスの取得
			let devices: [AVCaptureDevice] = deviceDiscoverySession.devices;
			for device: AVCaptureDevice in devices {
				if device.position == AVCaptureDevice.Position.back {self.cameraBack = device;}
				if device.position == AVCaptureDevice.Position.front {self.cameraFront = device;}
			}

			do{
				// 入力データの設定
				let captureDeviceInput: AVCaptureDeviceInput = try AVCaptureDeviceInput(device: self.cameraBack!);
				if cameraSession.canAddInput(captureDeviceInput) {cameraSession.addInput(captureDeviceInput);}
			}catch{}

			// 出力データの設定
			let cameraOutput: AVCapturePhotoOutput = AVCapturePhotoOutput();
			let setting: AVCapturePhotoSettings = AVCapturePhotoSettings(format: [AVVideoCodecKey : AVVideoCodecType.jpeg]);
			cameraOutput.setPreparedPhotoSettingsArray([setting], completionHandler: nil);
			if cameraSession.canAddOutput(cameraOutput) {cameraSession.addOutput(cameraOutput);}
			self.cameraOutput = cameraOutput;

			// カメラのプレビューを表示するレイヤの設定
			let cameraLayer: AVCaptureVideoPreviewLayer = AVCaptureVideoPreviewLayer(session: cameraSession);
			cameraLayer.videoGravity = AVLayerVideoGravity.resizeAspectFill;
			self.view.layer.insertSublayer(cameraLayer, at: 0);
			self.cameraLayer = cameraLayer;

			// カメラ開始
			cameraSession.startRunning();
		}

		// カメラ設定
		private func cameraViewDidLayoutSubviews() -> Void{
			if let cameraLayer: AVCaptureVideoPreviewLayer = self.cameraLayer {
				cameraLayer.frame = self.view.bounds;

				if let connection: AVCaptureConnection = cameraLayer.connection {
					if connection.isVideoOrientationSupported {
						switch UIDevice.current.orientation {
							case UIDeviceOrientation.landscapeLeft: connection.videoOrientation = AVCaptureVideoOrientation.landscapeRight; break;
							case UIDeviceOrientation.landscapeRight: connection.videoOrientation = AVCaptureVideoOrientation.landscapeLeft; break;
							case UIDeviceOrientation.portraitUpsideDown: connection.videoOrientation = AVCaptureVideoOrientation.portraitUpsideDown; break;
							case UIDeviceOrientation.portrait: connection.videoOrientation = AVCaptureVideoOrientation.portrait; break;
							default: break;
						}
					}
				}
			}
		}

		// カメラ撮影開始
		private func onCameraButton() -> Void{
			if let cameraOutput: AVCapturePhotoOutput = self.cameraOutput {
				for connection: AVCaptureConnection in cameraOutput.connections {
					if connection.isVideoOrientationSupported {
						switch UIDevice.current.orientation {
							case UIDeviceOrientation.landscapeLeft: connection.videoOrientation = AVCaptureVideoOrientation.landscapeRight; break;
							case UIDeviceOrientation.landscapeRight: connection.videoOrientation = AVCaptureVideoOrientation.landscapeLeft; break;
							case UIDeviceOrientation.portraitUpsideDown: connection.videoOrientation = AVCaptureVideoOrientation.portraitUpsideDown; break;
							case UIDeviceOrientation.portrait: connection.videoOrientation = AVCaptureVideoOrientation.portrait; break;
							default: break;
						}
					}
				}

				let settings: AVCapturePhotoSettings = AVCapturePhotoSettings();
				settings.flashMode = AVCaptureDevice.FlashMode.auto;
				settings.isAutoStillImageStabilizationEnabled = true;
				cameraOutput.capturePhoto(with: settings, delegate: self);
			}
		}

		// カメラ撮影完了
		internal func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) -> Void{
			if let data: Data = photo.fileDataRepresentation() {
				let image: UIImage? = UIImage(data: data);
				self.imageView.image = image;
			}
		}

		// カメラ破棄
		private func cameraViewDidDisappear(_ animated: Bool) {
			if let cameraSession: AVCaptureSession = self.cameraSession {
				cameraSession.stopRunning();
				for output: AVCaptureOutput in cameraSession.outputs {cameraSession.removeOutput(output);}
				for input: AVCaptureInput in cameraSession.inputs {cameraSession.removeInput(input);}
				self.cameraSession = nil;
				self.cameraOutput = nil;
				self.cameraLayer = nil;
				self.cameraFront = nil;
				self.cameraBack = nil;
			}
		}
	}
#endif

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


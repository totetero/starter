package com.totetero.test.librarytest

import android.Manifest
import android.app.AlertDialog
import android.arch.lifecycle.ViewModelProviders
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.hardware.camera2.*
import android.hardware.camera2.params.StreamConfigurationMap
import android.os.Bundle
import android.os.Handler
import android.os.HandlerThread
import android.support.v4.app.Fragment
import android.support.v4.content.ContextCompat
import android.util.Size
import android.view.*
import kotlinx.android.synthetic.main.library_test_page3_camera_fragment.*
import java.util.*

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class LibraryTestPage3CameraFragment : Fragment(){
	private val PERMISSION_REQUEST_CAMERA: Int = 0x01

	private lateinit var viewModel: LibraryTestPage3CameraViewModel
	private var listener: ListenerRoot? = null

	private var cameraDevice: CameraDevice? = null
	private var cameraSession: CameraCaptureSession? = null
	private var cameraBackgroundThread: HandlerThread? = null
	private var cameraBackgroundHandler: Handler? = null
	private var cameraOpenStep2Handler: Handler? = null
	private var cameraOpenStep2Runnable: Runnable? = null

	companion object {
		fun newInstance() = LibraryTestPage3CameraFragment()
	}

	override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View?{
		return inflater.inflate(R.layout.library_test_page3_camera_fragment, container, false)
	}

	override fun onActivityCreated(savedInstanceState: Bundle?){
		super.onActivityCreated(savedInstanceState)
		viewModel = ViewModelProviders.of(this).get(LibraryTestPage3CameraViewModel::class.java)
	}

	override fun onStart(){
		super.onStart()
		android.util.Log.d("camera", "onStart")
	}

	override fun onResume(){
		super.onResume()
		android.util.Log.d("camera", "onResume")
		// バックグラウンドハンドラを作成する
		this.cameraBackgroundThread = HandlerThread("cameraBackground").also{it.start()}
		this.cameraBackgroundHandler = Handler(this.cameraBackgroundThread?.looper)
		// ステップハンドラを作成する
		this.cameraOpenStep2Handler = Handler()
		// カメラの起動
		this.cameraOpenStep1()
	}

	override fun onPause(){
		super.onPause()
		android.util.Log.d("camera", "onPause")
		// カメラを閉じる
		this.cameraSession?.stopRepeating()
		this.cameraSession?.abortCaptures()
		this.cameraSession?.close()
		this.cameraSession = null
		this.cameraDevice?.close()
		this.cameraDevice = null
		// ステップハンドラを破棄する
		this.cameraOpenStep2Handler?.removeCallbacks(this.cameraOpenStep2Runnable)
		this.cameraOpenStep2Handler = null
		this.cameraOpenStep2Runnable = null
		// バックグラウンドハンドラを破棄する
		this.cameraBackgroundThread?.quitSafely()
		try{this.cameraBackgroundThread?.join()}catch(e: InterruptedException){e.printStackTrace()}
		this.cameraBackgroundThread = null
		this.cameraBackgroundHandler = null
	}

	override fun onStop(){
		super.onStop()
		android.util.Log.d("camera", "onStop")
	}

	// パーミッション請求に対する応答のコールバック
	override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray){
		if(requestCode == this.PERMISSION_REQUEST_CAMERA){
			var isEnableCamera = false
			for(i: Int in permissions.indices){
				if(grantResults[i] != PackageManager.PERMISSION_GRANTED){continue}
				if(permissions[i] == Manifest.permission.CAMERA){isEnableCamera = true}
			}
			if(isEnableCamera){this.cameraOpenStep1()}
		}else{
			super.onRequestPermissionsResult(requestCode, permissions, grantResults)
		}
	}

	// カメラ起動に必要なパーミッション確認
	private fun cameraOpenStep1(){
		val context: Context = this.context ?: throw Exception()
		val permission: Int = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
		if(permission == PackageManager.PERMISSION_GRANTED){
			// 必要なパーミッションを持っている
			this.cameraOpenStep2()
		}else if(this.shouldShowRequestPermissionRationale(Manifest.permission.CAMERA)){
			// パーミッション許可再確認
			val builder: AlertDialog.Builder = AlertDialog.Builder(context)
			builder.setMessage("Permission Check")
			builder.setPositiveButton(android.R.string.ok) {_, _ -> this.requestPermissions(arrayOf(Manifest.permission.CAMERA), this.PERMISSION_REQUEST_CAMERA)}
			builder.setNegativeButton(android.R.string.cancel) {_, _ ->}
			builder.show()
		}else{
			// 最初のパーミッション許可確認
			this.requestPermissions(arrayOf(Manifest.permission.CAMERA), this.PERMISSION_REQUEST_CAMERA)
		}
	}

	// カメラ起動をできるようになるまで待つ
	private fun cameraOpenStep2(){
		if(libPreview.isAvailable && libPhoto.isAvailable){
			this.cameraOpenStep3()
		}else if(this.cameraOpenStep2Runnable == null){
			this.cameraOpenStep2Runnable = Runnable{
				this.cameraOpenStep2Runnable = null
				this.cameraOpenStep2()
			}
			this.cameraOpenStep2Handler?.postDelayed(this.cameraOpenStep2Runnable, 100)
		}else{
			throw Exception()
		}
	}

	// カメラ起動
	private fun cameraOpenStep3(){
		val context: Context = this.context ?: throw Exception()
		val permission: Int = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
		if(permission == PackageManager.PERMISSION_GRANTED){
			val manager: CameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
			for(cameraId: String? in manager.cameraIdList){
				if(cameraId == null){continue}

				// 背面カメラを選択
				val characteristics: CameraCharacteristics = manager.getCameraCharacteristics(cameraId) ?: continue
				if(characteristics.get(CameraCharacteristics.LENS_FACING) != CameraCharacteristics.LENS_FACING_BACK){continue}

				// 画面の傾きを取得
				val windowManager: WindowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
				val rotation: Int = windowManager.defaultDisplay.rotation
				// // カメラの向きを取得
				// val orientation: Int = characteristics.get(CameraCharacteristics.SENSOR_ORIENTATION) ?: 0
				// // 画面回転を考慮して表示領域を取得
				// var isTranspose = false
				// if((rotation == Surface.ROTATION_0 || rotation == Surface.ROTATION_180) && (orientation == 90 || orientation == 270)){isTranspose = true}
				// if((rotation == Surface.ROTATION_90 || rotation == Surface.ROTATION_270) && (orientation == 0 || orientation == 180)){isTranspose = true}

				// 最も小さい撮影領域を取得
				var preview1Size: Size? = null
				var preview2Size: Size? = null
				val map: StreamConfigurationMap? = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP)
				if(map != null){
					for(size: Size in map.getOutputSizes(ImageFormat.YUV_420_888)){if(preview1Size == null || preview1Size.width * preview1Size.height > size.width * size.height){preview1Size = size}}
					for(size: Size in map.getOutputSizes(ImageFormat.JPEG)){if(preview2Size == null || preview2Size.width * preview2Size.height > size.width * size.height){preview2Size = size}}
				}

				// 表示サイズとバッファサイズ確認
				val display1Width: Float = libPreview.width.toFloat()
				val display1Height: Float = libPreview.height.toFloat()
				val display2Width: Float = libPhoto.width.toFloat()
				val display2Height: Float = libPhoto.height.toFloat()
				val preview1Width: Float = (if(preview1Size == null){60}else{Math.min(preview1Size.width, preview1Size.height)}).toFloat()
				val preview1Height: Float = (if(preview1Size == null){80}else{Math.max(preview1Size.width, preview1Size.height)}).toFloat()
				val preview2Width: Float = (if(preview2Size == null){60}else{Math.min(preview2Size.width, preview2Size.height)}).toFloat()
				val preview2Height: Float = (if(preview2Size == null){80}else{Math.max(preview2Size.width, preview2Size.height)}).toFloat()
				// 画像のバッファサイズ設定
				libPreview.surfaceTexture.setDefaultBufferSize(preview1Width.toInt(), preview1Height.toInt())
				libPhoto.surfaceTexture.setDefaultBufferSize(preview2Width.toInt(), preview2Height.toInt())

				// アスペクト比を調整しつつ(maxで写真で画面を覆う/minで写真が全て表示される)ような拡大率の計算
				val scale1x: Float = preview1Width / display1Width * Math.max(display1Width / preview1Width, display1Height / preview1Height)
				val scale1y: Float = preview1Height / display1Height * Math.max(display1Width / preview1Width, display1Height / preview1Height)
				val scale2x: Float = preview2Width / display2Width * Math.max(display2Width / preview2Width, display2Height / preview2Height)
				val scale2y: Float = preview2Height / display2Height * Math.max(display2Width / preview2Width, display2Height / preview2Height)
				// 画像回転行列設定
				val matrix1 = Matrix()
				val matrix2 = Matrix()
				matrix1.setTranslate(-display1Width / 2, -display1Height / 2)
				matrix2.setTranslate(-display2Width / 2, -display2Height / 2)
				matrix1.postScale(scale1x, scale1y)
				matrix2.postScale(scale2x, scale2y)
				if(rotation == Surface.ROTATION_90){matrix1.postRotate(-90f)}
				if(rotation == Surface.ROTATION_90){matrix2.postRotate(-90f)}
				if(rotation == Surface.ROTATION_180){matrix1.postRotate(180f)}
				if(rotation == Surface.ROTATION_180){matrix2.postRotate(180f)}
				if(rotation == Surface.ROTATION_270){matrix1.postRotate(90f)}
				if(rotation == Surface.ROTATION_270){matrix2.postRotate(90f)}
				matrix1.postTranslate(display1Width / 2, display1Height / 2)
				matrix2.postTranslate(display2Width / 2, display2Height / 2)
				libPreview.setTransform(matrix1)
				libPhoto.setTransform(matrix2)

				// カメラ起動
				val self: LibraryTestPage3CameraFragment = this
				manager.openCamera(cameraId, object: CameraDevice.StateCallback(){
					override fun onOpened(device: CameraDevice){self.onCameraDeviceOpened(device)}
					override fun onDisconnected(device: CameraDevice){self.onCameraDeviceDisconnected(device)}
					override fun onError(device: CameraDevice, error: Int){self.onCameraDeviceError(device, error)}
				}, this.cameraBackgroundHandler)
				break
			}
		}else{
			throw Exception()
		}
	}

	private fun onCameraDeviceOpened(device: CameraDevice){
		android.util.Log.d("camera", "onCameraDeviceOpened")
		if(this.cameraDevice != null && this.cameraDevice != device){throw Exception()}
		this.cameraDevice = device

		// プレビューの準備
		val surface1 = Surface(libPreview.surfaceTexture)
		val builder1: CaptureRequest.Builder = device.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
		builder1.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE)
		builder1.set(CaptureRequest.CONTROL_AE_MODE, CaptureRequest.CONTROL_AE_MODE_ON_AUTO_FLASH)
		builder1.addTarget(surface1)
		val request1: CaptureRequest = builder1.build()

		// プレビューの準備
		val surface2 = Surface(libPhoto.surfaceTexture)
		val builder2: CaptureRequest.Builder = device.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
		builder2.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE)
		builder2.set(CaptureRequest.CONTROL_AE_MODE, CaptureRequest.CONTROL_AE_MODE_ON_AUTO_FLASH)
		builder2.addTarget(surface2)
		val request2: CaptureRequest = builder2.build()

		// キャプチャセッションを作成
		val self: LibraryTestPage3CameraFragment = this
		device.createCaptureSession(Arrays.asList(surface1, surface2), object: CameraCaptureSession.StateCallback(){
			override fun onConfigured(session: CameraCaptureSession){self.onCameraSessionConfigured(session, request1, request2)}
			override fun onConfigureFailed(session: CameraCaptureSession){self.onCameraSessionConfigureFailed(session)}
		}, this.cameraBackgroundHandler)
	}

	private fun onCameraDeviceDisconnected(device: CameraDevice){
		android.util.Log.d("camera", "onCameraDeviceDisconnected")
		if(this.cameraDevice != null && this.cameraDevice != device){throw Exception()}
		this.cameraDevice = device
	}

	private fun onCameraDeviceError(device: CameraDevice, error: Int){
		android.util.Log.d("camera", "onCameraDeviceError %d".format(error))
		if(this.cameraDevice != null && this.cameraDevice != device){throw Exception()}
		this.cameraDevice = device
	}

	private fun onCameraSessionConfigured(session: CameraCaptureSession, request1: CaptureRequest, request2: CaptureRequest){
		android.util.Log.d("camera", "onCameraSessionConfigured")
		if(this.cameraSession != null && this.cameraSession != session){throw Exception()}
		this.cameraSession = session

		// カメラシャッター
		libShutter.setOnClickListener{
			// プレビューの更新を止める
			session.stopRepeating()

			// 撮影
			val self: LibraryTestPage3CameraFragment = this
			session.capture(request2, object: CameraCaptureSession.CaptureCallback(){
				override fun onCaptureCompleted(session: CameraCaptureSession, request: CaptureRequest, result: TotalCaptureResult){
					// プレビューの更新を再開する
					session.setRepeatingRequest(request1, null, self.cameraBackgroundHandler)
				}
			}, this.cameraBackgroundHandler)
		}

		// カメラプレビュー開始要求
		session.setRepeatingRequest(request1, null, this.cameraBackgroundHandler)
	}

	private fun onCameraSessionConfigureFailed(session: CameraCaptureSession){
		android.util.Log.d("camera", "onCameraSessionConfigureFailed")
		if(this.cameraSession != null && this.cameraSession != session){throw Exception()}
		this.cameraSession = session
	}

	fun setListenerRoot(listener: ListenerRoot){
		this.listener = listener
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

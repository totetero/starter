import Cocoa
import Metal
import MetalKit

let vertexBufferPosition = 0
let vertexBufferTexcoord = 1
let fragmentTexture = 0

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class MetalViewController: NSViewController, MTKViewDelegate {
    private var device: MTLDevice!
    private var commandQueue: MTLCommandQueue!
    
    private var renderPipelineState: MTLRenderPipelineState!
    private var renderPassDescriptor: MTLRenderPassDescriptor!
    
    private var vertBuffer: MTLBuffer!
    private var texcBuffer: MTLBuffer!
    private var texture: MTLTexture!
    
    // Interface Builder 使用時は loadView をオーバーライドしてはならない。
    override func loadView() {
        let mtkView: MTKView = MTKView()
        mtkView.device = MTLCreateSystemDefaultDevice()
        mtkView.delegate = self
        self.view = mtkView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let mtkView: MTKView = self.view as! MTKView
        self.device = mtkView.device
        self.commandQueue = self.device.makeCommandQueue()
        
        // 頂点配列
        let vertData: [Float] = [
            -1.0, -1.0, 0, 1,
             1.0, -1.0, 0, 1,
            -1.0,  1.0, 0, 1,
             1.0,  1.0, 0, 1,
        ]
        let vertSize: Int = vertData.count * MemoryLayout<Float>.size
        self.vertBuffer = self.device.makeBuffer(bytes: vertData, length: vertSize)

        // テクスチャ座標配列
        let texcData: [Float] = [
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ]
        let texcSize: Int = texcData.count * MemoryLayout<Float>.size
        self.texcBuffer = self.device.makeBuffer(bytes: texcData, length: texcSize)

        if false {
            // テクスチャ読み込み
            let textureLoader: MTKTextureLoader = MTKTextureLoader(device: self.device)
            self.texture = try! textureLoader.newTexture(name: "TestAssetsImage", scaleFactor: 1.0, bundle: nil)
        } else {
            // テクスチャ作成 pixels
            let width: Int = 16
            let height: Int = 16
            let components: Int = 4
            let bitsPerComponent: Int = 8
            let bitsPerPixel: Int = bitsPerComponent * components
            let bytesPerRow: Int = width * bitsPerPixel / 8
            var pixels: [UInt8] = [UInt8](repeating: 0, count: width * height * components);
            for i in 0 ..< width {
                for j in 0 ..< height {
                    pixels[(width * j + i) * components + 0] = 0x00
                    pixels[(width * j + i) * components + 1] = UInt8(0xff * i / (width - 1))
                    pixels[(width * j + i) * components + 2] = UInt8(0xff * j / (height - 1))
                    pixels[(width * j + i) * components + 3] = 0xff
                }
            }
            // テクスチャ作成 MTLTexture
            let pixelFormat = MTLPixelFormat.bgra8Unorm
            let textureDescriptor: MTLTextureDescriptor = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: pixelFormat, width: width, height: height, mipmapped: true)
            let region = MTLRegionMake2D(0, 0, width, height)
            self.texture = self.device.makeTexture(descriptor: textureDescriptor)
            self.texture.replace(region: region, mipmapLevel: 0, withBytes: pixels, bytesPerRow: bytesPerRow)
        }
        mtkView.colorPixelFormat = self.texture.pixelFormat

        // レンダリングパイプライン作成
        guard let library: MTLLibrary = self.device.makeDefaultLibrary() else {fatalError()}
        let renderPipelineDescriptor: MTLRenderPipelineDescriptor = MTLRenderPipelineDescriptor()
        renderPipelineDescriptor.vertexFunction = library.makeFunction(name: "vertexShader")
        renderPipelineDescriptor.fragmentFunction = library.makeFunction(name: "fragmentShader")
        renderPipelineDescriptor.colorAttachments[0].pixelFormat = self.texture.pixelFormat
        self.renderPipelineState = try! self.device.makeRenderPipelineState(descriptor: renderPipelineDescriptor)

        self.renderPassDescriptor = MTLRenderPassDescriptor()
    }
    
    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
    }
    
    func draw(in view: MTKView) {
        guard let drawable: CAMetalDrawable = view.currentDrawable else {return}
        guard let commandBuffer: MTLCommandBuffer = self.commandQueue.makeCommandBuffer() else {fatalError()}
        
        renderPassDescriptor.colorAttachments[0].texture = drawable.texture
        guard let renderCommandEncoder: MTLRenderCommandEncoder = commandBuffer.makeRenderCommandEncoder(descriptor: renderPassDescriptor) else {return}
        
        renderCommandEncoder.setRenderPipelineState(self.renderPipelineState)
        renderCommandEncoder.setVertexBuffer(self.vertBuffer, offset: 0, index: vertexBufferPosition)
        renderCommandEncoder.setVertexBuffer(self.texcBuffer, offset: 0, index: vertexBufferTexcoord)
        renderCommandEncoder.setFragmentTexture(self.texture, index: fragmentTexture)
        renderCommandEncoder.drawPrimitives(type: .triangleStrip, vertexStart: 0, vertexCount: 4)
        
        renderCommandEncoder.endEncoding()
        
        commandBuffer.present(drawable)
        commandBuffer.commit()
        commandBuffer.waitUntilCompleted()
    }
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

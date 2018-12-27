import Cocoa

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class MetalViewController: NSViewController {
    var displayLink: CVDisplayLink?
    
    // Interface Builder 使用時は loadView をオーバーライドしてはならない。
    override func loadView() {
        self.view = NSView()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let callback: CVDisplayLinkOutputCallback = {
            (displayLink: CVDisplayLink, now: UnsafePointer<CVTimeStamp>, outputTime: UnsafePointer<CVTimeStamp>, flagsIn: CVOptionFlags, flagsOut: UnsafeMutablePointer<CVOptionFlags>, displayLinkContext: UnsafeMutableRawPointer?) -> CVReturn in
            let innerSelf: MetalViewController = Unmanaged<MetalViewController>.fromOpaque(displayLinkContext!).takeUnretainedValue()
            innerSelf.render()
            return kCVReturnSuccess
        }
        
        let userInfo: UnsafeMutableRawPointer = UnsafeMutableRawPointer(Unmanaged<MetalViewController>.passUnretained(self).toOpaque())
        
        CVDisplayLinkCreateWithActiveCGDisplays(&self.displayLink)
        CVDisplayLinkSetOutputCallback(self.displayLink!, callback, userInfo)
        CVDisplayLinkStart(self.displayLink!)
    }
    
    func render() {
        NSLog("rendering")
    }
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

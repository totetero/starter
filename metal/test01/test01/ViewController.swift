import Cocoa

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class ViewController: NSViewController {
    fileprivate var metalViewController: MetalViewController = MetalViewController()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.metalViewController.view.frame = CGRect.zero
        self.metalViewController.view.translatesAutoresizingMaskIntoConstraints = false
        self.view.addSubview(self.metalViewController.view)
        
        // AutoLayoutの制約
        self.view.addConstraints([
            NSLayoutConstraint(
                item: self.metalViewController.view,
                attribute: NSLayoutConstraint.Attribute.left,
                relatedBy: NSLayoutConstraint.Relation.equal,
                toItem: self.view,
                attribute: NSLayoutConstraint.Attribute.left,
                multiplier: 1,
                constant: 0
            ),
            NSLayoutConstraint(
                item: self.metalViewController.view,
                attribute: NSLayoutConstraint.Attribute.right,
                relatedBy: NSLayoutConstraint.Relation.equal,
                toItem: self.view,
                attribute: NSLayoutConstraint.Attribute.right,
                multiplier: 1,
                constant: 0
            ),
            NSLayoutConstraint(
                item: self.metalViewController.view,
                attribute: NSLayoutConstraint.Attribute.top,
                relatedBy: NSLayoutConstraint.Relation.equal,
                toItem: self.view,
                attribute: NSLayoutConstraint.Attribute.top,
                multiplier: 1,
                constant: 0
            ),
            NSLayoutConstraint(
                item: self.metalViewController.view,
                attribute: NSLayoutConstraint.Attribute.bottom,
                relatedBy: NSLayoutConstraint.Relation.equal,
                toItem: self.view,
                attribute: NSLayoutConstraint.Attribute.bottom,
                multiplier: 1,
                constant: 0
            ),
        ])
    }
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

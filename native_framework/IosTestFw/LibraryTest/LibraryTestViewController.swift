//
//  LibraryTestViewController.swift
//  LibraryTest
//
//  Created by totetero on 2019/07/10.
//  Copyright © 2019 totetero. All rights reserved.
//

import UIKit

public class LibraryTestViewController: UIViewController {
    
    @IBOutlet weak var libContainer: UIView!

    public init() {
        let bundle = Bundle(for: LibraryTestViewController.self)
        super.init(nibName: "LibraryTestViewController", bundle: bundle)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }


    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

    @IBAction func onButtonView1(_ sender: UIButton) {
        let viewController = LibraryTestPage1ViewController()
        self.displayPage(viewController)
    }

    @IBAction func onButtonView2(_ sender: UIButton) {
        let viewController = LibraryTestPage2ViewController()
        self.displayPage(viewController)
    }

    @IBAction func onButtonClose(_ sender: UIButton) {
         self.dismiss(animated: true, completion: nil)
    }

    
    func displayPage(_ viewController: UIViewController) {
        if self.children.count > 0 {
            for viewContoller in self.children {
                viewContoller.willMove(toParent: nil)
                viewContoller.view.removeFromSuperview()
                viewContoller.removeFromParent()
            }
        }
        
        self.addChild(viewController)
        viewController.view.frame = self.libContainer.bounds
        self.libContainer.addSubview(viewController.view)
        viewController.didMove(toParent: self)
    }
}

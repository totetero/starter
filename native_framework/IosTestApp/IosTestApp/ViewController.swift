//
//  ViewController.swift
//  IosTestApp
//
//  Created by totetero on 2019/07/04.
//  Copyright © 2019 totetero. All rights reserved.
//

import UIKit
import LibraryTest

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func onButtonOpen(_ sender : Any) {
        let viewController = LibraryTestViewController()
        self.present(viewController, animated: true, completion: nil)
    }

    @IBAction func onButtonClose(_ sender : Any) {
        NSLog("close")
    }

}


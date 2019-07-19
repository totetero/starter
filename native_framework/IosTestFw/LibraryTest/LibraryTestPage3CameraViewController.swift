//
//  LibraryTestPage3CameraViewController.swift
//  LibraryTest
//
//  Created by totetero on 2019/07/20.
//  Copyright © 2019 totetero. All rights reserved.
//

import UIKit

class LibraryTestPage3CameraViewController: UIViewController {

    weak var delegate: DelegateRoot?

    public init() {
        let bundle = Bundle(for: LibraryTestViewController.self)
        super.init(nibName: "LibraryTestPage3CameraViewController", bundle: bundle)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
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

}

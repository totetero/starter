//
//  LibraryTestViewController.swift
//  LibraryTest
//
//  Created by totetero on 2019/07/10.
//  Copyright © 2019 totetero. All rights reserved.
//

import UIKit

public class LibraryTestViewController: UIViewController {

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

}

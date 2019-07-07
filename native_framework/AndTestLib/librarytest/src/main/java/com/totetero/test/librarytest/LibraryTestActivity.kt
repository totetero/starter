package com.totetero.test.librarytest

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_library_test.*

class LibraryTestActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_library_test)

        libButton1.setOnClickListener {
            finish()
        }
    }
}

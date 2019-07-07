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

        libButton2.setOnClickListener {
            var transaction = supportFragmentManager.beginTransaction()
            transaction.addToBackStack(null)
            transaction.replace(R.id.libContainer, LibraryTestPage1Fragment.newInstance())
            transaction.commit();
        }

        libButton3.setOnClickListener {
            var transaction = supportFragmentManager.beginTransaction()
            transaction.addToBackStack(null)
            transaction.replace(R.id.libContainer, LibraryTestPage2Fragment.newInstance())
            transaction.commit();
        }
    }
}

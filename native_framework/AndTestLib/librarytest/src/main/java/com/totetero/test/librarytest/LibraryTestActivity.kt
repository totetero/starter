package com.totetero.test.librarytest

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v4.app.Fragment
import kotlinx.android.synthetic.main.activity_library_test.*

class LibraryTestActivity : AppCompatActivity(), ListenerRoot {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_library_test)

        libButton1.setOnClickListener {
            finish()
        }

        libButton2.setOnClickListener {
            this.displayPage1()
        }

        libButton3.setOnClickListener {
            this.displayPage2()
        }
    }
    private fun displayPage(fragment: Fragment) {
        val transaction = supportFragmentManager.beginTransaction()
        transaction.addToBackStack(null)
        transaction.replace(R.id.libContainer, fragment)
        transaction.commit()
    }

    override fun displayPage1() {
        val fragment = LibraryTestPage1Fragment.newInstance()
        fragment.setListenerRoot(this)
        this.displayPage(fragment)
    }

    override fun displayPage2() {
        val fragment = LibraryTestPage2Fragment.newInstance()
        fragment.setListenerRoot(this)
        this.displayPage(fragment)
    }
}

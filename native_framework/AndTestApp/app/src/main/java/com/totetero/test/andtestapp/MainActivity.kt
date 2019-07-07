package com.totetero.test.andtestapp

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import com.totetero.test.librarytest.LibraryTestActivity
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        testButton1.setOnClickListener {
            finish()
        }

        testButton2.setOnClickListener {
            var intent = Intent(applicationContext, LibraryTestActivity::class.java)
            startActivity(intent)
        }
    }
}

package com.totetero.test.librarytest

import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import kotlinx.android.synthetic.main.library_test_page1_fragment.*


class LibraryTestPage1Fragment : Fragment() {
    private var listener: ListenerRoot? = null

    companion object {
        fun newInstance() = LibraryTestPage1Fragment()
    }

    private lateinit var viewModel: LibraryTestPage1ViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.library_test_page1_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LibraryTestPage1ViewModel::class.java)
        // TODO: Use the ViewModel
    }

    override fun onStart() {
        super.onStart()

        flag1Button1.setOnClickListener {
            this.listener?.displayPage2()
        }
    }

    public fun setListenerRoot(listener: ListenerRoot) {
        this.listener = listener
    }
}

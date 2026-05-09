package com.totetero.test.librarytest

import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import kotlinx.android.synthetic.main.library_test_page2_fragment.*


class LibraryTestPage2Fragment : Fragment() {
    private var listener: ListenerRoot? = null

    companion object {
        fun newInstance() = LibraryTestPage2Fragment()
    }

    private lateinit var viewModel: LibraryTestPage2ViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.library_test_page2_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LibraryTestPage2ViewModel::class.java)
        // TODO: Use the ViewModel
    }

    override fun onStart() {
        super.onStart()

        flag2Button1.setOnClickListener {
            this.listener?.displayPage1()
        }
    }

    public fun setListenerRoot(listener: ListenerRoot) {
        this.listener = listener
    }
}

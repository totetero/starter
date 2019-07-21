package com.totetero.test.librarytest

import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup


class LibraryTestPage3CameraFragment : Fragment() {
    private var listener: ListenerRoot? = null

    companion object {
        fun newInstance() = LibraryTestPage3CameraFragment()
    }

    private lateinit var viewModel: LibraryTestPage3CameraViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.library_test_page3_camera_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LibraryTestPage3CameraViewModel::class.java)
        // TODO: Use the ViewModel
    }

    public fun setListenerRoot(listener: ListenerRoot) {
        this.listener = listener
    }

}

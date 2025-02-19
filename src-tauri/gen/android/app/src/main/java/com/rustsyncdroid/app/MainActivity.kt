package com.rustsyncdroid.app

import android.os.Bundle
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Allow content to extend under the system bars (if necessary)
    WindowCompat.setDecorFitsSystemWindows(window, true)

    // Set the status bar color to a normal color (replace with your color)
    window.statusBarColor = android.graphics.Color.parseColor("#000000")  // Black color example
  }
}
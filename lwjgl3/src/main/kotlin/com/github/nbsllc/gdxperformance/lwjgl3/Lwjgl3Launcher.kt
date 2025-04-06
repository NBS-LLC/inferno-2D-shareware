@file:JvmName("Lwjgl3Launcher")

package com.github.nbsllc.gdxperformance.lwjgl3

import com.badlogic.gdx.Graphics
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration
import com.github.nbsllc.gdxperformance.Main

/** Launches the desktop (LWJGL3) application. */
fun main() {
    // This handles macOS support and helps on Windows.
    if (StartupHelper.startNewJvmIfRequired()) return

    val desiredWith = 3840
    val desiredHeight = 2160
    val desiredRefreshRate = 60
    var selectedMode: Graphics.DisplayMode? = null

    for (mode in Lwjgl3ApplicationConfiguration.getDisplayModes()) {
        if (mode.width == desiredWith && mode.height == desiredHeight && mode.refreshRate == desiredRefreshRate) {
            selectedMode = mode
            break
        }
    }

    Lwjgl3Application(Main(), Lwjgl3ApplicationConfiguration().apply {
        setTitle("GDXPerformance")
        useVsync(false)
        if (selectedMode != null) {
            setFullscreenMode(selectedMode)
        } else {
            setWindowedMode(1280, 720)
        }
        setWindowIcon(*(arrayOf(128, 64, 32, 16).map { "libgdx$it.png" }.toTypedArray()))
    })
}

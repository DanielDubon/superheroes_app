package com.startrackheroes.biometric

import android.os.Build
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = BiometricAuthModule.NAME)
class BiometricAuthModule(reactContext: ReactApplicationContext)
  : NativeBiometricAuthSpec(reactContext) {

  companion object { const val NAME = "BiometricAuth" }

  override fun getName() = NAME

  override fun authenticate(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      val activity = currentActivity ?: run {
        promise.reject("NO_ACTIVITY", "No current activity")
        return@runOnUiThread
      }

      // Comprobamos disponibilidad
      val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or
                           BiometricManager.Authenticators.DEVICE_CREDENTIAL
      val can = BiometricManager.from(activity).canAuthenticate(authenticators)
      if (can != BiometricManager.BIOMETRIC_SUCCESS) {
        promise.reject("NOT_AVAILABLE", "Biometrics unavailable")
        return@runOnUiThread
      }

      // Ruta 1: si la Activity es FragmentActivity, usamos androidx BiometricPrompt (recomendado)
      if (activity is FragmentActivity) {
        val executor = ContextCompat.getMainExecutor(activity)
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
          .setTitle("Verify it’s you")
          .setSubtitle("Use fingerprint or device credentials")
          .setAllowedAuthenticators(authenticators)
          .build()

        val callback = object : BiometricPrompt.AuthenticationCallback() {
          override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            promise.resolve(true)
          }
          override fun onAuthenticationError(code: Int, err: CharSequence) {
            promise.reject("ERROR_$code", err.toString())
          }
        }

        BiometricPrompt(activity, executor, callback).authenticate(promptInfo)
        return@runOnUiThread
      }

      // Ruta 2 (fallback): si NO es FragmentActivity, usamos la API de plataforma (API 28+)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        @Suppress("DEPRECATION")
        val prompt = android.hardware.biometrics.BiometricPrompt.Builder(activity)
          .setTitle("Verify it’s you")
          .setSubtitle("Use fingerprint or device credentials")
          .setDescription("")
          .build()

        val executor = ContextCompat.getMainExecutor(activity)
        val cancel = android.os.CancellationSignal()

        @Suppress("DEPRECATION")
        prompt.authenticate(
          cancel,
          executor,
          object : android.hardware.biometrics.BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(
              result: android.hardware.biometrics.BiometricPrompt.AuthenticationResult?
            ) { promise.resolve(true) }

            override fun onAuthenticationError(code: Int, err: CharSequence?) {
              promise.reject("ERROR_$code", err?.toString() ?: "Unknown error")
            }
          }
        )
      } else {
        promise.reject(
          "NO_FRAGMENT_ACTIVITY",
          "Current Activity is not FragmentActivity and SDK < 28"
        )
      }
    }
  }
}

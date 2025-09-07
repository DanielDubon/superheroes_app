package com.startrackheroes.biometric

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class BiometricAuthPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == BiometricAuthModule.NAME) BiometricAuthModule(reactContext) else null

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        BiometricAuthModule.NAME to ReactModuleInfo(
          BiometricAuthModule.NAME,
          BiometricAuthModule::class.java.name,
          false, false, false, true
        )
      )
    }
}

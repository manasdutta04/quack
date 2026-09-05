package com.quack

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SignalGlassSyncModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "SignalGlassSync"

  @ReactMethod
  fun scheduleBackgroundSync(promise: Promise) {
    val constraints = Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()
    val work = OneTimeWorkRequestBuilder<SignalGlassSyncWorker>().setConstraints(constraints).build()
    WorkManager.getInstance(context).enqueueUniqueWork("signal-glass-sync", ExistingWorkPolicy.KEEP, work)
    promise.resolve(true)
  }
}

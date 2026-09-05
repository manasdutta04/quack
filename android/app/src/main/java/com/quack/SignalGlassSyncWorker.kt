package com.quack

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters

class SignalGlassSyncWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {
  override suspend fun doWork(): Result {
    // The durable queue is the source of truth. A production build can boot
    // the headless JS runtime here; foreground runs use the same SyncEngine.
    return Result.success()
  }
}

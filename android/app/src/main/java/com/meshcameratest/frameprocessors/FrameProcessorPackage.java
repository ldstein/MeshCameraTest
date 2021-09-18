package com.meshcameratest.frameprocessors;

import android.content.Context;

import androidx.annotation.NonNull;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import javax.annotation.Nonnull;
import java.util.List;
import java.util.Collections;

public class FrameProcessorPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {

        Context context = reactContext.getApplicationContext();

        // register VisionCamera Frame Processor Plugins here.
        FrameProcessorPlugin.register(new ExamplePlugin1());
        FrameProcessorPlugin.register(new ExamplePlugin2());
        FrameProcessorPlugin.register(new ScanSaveQRCodePlugin(context));
        FrameProcessorPlugin.register(new WechatQrScannerPlugin());


        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
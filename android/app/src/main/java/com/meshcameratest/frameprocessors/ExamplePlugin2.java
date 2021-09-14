package com.meshcameratest.frameprocessors;

import android.util.Log;

import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import org.jetbrains.annotations.NotNull;

public class ExamplePlugin2 extends FrameProcessorPlugin {
    @Override
    public Object callback(@NotNull ImageProxy image, @NotNull Object[] params) {

        WritableNativeMap map = new WritableNativeMap();
        map.putString("result", "Example2 Done");

        return map;
    }

    public ExamplePlugin2() {
        super("runExample2");
    }
}
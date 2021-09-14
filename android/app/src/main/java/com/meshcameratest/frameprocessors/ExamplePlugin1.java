package com.meshcameratest.frameprocessors;

import android.util.Log;

import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import org.jetbrains.annotations.NotNull;

public class ExamplePlugin1 extends FrameProcessorPlugin {
    @Override
    public Object callback(@NotNull ImageProxy image, @NotNull Object[] params) {

        WritableNativeMap map = new WritableNativeMap();
        map.putString("result", "Example1 Done");

        return map;
    }

    public ExamplePlugin1() {
        super("runExample1");
    }
}
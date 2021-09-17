// WechatQrScannerPlugin.java
package com.meshcameratest.frameprocessors;

import android.annotation.SuppressLint;

import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import androidx.camera.core.ImageProxy;
import android.media.Image;

import com.wechatqrscanner.wechatQR;


public class WechatQrScannerPlugin extends FrameProcessorPlugin {

    private wechatQR  wechatQRScanner;
    
    @Override
    public Object callback(ImageProxy frame, Object[] params) {
        // detect QR code 
        @SuppressLint("UnsafeOptInUsageError")
        Image mediaImage = frame.getImage();
        if (mediaImage != null) {
            String[] qrstrings = wechatQRScanner.getQRCode(mediaImage);
            WritableNativeArray array = new WritableNativeArray();
            for (String s: qrstrings) {
                WritableNativeMap map = new WritableNativeMap();
                map.putString("url", s);
                array.pushMap(map);
            }
            return array;
        }
        return null;
    }


    WechatQrScannerPlugin() {
        super("wechatQRCodes");
        this.wechatQRScanner  = new wechatQR();
    }
}

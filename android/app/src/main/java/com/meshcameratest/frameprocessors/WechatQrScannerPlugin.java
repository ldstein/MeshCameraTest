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
import com.wechatqrscanner.QrCode;


public class WechatQrScannerPlugin extends FrameProcessorPlugin {

    private wechatQR  wechatQRScanner;
    
    @Override
    public Object callback(ImageProxy frame, Object[] params) {
        // detect QR code 
        @SuppressLint("UnsafeOptInUsageError")
        Image mediaImage = frame.getImage();
        if (mediaImage != null) {
            QrCode[] qrcodes = wechatQRScanner.getQRCode(mediaImage);
            WritableNativeArray array = new WritableNativeArray();
            for (QrCode s: qrcodes) {
                WritableNativeMap map = new WritableNativeMap();
                map.putString("url", s.url);
                
                // create location{ top{x, y}, left{x,y}, bottom{x,y}, right{x,y}}
                WritableNativeMap top = new WritableNativeMap();
                top.putDouble("x", s.topx);
                top.putDouble("y", s.topy);
                
                WritableNativeMap left = new WritableNativeMap();
                left.putDouble("x", s.leftx);
                left.putDouble("y", s.lefty);
                
                WritableNativeMap bottom = new WritableNativeMap();
                bottom.putDouble("x", s.bottomx);
                bottom.putDouble("y", s.bottomy);

                WritableNativeMap right = new WritableNativeMap();
                right.putDouble("x", s.rightx);
                right.putDouble("y", s.righty);

                WritableNativeMap location = new WritableNativeMap();
                location.putMap("top", top);
                location.putMap("left", left);
                location.putMap("bottom", bottom);
                location.putMap("right", right);
                
                map.putMap("location", location);
                
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

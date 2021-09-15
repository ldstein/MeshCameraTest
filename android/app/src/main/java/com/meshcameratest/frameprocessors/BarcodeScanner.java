package com.meshcameratest.frameprocessors;

import android.annotation.SuppressLint;
import android.media.Image;

import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.barcode.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;
import java.util.List;

public class BarcodeScanner {

    private final com.google.mlkit.vision.barcode.BarcodeScanner barcodeScanner =
        BarcodeScanning.getClient(
            new BarcodeScannerOptions.Builder()
                .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                .build());

    public WritableNativeArray Scan(ImageProxy frame){

        // Note that if you know which format of barcode your app is dealing with, detection will be
        // faster than specify the supported barcode formats one by one, e.g.
        // BarcodeScannerOptions.Builder()
        //     .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
        //     .build();
        @SuppressLint("UnsafeOptInUsageError")
        Image mediaImage = frame.getImage();

        if (mediaImage != null) {

            InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
            Task<List<Barcode>> task = barcodeScanner.process(image);

            try {
                List<Barcode> barcodes = Tasks.await(task);

                WritableNativeArray array = new WritableNativeArray();
                for (Barcode barcode : barcodes) {
                    WritableNativeMap map = new WritableNativeMap();
                    int valueType = barcode.getValueType();
                    // See API reference for complete list of supported types
                    switch (valueType) {
                        case Barcode.TYPE_URL:
                            map.putString("title", barcode.getUrl().getTitle());
                            map.putString("url", barcode.getUrl().getUrl());
                            break;
                        default:
                            map.putString("data", barcode.getRawValue());
                    }
                    array.pushMap(map);
                }
                return array;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}

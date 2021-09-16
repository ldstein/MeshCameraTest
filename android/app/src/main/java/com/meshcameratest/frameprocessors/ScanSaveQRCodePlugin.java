package com.meshcameratest.frameprocessors;

import android.content.Context;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import androidx.camera.core.ImageProxy;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import java.util.UUID;

public class ScanSaveQRCodePlugin extends FrameProcessorPlugin {

    private ImageHelper imageHelper;
    private BarcodeScanner barcodeScanner;

    @Override
    public Object callback(ImageProxy frame, Object[] params) {

        String outputFilename = (params[0] != null) ? params[0].toString() : null;

        WritableNativeMap result = new WritableNativeMap();
        result.putString("uid", UUID.randomUUID().toString());

        WritableNativeMap frameInfo = new WritableNativeMap();
        result.putString("frameSize", Integer.toString(frame.getWidth()) + "x" + Integer.toString(frame.getHeight()) );
        frameInfo.putString("timestamp", String.valueOf(frame.getImageInfo().getTimestamp()));
        result.putMap("frameInfo", frameInfo);

        WritableNativeArray codes = barcodeScanner.Scan(frame);
        int codesFound = codes.size();

        if (outputFilename != null) {

            result.putString("requestedFilename", outputFilename);

            String savedFilename = imageHelper.saveToDownloads(frame, outputFilename + Integer.toString(codesFound) + "_codes");

            if (savedFilename != null)
                result.putString("capturedFile", savedFilename);
        }

        result.putArray("codes", codes);

        return result;
    }

    ScanSaveQRCodePlugin(Context context) {
        super("scanSaveQRCodes");
        this.imageHelper = new ImageHelper(context);
        this.barcodeScanner = new BarcodeScanner();
    }
}

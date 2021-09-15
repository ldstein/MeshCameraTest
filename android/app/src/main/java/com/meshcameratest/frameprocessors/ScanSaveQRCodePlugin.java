package com.meshcameratest.frameprocessors;

import android.content.Context;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import androidx.camera.core.ImageProxy;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

public class ScanSaveQRCodePlugin extends FrameProcessorPlugin {

    private ImageHelper imageHelper;
    private BarcodeScanner barcodeScanner;

    @Override
    public Object callback(ImageProxy frame, Object[] params) {

        String outputFilename = (params[0] != null) ? params[0].toString() : null;

        WritableNativeMap result = new WritableNativeMap();

        WritableNativeArray codes = barcodeScanner.Scan(frame);
        int codesFound = codes.size();

        if (outputFilename != null) {

            outputFilename += "_" + Integer.toString(codesFound) + "_codes";
            String savedFilename = imageHelper.saveToDownloads(frame, outputFilename);

            if (savedFilename != null)
                result.putString("file", savedFilename);
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

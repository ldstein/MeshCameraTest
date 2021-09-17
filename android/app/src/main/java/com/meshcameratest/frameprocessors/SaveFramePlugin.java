package com.meshcameratest.frameprocessors;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.graphics.ImageFormat;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.media.Image;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import androidx.camera.core.ImageProxy;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import org.jetbrains.annotations.NotNull;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;

import ru.gordinmitya.yuv2buf.Yuv;

public class SaveFramePlugin extends FrameProcessorPlugin {

    Context context;

    private ImageHelperSaveResult saveImageToDisk(ImageProxy mediaImage, String outputFilename){

        int width = mediaImage.getWidth();
        int height = mediaImage.getHeight();

        ImageHelperSaveResult result = new ImageHelperSaveResult();

        Yuv.Converted converted = Yuv.toBuffer(mediaImage);

        ByteBuffer byteBuf = converted.buffer;
        byte[] byteArr = new byte[byteBuf.remaining()];
        byteBuf.get(byteArr);

        YuvImage yuv = new YuvImage(byteArr, ImageFormat.NV21, width, height, null);
        ByteArrayOutputStream jpgBuffer = new ByteArrayOutputStream();
        Rect cropRect = new Rect(0, 0, width, height);
        yuv.compressToJpeg(cropRect, 90, jpgBuffer);
        byte[] jpegBytes = jpgBuffer.toByteArray();

        ContentValues values = new ContentValues();

        values.put(MediaStore.MediaColumns.DISPLAY_NAME, outputFilename);
        values.put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg");
        values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

        Uri uri = this.context.getContentResolver().insert(MediaStore.Files.getContentUri("external"), values); //important!

        try {
            OutputStream outputStream = this.context.getContentResolver().openOutputStream(uri);
            outputStream.write(jpegBytes);
            outputStream.close();
            result.savedFile = outputFilename + ".jpg";
        } catch (FileNotFoundException e) {
            result.error = "FileNoutFoundException: " + e.toString();
            e.printStackTrace();
        } catch (IOException e) {
            result.error = "IOException: " + e.toString();
            e.printStackTrace();
        }

        return result;
    }

    @Override
    public Object callback(@NotNull ImageProxy frame, @NotNull Object[] params) {
        Log.d("SaveFramePlugin", frame.getWidth() + " x " + frame.getHeight() + " Image with format #" + frame.getFormat() + ". Logging " + params.length + " parameters:");

        for (Object param : params) {
            Log.d("SaveFramePlugin", "  -> " + (param == null ? "(null)" : param.toString() + " (" + param.getClass().getName() + ")"));
        }

        if (params.length == 0)
            return null;

        if (params[0] == null)
            return null;

        @SuppressLint("UnsafeOptInUsageError")
        Image mediaImage = frame.getImage();

        if (mediaImage != null) {

            String outputFilename = params[0].toString();

            this.saveImageToDisk(frame, outputFilename);

            WritableNativeMap result = new WritableNativeMap();
            result.putString("file", outputFilename + ".jpg");
            return result;
        }

        return null;
    }

    public SaveFramePlugin(Context context) {
        super("saveFrame");
        this.context = context;
    }
}
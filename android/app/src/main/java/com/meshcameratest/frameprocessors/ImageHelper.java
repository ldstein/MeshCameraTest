package com.meshcameratest.frameprocessors;

import android.content.ContentValues;
import android.content.Context;
import android.graphics.ImageFormat;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;

import androidx.camera.core.ImageProxy;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;

import ru.gordinmitya.yuv2buf.Yuv;

public class ImageHelper {

    private Context context;

    public String saveToDownloads(ImageProxy mediaImage, String outputFilename){

        int width = mediaImage.getWidth();
        int height = mediaImage.getHeight();

        Yuv.Converted converted = Yuv.toBuffer(mediaImage);

        ByteBuffer byteBuf = converted.buffer;
        byte[] byteArr = new byte[byteBuf.remaining()];
        byteBuf.get(byteArr);

        YuvImage yuv = new YuvImage(byteArr, ImageFormat.NV21, width, height, null);
        ByteArrayOutputStream jpgBuffer = new ByteArrayOutputStream();
        Rect cropRect = new Rect(0, 0, width, height);
        yuv.compressToJpeg(cropRect, 80, jpgBuffer);
        byte[] jpegBytes = jpgBuffer.toByteArray();

        ContentValues values = new ContentValues();

        values.put(MediaStore.MediaColumns.DISPLAY_NAME, outputFilename);
        values.put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg");
        values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

        Uri uri = this.context.getContentResolver().insert(MediaStore.Files.getContentUri("external"), values); //important!

        String result = null;

        try {
            OutputStream outputStream = this.context.getContentResolver().openOutputStream(uri);
            outputStream.write(jpegBytes);
            outputStream.close();
            result = outputFilename + ".jpg";
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    public ImageHelper(Context context)
    {
        this.context = context;
    }
}

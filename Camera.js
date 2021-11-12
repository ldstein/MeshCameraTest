/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {
    useState,
    useEffect,
} from 'react';

import {
  StyleSheet,  
} from 'react-native';

import {Camera, useCameraDevices, useCameraFormat, useFrameProcessor} from 'react-native-vision-camera'

function CameraView({active, frameProcessorActive})
{
    const [hasPermission, setHasPermission] = useState(false);
    const cameraDevices = useCameraDevices();
    const cameraDevice = cameraDevices.back;
    const format = useCameraFormat(cameraDevice);

    const frameProcessor = useFrameProcessor(function(frame)
    {
        'worklet';

        console.log(Date.now() + " Processing Frame: " + frame.toString());

        // const example1Result = runExample1(frame);
        // console.log("example1Result:", example1Result);

        // // Second plugin will always crash
        // const example2Result = runExample2(frame);
        // console.log("example2Result:", example2Result);

    }, []);

    useEffect(function()
    {
        async function onMount()
        {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === 'authorized');
        }
        onMount();
    }, []);

    if (!hasPermission || !cameraDevice)
        return null;

    const extraProps = {};

    if (frameProcessorActive)
        Object.assign(extraProps, {frameProcessor});

    return (
        <Camera
            style={ StyleSheet.absoluteFill }
            device={cameraDevice}
            format={format}
            isActive={active}
            {...extraProps}
        />
    )    
}

export default CameraView

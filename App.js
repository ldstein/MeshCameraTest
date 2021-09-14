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
import Animated, {runOnJS, runOnUI} from 'react-native-reanimated';
import {runExample1, runExample2} from './frame-processors'

function timeStamp() 
{
    'worklet';

    var now = new Date();

    let year  = String(now.getFullYear() ).padStart(2, "0");
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let day   = String(now.getDate()     ).padStart(2, "0");
    let hours = String(now.getHours()    ).padStart(2, "0");
    let mins  = String(now.getMinutes()  ).padStart(2, "0");
    let secs  = String(now.getSeconds()  ).padStart(2, "0");

    return [year.slice(2), month, day].join('') + '_' + [hours, mins, secs].join('');
}

function CameraView()
{
    const [hasPermission, setHasPermission] = useState(false);
    const cameraDevices = useCameraDevices();
    const cameraDevice = cameraDevices.back;
    const format = useCameraFormat(cameraDevice);

    const frameProcessor = useFrameProcessor(function(frame)
    {
        'worklet';

        console.log("Processing Frame:", frame.toString());

        const example1Result = runExample1(frame);
        console.log("example1Result:", example1Result);

        // Second plugin will always crash
        const example2Result = runExample2(frame);
        console.log("example2Result:", example2Result);

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

    return (
        <Camera
            style={ StyleSheet.absoluteFill }
            device={cameraDevice}
            format={format}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={1}
        />
    )    
}

function App()
{
  return (
    <>
        <CameraView />
    </>
  );
};

export default App;

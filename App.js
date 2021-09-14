/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,  
} from 'react-native';

import {Camera, useCameraDevices, useCameraFormat, useFrameProcessor} from 'react-native-vision-camera'

import {runOnJS, runOnUI} from 'react-native-reanimated';

function callback(text)
{
    console.log('Running on the RN thread', text);
}

function someWorklet(greeting) {
    'worklet';
    console.log(greeting, "I'm on UI but can call methods from the RN thread");
    runOnJS(callback)('can pass arguments too');
  }
  
function onTestWorkletClick() {
    runOnUI(someWorklet)('Howdy');
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
        console.log("Processing Frame", frame.toString());
    }, []);

    useEffect(function()
    {
        async function onMount()
        {
            const permission = await Camera.requestCameraPermission();
            console.log('xxx Permission?', permission);
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

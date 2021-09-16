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
    useMemo,
    useRef,
    useCallback,
} from 'react';

import {
  StyleSheet,  
  ScrollView,
  Text,
  Button,
  View,
  ToastAndroid,
  useWindowDimensions,
} from 'react-native';

import {Camera, useCameraFormat, useFrameProcessor} from 'react-native-vision-camera'
import Animated, {runOnJS} from 'react-native-reanimated';
import {scanSaveQRCodes, runExample1} from './frame-processors'
import {Picker} from '@react-native-picker/picker';

import BarcodeOverlay from './BarcodeOverlay';

function FieldSpacer({size=5})
{
    return <View style={ {width:size, height:size} } />
}

//..............................................................................
function DropdownPicker({items=[], selectedValue, onValueChange})
{
    const handleValueChange = function(itemValue, itemIndex)
    {
        console.log('xxx Set Value', selectedValue, '->', itemValue);
        onValueChange(itemValue);
    }
    
    const rItems = items.map(function({caption, value})
    {
        return <Picker.Item key={value} color={'yellow'} label={caption} value={value} />
    });
    
    return (
        <Picker style={ {backgroundColor:'rgba(0,0,0,0.5)'} } itemStyle={{color:'white'}} dropdownIconColor={'white'}  selectedValue={selectedValue} onValueChange={handleValueChange} >
            {rItems}            
        </Picker>
    )
}
//..............................................................................



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

function OverlayButton(props)
{
    return <Button style={styles.overlayButton} {...props} />
}

function showToast(message)
{
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
}

function DevicePicker({devices})
{
    return null;
}

//..............................................................................
function useCameraDevices()
{
    const [devices, setDevices] = useState([]);

    useEffect(function()
    {        
        //......................................................................
        async function onMount()
        {
            let availableCameraDevices = await Camera.getAvailableCameraDevices();
            if (!isMounted) return;

            setDevices(availableCameraDevices);
        }
        //......................................................................
        function onUnmount()
        {
            isMounted = false;
        }
        //......................................................................
        let isMounted = true;
        onMount();
        return onUnmount;
    }, []);

    return devices;
}
//..............................................................................

//..............................................................................
function useDevicesPickerItems(devices=[])
{   
    return useMemo(function()
    {
        return devices.map(function(device, index)
        {
            const {position, isMultiCam} = device;            
            const caption = `Camera ${index}: ${position} ${isMultiCam ? '(MultiCam)' : ''}`;
            const value   = index + "";

            return {caption, value};
        });
    },[devices]);
}
//..............................................................................

//..............................................................................
function useToggle(initialState)
{
    const [val, setVal] = useState(Boolean(initialState));

    const toggleVal = useCallback(function()
    {
        setVal(!val);
    }, [val]);

    return [val, toggleVal, setVal];
}
//..............................................................................

//..............................................................................
function useFormatsPickerItems(formats=[])
{
    return useMemo(function()
    {
        return formats.map(function(format, index)
        {
            if (index == 0)
                console.log(Object.keys(format));

            const highQual = format.isHighestPhotoQualitySupported ? "(High Quality)" : "";

            const caption = `Format ${index}: ${format.videoWidth}x${format.videoHeight} ${highQual}`;
            const value   = index;

            return {caption, value};
        })
    },[formats]);
}
//..............................................................................

function CameraView()
{    
    const windowDimensions = useWindowDimensions();

    const [hasPermission  , setHasPermission  ] = useState(false);
    const [shouldSaveFrame, setShouldSaveFrame] = useState(false);
    const [qrCodes        , setQrCodes        ] = useState([]);
    const [active         , setActive         ] = useState(true);
    const [showDebug      , toggleDebug       ] = useToggle(false);

    const [enableFrameProcessor, toggleEnableFrameProcessor, setEnableFrameProcessor] = useToggle(false);
    const [frameProcessorResult   , setFrameProcessorResult   ] = useState(null);
    
    const devices = useCameraDevices();

    const devicesPickerItems                            = useDevicesPickerItems(devices);
    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
    const selectedDevice                                = devices?.[selectedDeviceIndex];

    const formats                                       = selectedDevice?.formats;
    const formatsPickerItems                            = useFormatsPickerItems(formats);
    const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);
    const selectedFormat                                = selectedDevice?.formats?.[selectedFormatIndex];   

    const [frameProcessorPerformanceSuggestion, setFrameProcessorPerformanceSuggestion] = useState(null);

    const frameProcessorFps = frameProcessorPerformanceSuggestion?.suggestedFrameProcessorFps || 1;

    const debugInfo = useMemo(function()
    {
        return JSON.stringify({frameProcessorPerformanceSuggestion, frameProcessorFps, lastFpResult: frameProcessorResult, hasPermission, selectedFormat}, null, 2);

    },[selectedFormat, frameProcessorPerformanceSuggestion, frameProcessorFps, frameProcessorResult, hasPermission]);

    const summary = useMemo(function()
    {        
        if (!qrCodes || !qrCodes.length)
            return 'No QR Codes Detected';       

        return qrCodes.map(function(code, index)
        {
            return `${index}. ${code.url || code.raw}`;
        }).join('\n');

    },[qrCodes])

    const frameProcessor = useFrameProcessor(function(frame)
    {
        'worklet';

        const timeNow = timeStamp();
        const dimensions = frame.width + "x" + frame.height;

        console.log(timeNow, "Processing Frame:", dimensions);

        const filename = shouldSaveFrame ? [timeNow, "frame", dimensions].join("_") : null;
        const result   = scanSaveQRCodes(frame, filename);

        if (shouldSaveFrame)
        {
            runOnJS(showToast)("Captured:\n" + result.savedFile);
            runOnJS(setShouldSaveFrame)(false);
        }

        if (result.saveFileError)
        {
            runOnJS(showToast)("Capture Error:\n" + result.saveFileError);
            runOnJS(setEnableFrameProcessor)(false);
        }

        runOnJS(setQrCodes)(result.codes);
        runOnJS(setFrameProcessorResult)(result);

    }, [shouldSaveFrame]);

    useEffect(function()
    {
        async function onMount()
        {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === 'authorized');
        }
        onMount();
    }, []);

    const cameraReady = hasPermission && selectedDevice;
        
    const formatWidth  = selectedFormat?.videoHeight || windowDimensions.width;
    const formatHeight = selectedFormat?.videoWidth  || windowDimensions.height;
    const previewScale  = windowDimensions.width / formatWidth;

    return (
        <>
            {
                cameraReady ?
                <Camera
                    style={ {position:'absolute'} }
                    width={formatWidth * previewScale}
                    height={formatHeight * previewScale}
                    device={selectedDevice}
                    format={selectedFormat}
                    isActive={active}
                    enableZoomGesture={true}
                    frameProcessor={enableFrameProcessor ? frameProcessor : null}
                    frameProcessorFps={frameProcessorFps}
                    onFrameProcessorPerformanceSuggestionAvailable={setFrameProcessorPerformanceSuggestion}
                />
                :
                <View style={ [StyleSheet.absoluteFill, {justifyContent:'center', alignItems:'center'}] }><Text style={ {color:'white'} }>Camera Not Ready</Text></View>
            }

            <BarcodeOverlay codes={qrCodes} scale={previewScale} />                

            <View style={styles.hud}>

                <View style={styles.hudHeader} >
                    <Text style={styles.hudHeaderText} >{summary}</Text>
                </View>

                <View style={styles.hudBody}  pointerEvents={showDebug ? "auto" : "none"}>
                    <ScrollView style={[ styles.hudBodyInner, showDebug ? null : styles.hide ] }>
                        <Text style={styles.overlayText}>{debugInfo}</Text>
                    </ScrollView>
                </View>

                {
                    cameraReady &&
                    <View style={styles.hudFooter}>
                        <DropdownPicker selectedValue={selectedDeviceIndex} items={devicesPickerItems} onValueChange={setSelectedDeviceIndex}/>
                        <FieldSpacer />
                        <DropdownPicker selectedValue={selectedFormatIndex} items={formatsPickerItems} onValueChange={setSelectedFormatIndex}/>
                        <FieldSpacer />
                        <OverlayButton title={enableFrameProcessor ? "Pause" : "Resume"} onPress={ toggleEnableFrameProcessor } />
                        <FieldSpacer />
                        <OverlayButton title={shouldSaveFrame ? "Capturing..." : "Capture Frame"} onPress={ () => setShouldSaveFrame(true) } disabled={!enableFrameProcessor} />
                    </View>

                }

                <View style={styles.topBtnSet}>
                    <Button title={'Raw'} onPress={toggleDebug} />
                </View>
                
            </View>
        </>
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

const styles = StyleSheet.create
({
    hide:
    {
        transform: [{scale: 0}]
    },
    topBtnSet:
    {
        position:'absolute',
        top:5,
        right:5,
    },      
    hud:
    {
        ...StyleSheet.absoluteFill
    },
    hudHeader:
    {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding:5,
    },
    hudHeaderText:
    {
        color:'white'
    },
    hudBody:
    {
        flex   : 1,
        padding: 10,
    },
    hudFooter:
    {
        padding:5,
    },
    buttonSet:
    {
        position: 'absolute',
        bottom  : 10,
        left    : 10,
        right   : 10,
    },
    overlayWrapper:
    {
        position: 'absolute',
        top     : 0,
        left    : 0,
        right   : 0,
        bottom  : 0,
    },
    overlayButton:
    {
        marginTop: 10,
    },
    overlayText:
    {
        color: 'yellow',
    }
})

export default App;

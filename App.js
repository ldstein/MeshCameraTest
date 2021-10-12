/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useState, useMemo} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import Camera from './Camera'
import nfc from './nfc'

function Spacer()
{
    return <View style={styles.spacer} />
}

let appState = 
{
    cameraLib:'react-native-vision-camera',
    showCamera:false,
    qr:null,
    nfc:null,
};

function toggleCamera()
{
    appState.showCamera = !appState.showCamera;
}

function clearResults()
{
    appState.qr  = null;
    appState.nfc = null;
}

function App()
{
    const [renderCount, setRenderCount] = useState(0);

    console.log('xssssssssssssssssssxx AppState', appState);

    const 
    {
        showCamera
    } = appState;

    const triggerRender = useCallback(function()
    {
        setRenderCount(prevRenderCount => prevRenderCount + 1);
    }, []);

    // const onReadCode = useCallback(function(event)
    // {
    //     console.log('xxx readCodes');
    //     appState = 
    //     {
    //         ...appState,
    //         qr: {time:Date.now(), data:event.nativeEvent.codeStringValue}
    //     };
    //     triggerRender();
    // }, []);

    const onReadNFC = useCallback(function(nfc)
    {
        appState = {...appState, time:Date.now(), nfc};
        triggerRender();
    }, []);
   
    return (
        <View style={styles.wrapper} >
            {showCamera ?  <Camera /> : null}
            <View>
                <Text style={styles.headingText}>REACT NATIVE VISION CAMERA</Text>
                <Text style={styles.overlayText}>{JSON.stringify({appState, renderCount}, null, 2)}</Text>
            </View>
            <View style={styles.nav}>
                <Button title={"ShowCamera:" + (showCamera ? "True" : "False")} onPress={() => { toggleCamera(); triggerRender(); } } />
                <Spacer />
                <Button title={"Clear Found"} onPress={() => {clearResults(); triggerRender(); } } />
                <Spacer />
                <Button title={"Start NFC"} onPress={() => {nfc.start(onReadNFC); triggerRender(); } } />
                <Spacer />
                <Button title={"Stop NFC"} onPress={() => {nfc.stop(); triggerRender(); } } />
            </View>
        </View>        
    )
}

const styles = StyleSheet.create
({
  wrapper:
  {
    backgroundColor:'#2a667c',
    padding:10,
    ...StyleSheet.absoluteFill,
  },
  headingText:
  {
    fontSize:16,
    fontWeight:'bold',
    color:'yellow',
  },
  nav:
  {
      position: 'absolute',
      bottom  : 0,
      left    : 0,
      right   : 0,
      padding : 10,
  },
  overlayText:
  {
      color:'yellow',
  },
  spacer:
  {
      width : 10,
      height: 10,
  }
});

export default App;

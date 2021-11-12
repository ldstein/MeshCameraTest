/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import Modal from 'react-native-modal';

import React, {useState} from 'react';

import 
{
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';

import Camera from './Camera'

function Spacer() 
{
    return <View style={styles.spacer} />
}

function App() {

    const [isModalVisible, setModalVisible] = useState(false);
    const [isCameraActive, setCameraActive] = useState(true);
    const [isFpActive, setFpActive] = useState(false);

    const toggleModal = function ()
    {
        setModalVisible(!isModalVisible);
    }

    const toggleCameraActive = function()
    {
        setCameraActive(!isCameraActive);
    }

    const toggleFrameProcessor = function ()
    {
        setFpActive(!isFpActive);
    }

    return (
        <View style={styles.wrapper} >
            <Button title="Show Modal" onPress={toggleModal} />

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalWrapper}>
                    <Camera active={isCameraActive} frameProcessorActive={isFpActive} />
                    <Button title="Hide modal" onPress={toggleModal} />
                    <Spacer />
                    <Button title="Toggle Camera Active" onPress={toggleCameraActive} />
                    <Spacer />
                    <Button title="Toggle Frame processor" onPress={toggleFrameProcessor} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create
({
    wrapper:
    {
        backgroundColor: '#2a667c',
        justifyContent:'center',
        alignItems:'center',
        flex: 1,
    },
    modalWrapper:
    {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
        borderRadius: 10,
    },
    spacer:
    {
        width: 10,
        height: 10,
    },
});

export default App;

import NfcManager, { NfcEvents, nfcManager } from 'react-native-nfc-manager';
import {ToastAndroid  } from 'react-native';

let initPromise = null;

// Pre-step, call this before any NFC operations
async function init() {

    if (initPromise)
        return initPromise;

    return initPromise = await NfcManager.start();
}

const toast = 
{
    show: function(msg)
    {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    }
}

//..............................................................................
function init2() 
{
    return NfcManager.start();
}
//..............................................................................

//..............................................................................
function startReadLoop(onRead)
{
    readNdef()
        .then(function(data)
        {                   
            console.log("READ NDEF", data, onRead);
            onRead && onRead(data);            
            startReadLoop(onRead);
        })
        .catch((err) => 
        {                   
            console.error(err);
            startReadLoop();
        });
}
//..............................................................................

//..............................................................................
function stopReadLoop()
{
    NfcManager.unregisterTagEvent();
}
//..............................................................................

//..............................................................................
function start(onRead, altStart=false)
{
    const initFn = altStart ? init2 : init;

    console.log('hmmm', onRead);
    
    initFn()
        .then(function()
        {
            toast.show("Start NFC OK");
            startReadLoop(onRead);
        })
        .catch(function(err)
        {
            console.error(err);
            toast.show("Start NFC ERROR");
        });
}
//..............................................................................

//..............................................................................
function stop(altStart)
{
    const initFn = altStart ? init2 : init;
    
    initFn()
        .then(function()
        {            
            stopReadLoop();
            toast.show("Stop NFC OK");
        })
        .catch(function(err)
        {
            console.error(err);
            toast.show("Stop NFC ERROR");
        });
}
//..............................................................................

//..............................................................................
function readNdef()
{
    return new Promise(function(resolve)
    {        
        function cleanup()
        {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
            NfcManager.setEventListener(NfcEvents.SessionClosed, null);
        };
        
        let tagFound = null;

        NfcManager.setEventListener(NfcEvents.DiscoverTag, function(tag)
        {
            tagFound = tag;
            resolve(tagFound);
            NfcManager.setAlertMessage('NDEF tag found');
            NfcManager.unregisterTagEvent().catch(() => 0);
        });

        NfcManager.setEventListener(NfcEvents.SessionClosed, function()
        {
            cleanup();

            if (!tagFound) 
            {
                resolve();
            }
        });

        NfcManager.registerTagEvent();
    });
}
//..............................................................................

export default {stop, start}
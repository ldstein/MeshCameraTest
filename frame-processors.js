// function scanQRCodes(frame)
// {
//     'worklet';

//     if (!_WORKLET)
//         throw new Error('saveFramePlugin must be called from a frame processor!');
    
//     return __scanQRCodes(frame, "foo");
// }

// function saveFrame(frame, filename)
// {
//     'worklet';

//     if (!_WORKLET)
//         throw new Error('saveFramePlugin must be called from a frame processor!');

//     if (!filename)
//         throw new Error("filename required");

//     if (typeof(filename) != 'string')
//         throw new Error("filename must be a string");

//     return __saveFrame(frame, filename);
// }

function scanSaveQRCodes(frame, filename)
{
    'worklet';

    if (!_WORKLET)
        throw new Error('saveFramePlugin must be called from a frame processor!');

    if (typeof(filename) !== "string")
        filename = null;

    return __scanSaveQRCodes(frame, filename);
}

function runExample1(frame)
{
    'worklet';

    return __runExample1(frame);
}

function runExample2(frame)
{
    'worklet';

    return __runExample2(frame);
}

function wechatQRCodes(frame)
{
  'worklet';
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return __wechatQRCodes(frame);
}

export {runExample1, runExample2, scanSaveQRCodes, wechatQRCodes}
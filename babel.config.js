module.exports =
{
    presets: 
    [
        'module:metro-react-native-babel-preset'
    ],
    plugins: 
    [
        [
            'react-native-reanimated/plugin',
            {
                globals: ['__runExample1', '__runExample2', '__scanSaveQRCodes', '__wechatQRCodes'],
            }
        ]
    ]
};

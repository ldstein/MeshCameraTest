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
                globals: ['__saveFrame', '__scanQRCodes', '__runExample1', '__runExample2'],
            }
        ]
    ]
};

import React from 'react'

import {Svg, Path, Circle} from 'react-native-svg'

function BarcodeOverlay(props)
{
    const 
    {
        codes = [],
        scale = 1,
    } = props;

    const rCodes = [];

    codes.forEach(function(code, codeIndex)
    {
        const {cornerPoints} = code;
        
        if (!cornerPoints)
            return;

        let path = "";

        cornerPoints.forEach(function(point, pointIndex, arr)
        {
            path += (pointIndex == 0 ? "M" : "L") + (point[0] * scale) + " " + (point[1] * scale) + (pointIndex == arr.length - 1 ? "Z" : ""); 
        });

        rCodes.push(<Path key={'code' + codeIndex} d={path} />);
    });

    return (
        <Svg
            fill="red"
            fillOpacity={0.5}
            pointerEvents={"none"}
            style={ {position:'absolute', top:0, left:0}  }
        >
            <Circle cx={5} cy={5} r={10}  />
            {rCodes}
        </Svg>
    )
}

export default BarcodeOverlay
import React from 'react'
import styled from 'styled-components'

//L'opérateur de coalescence des nuls (??), est un opérateur logique 
//qui renvoie son opérande de droite lorsque son opérande de gauche vaut null ou undefined 
//et qui renvoie son opérande de gauche sinon.

const TextStyle = ({ ...props }) => {
    return <Text {...props}>{props.children} </Text>
};

export default TextStyle;

const Text = styled.Text`
    color: ${props => props.color ?? '#222222'};
    margin: ${props => props.margin ?? 0};
    padding: ${props => props.padding ?? 0};
    font-style: ${props => props.fontStyle ?? 'normal'};

    ${({ title, large, medium, small, tiny }) => {
        switch (true) {
            case title:
                return `font-size: 32px;`;

            case large:
                return `font-size: 24px;`;

            case medium:
                return `font-size: 16px;`;

            case small:
                return `font-size: 13px;`;

            case tiny:
                return `font-size: 11px;`;

            default:
                return `font-size: 14px;`;
        }
    }}

    ${({ light, semi, bold, middleHeavy, heavy }) => {
        switch (true) {
            case light:
                return `font-weight:200;`;

            case semi:
                return `font-weight:300;`;

            case bold:
                return `font-weight:600;`;

            case heavy:
                return `font-weight:700;`;

            default:
                return `font-weight:400;`;
        }
    }}

    ${({ center, right }) => {
        switch (true) {
            case center:
                return `text-align: center;`;

            case right:
                return `text-align: right;`;

            default:
                return `text-align: left;`;
        }
    }}
`
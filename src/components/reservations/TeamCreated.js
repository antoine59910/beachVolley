import React, { useEffect, useState, useContext } from 'react'
import { Dimensions } from 'react-native';
import styled from 'styled-components'


import Text from '../Text'

const TeamCreated = ({ joueurs, terrain }) => {
    const team1 =[joueurs[0], joueurs[3]]
    const team2 =[joueurs[1], joueurs[2]]

    return (
        <>
            {
                joueurs && joueurs.length > 0 &&
                <>
                    <Text large heavy>{terrain}</Text>
                    <Terrain style={{
                        width: Dimensions.get('window').width,
                    }}>
                        {
                            team1.map(element =>
                                <ModalPlayerContainer key={element.joueurId}>
                                    <ModalProfilePhoto
                                        source={
                                            element.profilePhotoUrl === "default" || element.profilePhotoUrl === "undefined"
                                                ? require("../../../assets/defaultProfilePhoto.jpg")
                                                : { uri: element.profilePhotoUrl }
                                        }
                                        style={{
                                            width: Dimensions.get('window').width / 6,
                                            height: Dimensions.get('window').width / 6
                                        }}
                                    />
                                    <Text medium>{`${element.joueur.substr(0,9)}`}</Text>
                                </ModalPlayerContainer>
                            )
                        }
                        <ModalProfilePhoto
                            source={
                                require("../../../assets/VS.jpg")}
                            style={{
                                width: Dimensions.get('window').width / 6,
                                height: Dimensions.get('window').width / 6
                            }}
                        />
                        {
                            team2.map(element =>
                                <ModalPlayerContainer key={element.joueurId}>
                                    <ModalProfilePhoto
                                        source={
                                            element.profilePhotoUrl === "default" || element.profilePhotoUrl === "undefined"
                                                ? require("../../../assets/defaultProfilePhoto.jpg")
                                                : { uri: element.profilePhotoUrl }
                                        }
                                        style={{
                                            width: Dimensions.get('window').width / 6,
                                            height: Dimensions.get('window').width / 6
                                        }}
                                    />
                                    <Text medium>{`${element.joueur.substr(0,9)}`}</Text>
                                </ModalPlayerContainer>
                            )
                        }
                    </Terrain>
                </>
            }
        </>

    )
}

export default TeamCreated


const Terrain = styled.View`
            flex-direction: row;
            justifyContent: center;
            alignItems: center;
            `;

const ModalPlayerContainer = styled.View`
            align-items: center;
            justify-content: center;
            margin: 5px;
            `;

const ModalProfilePhoto = styled.Image`
            border-radius: 35px;
            `;
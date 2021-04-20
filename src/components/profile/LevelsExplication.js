import React from 'react'
import { ScrollView } from 'react-native'
import { Modal } from 'react-native'
import styled from 'styled-components'
import { AntDesign } from '@expo/vector-icons'

import Text from '../Text'

const LevelsExplication = ({ setShowModal, showModal }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                Alert.alert("Fenêtre fermée.");
                setShowModal(!showModal);
            }}
        >
            <CenteredView>
                <ModalView>
                    <CloseModal onPress={() => setShowModal(false)}>
                        <AntDesign name="closecircle" size={30} color="black" />
                    </CloseModal>
                    <ScrollView>
                        <Text bold large center>Débutant :</Text>
                        <Text medium>Vous souhaitez découvrir ce sport, vous n'êtes pas habitués aux sports de balle. </Text>
                        <Text>{
                        }</Text>
                        <Text bold large center>Intermédiaires :</Text>
                        <Text medium>Vous avez commencé le beachvolley depuis 1 an et avez fait de nets progrès. Si vous avez joué quelques années au Volleyball
             en loisirs et êtes sportif, vous vous adapterez facilement en quelques séances. Si vous avez pratiqué le tennis à un bon niveau, il y a de fortes chances que vous ayez des facilités en commençant le beachvolley, vous pouvez certainement intégrer un groupe de ce niveau. </Text>
                        <Text>{
                        }</Text>
                        <Text bold large center>Confirmés :</Text>
                        <Text medium>Vous pratiquez le beachvolley depuis au moins 2 ans. Vous commencez à participer aux tournois du championnat de France (Serie 3...). Si vous avez pratiqué le Volleyball a un niveau régional, vous pouvez certainement intégrer un groupe de ce niveau.  </Text>
                        <Text>{
                        }</Text>
                        <Text bold large center>Avancés :</Text>
                        <Text medium>Vous pratiquez depuis plusieurs années le beach volley et participez régulièrement aux tournois du championnat de France (Série 3...). Si vous avez joué au Volleyball à un niveau prénational-national 3, vous pouvez certainement intégrer un groupe de ce niveau. </Text>
                        <Text>{
                        }</Text>
                        <Text bold large center>Experts :</Text>
                        <Text medium>Vous pratiquez depuis plus de 5 ans le beach volley, vous faites des 1/4 de final en Série 2 ou faites des podiums en série 3. Si vous avez joué au Volleyball à un niveau national 2 ou +, vous pouvez certainement intégrer un groupe de ce niveau. </Text>
                        <Text>{
                        }</Text>
                    </ScrollView>
                </ModalView>
            </CenteredView>
        </Modal>

    )
}

export default LevelsExplication

const CenteredView = styled.View`
    flex: 1;
    justifyContent: center;
    alignItems: center;
    marginTop: 22px;
`;

const ModalView = styled.View`
    margin: 20px;
    backgroundColor: white;
    borderRadius: 20px;
    border-width: 2px;
    padding: 35px;
    shadowColor: #000;
`;

const CloseModal = styled.TouchableOpacity`
    position : absolute;
    top:10px;
    right:10px;
`;

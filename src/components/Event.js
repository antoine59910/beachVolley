import React, { useContext, useEffect, useState } from 'react'

import Text from './Text'
import { UserContext } from '../context/UserContext'
import { ROUGE, VERT, JAUNE } from '../components/Color'
import { FirebaseContext } from '../context/FireBaseContext';

const Event = ({ event }) => {
    const [user, setUser] = useContext(UserContext)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [inscriptions, setInscriptions] = useState([]);
    const firebase = useContext(FirebaseContext);

    const { titre, maxEquipes, nbEquipesInscrites, date } = event;
    const placesRestantes = maxEquipes - nbEquipesInscrites;

    useEffect(() => {
        const getInscriptionsEvent = async () => {
            setInscriptions(await firebase.getInscriptionsEvent(event.id));
        }

        getInscriptionsEvent();
    }, [])

    useEffect(() => {
        inscriptions &&
            inscriptions.map((inscription, index) => {
                if (user.uid === inscription.inscrivantId)
                    setIsSubscribed(true)
            })
    }, [inscriptions])

    return (
        <>
            <Text title center bold>{titre}</Text>
            <Text medium center>{`${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`}</Text>
            <Text medium center>Inscriptions {nbEquipesInscrites} / {maxEquipes}</Text>
            {
                placesRestantes <= 0 && <Text medium center color={ROUGE} bold>COMPLET</Text>
            }
            {
                isSubscribed && <Text medium center color={VERT} bold>INSCRIT</Text>
            }
        </>
    )
}

export default Event
import React from 'react'

import Text from './Text'

const Event = ({ event }) => {

    const { titre, maxEquipes, nbEquipesInscrites, date } = event;
    const placesRestantes = maxEquipes - nbEquipesInscrites;

    return (
        <>
            <Text large center bold>{titre}</Text>
            <Text medium center>{`${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`}</Text>
            <Text medium center>Inscriptions {nbEquipesInscrites} / {maxEquipes}</Text>
            {
                placesRestantes <= 0 && <Text medium center color={"red"}>COMPLET</Text>
            }
        </>
    )
}

export default Event
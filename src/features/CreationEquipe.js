import { removePushTokenSubscription } from "expo-notifications"
import { LEVELS, TERRAINS } from "../config/parameters"

export const creationTeamFunction = (reservations) => {

    
    const PLAYERS_BY_MATCH = 4
    const nombreJoueurEnTrop = reservations.length % PLAYERS_BY_MATCH
    let joueurs = []
    let joueursEnAttente = []

    /* 1 : Il faut classer les joueurs par niveaux, par ordre décroissant */
    for (let i = 0; i < LEVELS.length; i++) {
        reservations.map(element => {
            if (element.niveau == LEVELS[i])
                joueurs.unshift(element)
        })
    }
    //On ajoute les autres niveaux
    reservations.map(element => {
        let niveauExistant = false;
        for (let i=0; i< LEVELS.length; i++)
        {
            if (element.niveau==LEVELS[i])
                niveauExistant = true
        }
        if (niveauExistant == false)
            joueurs.unshift(element)
    })

    /* 2 : Dans les réservations, il faut supprimer au hasard le nombre de joueurs en trop */
    for (let i = 0; i < nombreJoueurEnTrop; i++) {
        const index = Math.floor(Math.random() * (reservations.length))
        joueursEnAttente.push(joueurs[index])
        joueurs.splice(index, 1)
    }


    /* 3 : Il faut répartir les joueurs sur chaque terrain */
    let numTerrain = 0
    for (let i = 0; i < joueurs.length; i++) {
        joueurs[i] = ({ ...joueurs[i], creationEquipeTerrain: TERRAINS[numTerrain] })

        if ((i + 1) % PLAYERS_BY_MATCH == 0)
            numTerrain = numTerrain + 1
    }

    /*4 : On remet dans le tableau les joueurs qui ont été supprimés*/
    for (let i=0;i<joueursEnAttente.length;i++)
    joueurs.push(joueursEnAttente[i])

    // /* 4 : Retour du tableau de joueurs */
    return (joueurs)
}
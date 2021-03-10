import React, { createContext } from "react"
import config from '../config/firebase'

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { uid } from 'uid';
import moment from 'moment';

const FirebaseContext = createContext()

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}


const db = firebase.firestore()

const Firebase = {
    //Ecrire les fonctions ici
    getCurrentUser: () => {
        return firebase.auth().currentUser
    },

    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            let profilePhotoUrl = "default";

            await db.collection('users').doc(uid).set({
                username: user.username,
                email: user.email,
                profilePhotoUrl,
                uid,
            })
            if (user.profilePhoto) {
                profilePhotoUrl = await Firebase.uploadProfiltePhoto(user.profilePhoto)
            }

            delete user.password
            return { ...user, profilePhotoUrl, uid }

        } catch (error) {
            console.log("error @createUser: ", error.message)
        }
    },

    uploadProfiltePhoto: async (uri) => {
        const uid = Firebase.getCurrentUser().uid;
        try {
            const photo = await Firebase.getBlob(uri)

            const imageRef = firebase.storage().ref("profilePhotos").child(uid)
            await imageRef.put(photo)

            const url = await imageRef.getDownloadURL()
            await db.collection("users").doc(uid).update({
                profilePhotoUrl: url,
            });

            return url;
        } catch (error) {
            console.log("Error @uploadProfilePhoto", error)
        }
    },

    getBlob: async (uri) => {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.onload = () => {
                resolve(xhr.response)
            }

            xhr.onerror = () => {
                reject(new TypeError("Network request failed."))
            }

            xhr.responseType = "blob"
            xhr.open("GET", uri, true)
            xhr.send(null)
        })
    },

    getUserInfo: async (uid) => {
        try {
            const user = await db.collection("users").doc(uid).get();

            if (user.exists) {
                return user.data();
            }

        } catch (error) {
            console.log('Error @getUserInfo : ', error)
        }
    },

    getUsers: async () => {
        let users = [];

        try {
            const snapshot = await db.collection("users").get();

            if (snapshot.empty) {
                return null;
            }

            snapshot.forEach(user => {
                users.push(user.data())
            }
            )

            return users;

        } catch (error) {
            console.log('Error @getUsers : ', error)
        }
    },

    logOut: async () => {
        try {
            await firebase.auth().signOut();

            return true;
        } catch (error) {
            console.log("Error @logOut : ", error)
        }
        return false;
    },

    signIn: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },

    setReservation: async (date, hour, field, player, userId) => {

        const data = {
            date: date,
            heure: `${hour}`,
            terrain: `${field}`,
            joueur: `${player}`,
            joueurId: `${userId}`
        }

        try {
            await db.collection(`reservations`)
                .doc(`${date} - ${hour}h00 - terrain${field} - ${player}`)
                .set(data)
        } catch (error) {
            console.log("Error @setReservation : ", error)
            return false;
        }
        return true;
    },

    getReservations: async (date) => {
        let reservations = [];

        try {
            const snapshot = await db.collection(`reservations`)
                .where('date', '==', date)
                .get();

            if (snapshot.empty) {
                return null;
            }

            snapshot.forEach(element =>
                reservations.push(element.data())
            )

            return reservations;

        } catch (error) {
            console.log("Error @getReservations : ", error)
        }

    },

    deleteReservation: async (date, hour, field, player) => {
        try {
            await db.collection(`reservations`)
                .doc(`${date} - ${hour}h00 - terrain${field} - ${player}`)
                .delete()
        } catch (error) {
            console.log("Error @deleteReservation : ", error)
            return false;
        }
        return true;
    },

    updateAuthorization: async (uid, authorization) => {
        try {
            await db.collection('users').doc(uid).update(
                {
                    authorization: authorization
                }
            )
        } catch (error) {
            console.log("Error @updateAuthorization : ", error)
            return false;
        }

        return true;
    },

    setEvent: async (titre, description, date, joueurParEquipe, maxEquipes, id) => {
        const modification = !!id;

        const eventId = id || uid()
        const eventCreation = {
            id: eventId,
            titre,
            description,
            date,
            joueurParEquipe,
            maxEquipes,
            nbEquipesInscrites: 0,
        }

        const eventModification = {
            id: eventId,
            titre,
            description,
            date,
            joueurParEquipe,
            maxEquipes,
        }

        if (modification) {
            try {
                await db.collection('evenements').doc(eventId).update(eventModification);
            } catch (error) {
                console.log("Error @setEvent : ", error)
                return false;
            }
        }
        //Création
        else {
            try {
                await db.collection('evenements').doc(eventId).set(eventCreation);
            } catch (error) {
                console.log("Error @setEvent : ", error)
                return false;
            }
        }

        return true;
    },

    getEvents: async () => {
        let events = [];
        const today = moment().format('YYYY-MM-DD')

        try {
            const snapshot = await db.collection("evenements")
                .where('date', '>=', today)
                .orderBy('date', 'desc')
                .get();

            if (snapshot.empty) {
                return null;
            }

            snapshot.forEach(event => {
                events.push(event.data())
            }
            )

            return events;

        } catch (error) {
            console.log('Error @getEvents : ', error)
        }
    },

    deleteEvent: async (id) => {

        try {
            await db.collection(`evenements`)
                .doc(id)
                .delete()
        } catch (error) {
            console.log("Error @deleteEvenement : ", error)
            return false;
        }
        return true;
    },

}

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>
}

export { FirebaseContext, FirebaseProvider }
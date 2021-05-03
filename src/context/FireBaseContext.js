import React, { createContext } from "react"
import { uid } from 'uid';
import moment from 'moment';
import config from '../config/firebase'
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'


const FirebaseContext = createContext()

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}


const db = firebase.firestore()

const Firebase = {

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
                authorization: '',
                email: user.email,
                level: user.level,
                profilePhotoUrl,
                uid,
            })
            if (user.profilePhoto) {
                profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto)
            }

            delete user.password
            return { ...user, profilePhotoUrl, uid }

        } catch (error) {
            console.log("error @createUser: ", error.message)
            alert(error.message)
        }
    },

    setEmailReset: async (emailAddress) => {
        firebase.auth().languageCode = 'fr'

        firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
            alert("un email vous a été adressé afin de réinitialiser votre mot de passe")
        }).catch(function (error) {
            alert(error)
        });
    },

    updateUser: async (user) => {

        try {
            let profilePhotoUrl = user.profilePhotoUrl

            await db.collection('users').doc(user.uid).update({
                username: user.username,
                level: user.level,
            })

            if (user.profilePhoto) {
                profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto)
            }

            return { ...user, profilePhotoUrl }

        } catch (error) {
            console.log("error @updateUser: ", error.message)
            alert(error.message)
            return false;
        }
    },

    uploadProfilePhoto: async (uri) => {
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
            const snapshot = await db.collection("users")
                .orderBy('authorization', 'asc')
                .get();

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

    setReservation: async (date, hour, field, player, userId, userProfilePhotoUrl, userLevel) => {
        /*
            On s'inscrit puis on incrémente le compteur d'inscription du jour
        */
        const reservationTime = Date()

        const data = {
            date: date,
            heure: `${hour}`,
            terrain: `${field}`,
            joueur: `${player}`,
            joueurId: `${userId}`,
            profilePhotoUrl: `${userProfilePhotoUrl}`,
            niveau: userLevel,
            dateAuMomentDeLaReservation: reservationTime,
        }

        //Inscription
        try {
            await db.collection(`reservations`)
                .doc(`${date} - ${hour}h00 - ${field} - ${player}`)
                .set(data)
        } catch (error) {
            console.log("Error @setReservation : ", error)
            return false;
        }

        //Incrément du compteur : récupération de la valeur puis update avec +1
        try {
            await db.collection(`compteur-reservations`)
                .doc(`${date}`)
                .get()
                .then(documentSnapshot => {

                    //incrément
                    if (documentSnapshot.exists) {
                        db.collection(`compteur-reservations`)
                            .doc(`${date}`)
                            .update({ nombreReservations: documentSnapshot.data().nombreReservations + 1 })
                    }
                    //Création du compteur
                    else
                        db.collection(`compteur-reservations`)
                            .doc(`${date}`)
                            .set({ nombreReservations: 1 })
                })

        } catch (error) {
            console.log("Error @setReservationcompteur : ", error)
            return false;
        }
        return true;
    },

    getReservations: async (date) => {
        let reservations = [];

        try {
            const snapshot = await db.collection(`reservations`)
                .where('date', '==', date)
                .orderBy('dateAuMomentDeLaReservation', 'asc')
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
                .doc(`${date} - ${hour}h00 - ${field} - ${player}`)
                .delete()
        } catch (error) {
            console.log("Error @deleteReservation : ", error)
            return false;
        }
        try {
            await db.collection(`compteur-reservations`)
                .doc(`${date}`)
                .get()
                .then(documentSnapshot => {
                    //décrement compteur
                    if (documentSnapshot.exists) {
                        db.collection(`compteur-reservations`)
                            .doc(`${date}`)
                            .update({ nombreReservations: documentSnapshot.data().nombreReservations - 1 })
                    }
                })

        } catch (error) {
            console.log("Error @deleteReservationcompteur : ", error)
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

    updateEvent: async (eventId, newEvent) => {
        try {
            await db.collection('evenements').doc(eventId).update(newEvent);
        } catch (error) {
            console.log('Error @incrementInscribedTeams : ', error)
        }
        return true;
    },

    getEvents: async () => {
        let events = [];
        const today = moment().format('YYYY-MM-DD')

        try {
            const snapshot = await db.collection("evenements")
                .where('date', '>=', today)
                .orderBy('date', 'asc')
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

    setInscription: async (eventId, equipe, user) => {
        const inscriptionId = uid()
        const date = Date()

        const inscription = {
            id: inscriptionId,
            equipe: equipe,
            profilePhotoUrl: user.profilePhotoUrl,
            inscrivantId: user.uid,
            inscrivant: user.username,
            inscrivantNiveau: user.level,
            date,
        }

        try {
            await db.collection('evenements').doc(eventId)
                .collection('equipes').doc(inscriptionId).set(inscription);
        } catch (error) {
            console.log("Error @setInscription : ", error)
            return false;
        }

        return true;
    },

    updateInscription: async (eventId, equipe, equipeId) => {
        const inscriptionId = inscriptionId
        const date = Date()

        const inscription = {
            equipe: equipe,
            date: date,
        }

        try {
            await db.collection('evenements').doc(eventId)
                .collection('equipes').doc(equipeId).update(inscription);
        } catch (error) {
            console.log("Error @updateInscription : ", error)
            return false;
        }

        return true;
    },

    deleteInscription: async (eventId, equipeId) => {

        try {
            await db.collection(`evenements`).doc(eventId)
                .collection('equipes').doc(equipeId)
                .delete()
        } catch (error) {
            console.log("Error @deleteEvenement : ", error)
            return false;
        }
        return true;
    },

    getInscriptionsEvent: async (eventId) => {
        let inscriptions = [];

        try {
            const snapshot = await db.collection("evenements").doc(eventId).collection("equipes")
                .orderBy("date", "desc")
                .get();

            if (snapshot.empty) {
                return null;
            }

            snapshot.forEach(inscription => {
                inscriptions.push(inscription.data())
            }
            )
            return inscriptions;

        } catch (error) {
            console.log('Error @getInscriptions : ', error)
        }
    },

    setBlocage: async (dateDeBlocage, terrain1, terrain2, terrain3) => {
        const id = uid()
        const date = Date()

        const blocage = {
            id,
            dateAuMomentDuBlocage: date,
            dateDeBlocage,
            terrain1,
            terrain2,
            terrain3
        }

        try {
            await db.collection('blocage').doc(id)
                .set(blocage);
        } catch (error) {
            console.log("Error @setBlocage : ", error)
            return false;
        }

        return true;
    },

    getBlocages: async () => {
        let blocages = [];
        const today = moment().format('YYYY-MM-DD')

        try {
            const snapshot = await db.collection("blocage")
                .where('dateDeBlocage', '>=', today)
                .orderBy('dateDeBlocage', 'asc')
                .get();

            if (snapshot.empty) {
                return null;
            }


            snapshot.forEach(event => {
                blocages.push(event.data())
            }
            )

            return blocages;

        } catch (error) {
            console.log('Error @getBlocages : ', error)
        }
    },

    getBlocage: async (date) => {
        let blocages = [];

        try {
            const snapshot = await db.collection("blocage")
                .where('dateDeBlocage', '==', date)
                .get();

            if (snapshot.empty) {
                return null;
            }

            snapshot.forEach(event => {
                blocages.push(event.data())
            }
            )

            return blocages;

        } catch (error) {
            console.log('Error @getBlocages : ', error)
        }
    },

    deleteBlocage: async (id) => {
        try {
            await db.collection(`blocage`)
                .doc(id)
                .delete()
        } catch (error) {
            console.log("Error @deleteBlocage : ", error)
            return false;
        }
        return true;
    },
}

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>
}

export { FirebaseContext, FirebaseProvider }
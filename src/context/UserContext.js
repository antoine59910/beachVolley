import React, { useState, createContext } from 'react';

const UserContext = createContext([{}, () => { }])

const UserProvider = (props) => {
    const [state, setState] = useState({
        username: "",
        email: "",
        uid: "",
        isLoggedIn: null,
        profilPhotoUrl: 'default',
        authorization: "",
        stars:0,
        champion:"",
        title:"",
    });

    return <UserContext.Provider value={[state, setState]}>{props.children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
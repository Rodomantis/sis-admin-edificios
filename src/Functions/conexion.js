import firebase from 'firebase'

var config = {
	apiKey: "AIzaSyAr4SCBnEsKPzlqSeySthXF_YQvpT3jfGo",
    authDomain: "bd-sis-admin-edificio.firebaseapp.com",
    databaseURL: "https://bd-sis-admin-edificio.firebaseio.com",
    projectId: "bd-sis-admin-edificio",
    storageBucket: "bd-sis-admin-edificio.appspot.com",
    messagingSenderId: "718911687143"
};

firebase.initializeApp(config)

export default firebase
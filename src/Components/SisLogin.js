import React, { Component } from 'react';
import _ from 'underscore'
import firebase from './../Functions/conexion';
import funciones from './../Functions/funciones-guardar';
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Grid, Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';
import Estilos from './../Styles/estilos-react';
import { browserHistory } from 'react-router';
//import MasterCont from './master.react';
import { Link } from 'react-router';

var db = firebase.database();
var qUsers = db.ref("usuarios");

class SisLogin extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			userId: '',
			userSavedData: '',
			userData: '',
		};
	}
	componentWillMount(){
        var that = this;
		var user = firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			  	console.log(user.displayName)
			  	that.setState({
					userId: user.uid || '',
					userData: user || '',
			  	})
			  	var userSavedData = firebase.database().ref('usuarios/'+user.uid)
			  	userSavedData.on('value', function(value){
				  	console.log('--->', value.val())
				  	that.setState({
						  userSavedData: value.val() || ''
				  	})
			  	})
			} else {
				that.setState({
					userSavedData: ''
				})
			}
        });
    }
    logout = () => {
		firebase.auth().signOut().then(() => {
        //Salida correcta
			this.setState({
				userSavedData:''
			}),this
		}, (error) => {
			//error
		});
    }
	loginWithGoogle =()=> {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider).then((result) => {
			var token = result.credential.accessToken;
			var user = result.user;
		}).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
			alert(errorMessage);
		});	
		//Para abrir el login en la misma pagina
		//firebase.auth().signInWithRedirect(provider);
		/*firebase.auth().getRedirectResult().then(function(result) {
			if (result.credential) {
				var token = result.credential.accessToken;
			}
			var user = result.user;
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;

			var email = error.email;
			var credential = error.credential;
		});*/
	}
	loginWithFacebook = () => {
		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			var token = result.credential.accessToken;
			var user = result.user;
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
			console.log(errorCode);
			console.log(errorMessage);
			alert(errorMessage);
		});
	}
	loginWithTwitter = () => {
		var provider = new firebase.auth.TwitterAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			var token = result.credential.accessToken;
			var secret = result.credential.secret;
			var user = result.user;
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
			console.log(errorCode);
			console.log(errorMessage);
			alert(errorMessage);
		});
	}
	render() {
    return (
		<div className="SisLogin">
		<Grid fluid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
					<div style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
						{this.state.userSavedData.nivel <=4?
						<h4>Usuario comprobado, ya puede ingresar a la pagina</h4>:
						<div>
							<h3>Ingreso al sistema</h3>
							<h4>Para ingresar al sistema puede conectarse mediante una de estas redes sociales</h4>
							<Button bsSize="large" onClick={this.loginWithGoogle} bsStyle="danger">Login con Google   <i className="fa fa-google-plus-square"/></Button>
							<Button bsSize="large" onClick={this.loginWithFacebook} bsStyle="primary">Login con Facebook   <i className="fa fa-facebook-official"/></Button>
							<Button bsSize="large" onClick={this.loginWithTwitter} bsStyle="info">Login con Twitter   <i className="fa fa-twitter"/></Button>
							<h4>Ingresar con un usuario registrado</h4>
							<Login />
							{this.state.userData == ''?
								null:
								<div>
									<h3>Su usuario ya esta registrado pero no esta habilitado</h3>
									<h4>Para solicitar la habilitacion de su correo por favor ingresar a solicitud de habilitacion</h4>
									<Link to='/solicitudes'>
										<Button bsStyle='info' bsSize="large">Solicitudes   <Glyphicon glyph='info-sign'/></Button>
									</Link>
								</div>
							}
						</div>
						}
					</div>
					</Col>
				</Row>
				{/*<Login />*/}
		</Grid>
		</div>
    );
  }
}

class Login extends SisLogin{
	constructor(){
		super()
		//call super to run parent's constructor
		this.state = {
			email:'',
			password:'',
			noUser: '',
		};
	}
	handleTextUser=(e)=>{this.setState({email: e.target.value,});}
	handleTextPass=(e)=>{this.setState({password: e.target.value,});}
	loginUser=()=>{
		var that = this
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			that.setState({
				noUser: 'Error al ingresar el usuario no esta registrado',
			})
		});
	}
	render(){
		return (
			<Row>
				<Col xs={0} md={0} sm={4} lg={4}/>
				<Col xs={12} md={12} sm={4} lg={4}>
				<div style={{'borderRadius':'8px','backgroundColor':'#5bc0de','color':'white','opacity':'0.9'}}>
						<h4>Acceso mediante usuario</h4>
						<FormControl type="email" onChange={this.handleTextUser} placeholder="Correo usuario" />
						<FormControl type="password" onChange={this.handleTextPass} placeholder="Password" />
						<Button bsStyle="primary" onClick={this.loginUser}>Ingresar  <Glyphicon glyph='user'/></Button>
				</div>
				{this.state.noUser === ''?
					null:
					<div>
						<h4>{this.state.noUser}</h4>
						<Link to='/crear-usuario'>
							<Button bsStyle='warning'>Crear Usuario</Button>
						</Link>
					</div>
				}
				</Col>
				<Col xs={0} md={0} sm={4} lg={4}/>
			</Row>
		);	
	}
}

export default SisLogin;

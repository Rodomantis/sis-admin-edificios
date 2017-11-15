import React, { Component } from 'react';
import _ from 'underscore'
import firebase from './../Functions/conexion';
import funciones from './../Functions/funciones-guardar';
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Grid, Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table } from 'react-bootstrap';
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
							<ButtonGroup vertical>
								<Button bsSize="large" onClick={this.loginWithGoogle} bsStyle="danger">Login con Google</Button>
								<Button bsSize="large" onClick={this.loginWithFacebook} bsStyle="primary">Login con Facebook</Button>
								<Button bsSize="large" onClick={this.loginWithTwitter} bsStyle="info">Login con Twitter</Button>
							</ButtonGroup>
							{this.state.userData == ''?
								null:
								<div>
									<h4>Para solicitar la habilitacion de su correo por favor ingresar a habilitaciones</h4>
									<Link to='solicitudes'>
										<Button bsStyle='info'>Solicitudes</Button>
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
			user:'',
			pass:'',
		};
	}
	handleTextUser=(e)=>{this.setState({user: e.target.value,});}
	handleTextPass=(e)=>{this.setState({pass: e.target.value,});}
	
	render(){
		return (
			<Row>
				<Col xs={0} md={0} sm={4} lg={4}/>
				<Col xs={12} md={12} sm={4} lg={4}>
				<div style={{'borderRadius':'8px','backgroundColor':'black','color':'white','opacity':'0.9'}}>
						<h4>Acceso al sistema de ventas y cotizaciones</h4>
						<FormControl type="text" onChange={this.handleTextPass} placeholder="Nombre usuario" />
						<FormControl type="password" onChange={this.handleTextUser} placeholder="Password" />
						<Button bsStyle="info">Ingresar</Button>
				</div>
				</Col>
				<Col xs={0} md={0} sm={4} lg={4}/>
			</Row>
		);	
	}
}

export default SisLogin;

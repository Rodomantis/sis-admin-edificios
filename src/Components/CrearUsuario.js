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

export default class Solicitations extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email: '',
            password: '',
            error: '', userSavedData: '',
        }
    }
    componentWillMount(){
        var that = this;
		var user = firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			  	console.log(user.displayName)
			  	that.setState({
					uid: user.uid || '',
                    displayName: user.displayName || '',
                    email: user.email || '',
                    photoURL: user.photoURL || '',
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
    sendSolicitation=()=>{
        var that = this
        var error = ''
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            error = 'Ingrese un password Valido'
            that.setState({
                error : 'Ingrese un password Valido'
            })
            // ...
        });
        if(error == ''){
            browserHistory.goBack()
        }else{
            that.setState({
                error : 'Ingrese un password Valido'
            })
        }
    }
    handleMail=(e)=>{this.setState({email: e.target.value})}
    handlePass=(e)=>{this.setState({password: e.target.value})}
    render(){
        return(
            <div className='CrearUsuario' style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                {this.state.userSavedData.nivel >= 1?
                <h4>Usuario conectado</h4>:
                <div>
                    <h3>Solicitud de creacion de usuario</h3>
                    <Row>
                        <Col xs={0} sm={0} md={4} lg={4}/>
                        <Col xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <Label>Correo de Usuario</Label>
                            <FormControl type="email" onChange={this.handleMail} value={this.state.email}/>
                            <Label>Contraseña</Label>
                            <FormControl type="password" onChange={this.handlePass} value={this.state.password}/>
                        </FormGroup>
                        </Col>
                        <Col xs={0} sm={0} md={4} lg={4}/>
                    </Row>
                    <Button onClick={this.sendSolicitation} bsStyle="success">Crear Usuario   <Glyphicon glyph='hdd'/></Button>
                    <Row>
                        {this.state.error === ''?
                            null:
                            this.state.error
                        }
                    </Row>
                </div>
                }
            </div>
        )
    }
}
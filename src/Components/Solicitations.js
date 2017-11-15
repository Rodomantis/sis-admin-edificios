import React, { Component } from 'react';
import { Navbar, NavDropdown, NavItem, Grid } from 'react-bootstrap';
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import browserHistory from 'react-router/lib/browserHistory'

var db = firebase.database();

export default class Solicitations extends React.Component{
    constructor(props){
        super(props)
        this.state={
            uid:'',
            displayName:'',
            email:'',
            userData:'', userSavedData:''
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
        var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        var solicitation = db.ref('solicitations').push()
        var info = {
            uid: that.state.uid,
            displayName: that.state.displayName,
            email : that.state.email,
            photoURL :that.state.photoURL,
            date : fecha
        }
        solicitation.set(info,error=>{
            if(error){
                console.log('Error: ', error)
            }
        })
        browserHistory.goBack()
    }
    render(){
        return(
            <div className='Solicitations'>
                <Col xs={12} sm={12} md={12} lg={12}>
					<div style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                        {this.state.userSavedData !== ''?
                            <h4>El usuario ya esta registrado</h4>:
                            <div>
                                <h3>Su usuario no esta registrado en la base de datos</h3>
                                <h4>Para registrarse debe enviar sus datos a un administrador para activar su cuenta</h4>
                                <Button bsStyle='info' onClick={this.sendSolicitation}>Enviar solicitud</Button>
                            </div>
                        }
                    </div>
                </Col>
            </div>
        )
    }
}
import React, { Component } from 'react';
import Estilos from './../Styles/estilos-react';
import Menu from './Menu'
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table } from 'react-bootstrap';

export default class AdminHome extends Component {
    constructor(props){
        super(props)
        this.state = {
            userSavedData: '',
        }
    }
    componentWillMount(){
        var that = this;
		var user = firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			  	console.log(user.displayName)
			  	that.setState({
				  	userId: user.uid || ''
			  	})
			  	var userSavedData = firebase.database().ref('usuarios/'+user.uid)
			  	userSavedData.on('value', function(value){
				  	console.log('--->', value.val())
				  	that.setState({
					    userSavedData: value.val() || '',
				  	})
			  	})
			} else {
                that.setState({
                    userSavedData: '',
                })
			}
        });
    }
    render() {
        return (
            <div className='AdminHome'>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <div style={{"opacity":"0.9", "height":"600px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                            {this.state.userSavedData.nivel >= 3?
                                this.props.children:
                                <h4>No tiene permiso para ingresar a esta funciones</h4>
                            }
                        </div>
                    </Col>
            </div>
        );
    }
}

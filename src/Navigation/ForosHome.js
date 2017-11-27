import React, { Component } from 'react';
import Estilos from './../Styles/estilos-react';
import Menu from './Menu'
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table } from 'react-bootstrap';

export default class ForosHome extends Component {
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
                {this.state.userSavedData.nivel >= 1?
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <div style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                            {this.props.children}
                        </div>
                    </Col>:
                    <h4>No tiene permiso para acceder al foro</h4>
                }
            </div>
        );
    }
}

import React from 'react';
import logo from './../Images/LogoGrande.png'
import firebase from './../Functions/conexion' 
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Image, Glyphicon } from 'react-bootstrap';
import moment from 'moment'
import _ from 'underscore'
import ReactMarkdown from 'react-markdown'
import { database } from 'firebase';

export default class Mensajes extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mensajes: '',
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
        var mensajes = firebase.database().ref('mensajes').on('value',(snapshot)=>{
            this.setState({
                mensajes: snapshot.val() || '',
            })
        })
    }
    render(){
        return(
            <div className='Mensajes' style={{"opacity":"0.9", "height":"600px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll", padding: 5}}>
            {this.state.userSavedData.nivel >= 3?
                <div>
                    <h4>Mensajes de consulta</h4>
                    <Table responsive style={{'textAlign':'left'}} >
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>ID</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                        {_.map(this.state.mensajes, (value,key)=>
                            <Mensaje mensaje={value} mensajeId={key}/>
                        )}
                        </tbody>
                    </Table>
                </div>:
                <h4>No puede acceder a la función</h4>
            }
            </div>
        )
    }
}

class Mensaje extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mensaje: '',
            mensajeId:'',
            modal: false,
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            mensaje: this.props.mensaje || '',
            mensajeId: this.props.mensajeId || '',
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                mensaje: nextProps.mensaje || '',
                mensajeId: nextProps.mensajeId || '',
            })
        }
    }
    openModal=()=>{this.setState({modal: true})}
    closeModal=()=>{this.setState({modal: false})}
    delete=()=>{
		firebase.database().ref('mensajes').child(this.props.mensajeId).on('value',(snapshot)=>{
			snapshot.ref.remove()
		});
	}
    render(){
        return(
            <tr>
                <td>{moment(this.state.mensaje.fecha).format('DD/MM/YYYY')}</td>
                <td>{this.state.mensajeId}</td>
                <td>
                    <ButtonGroup vertical>
                        <Button bsStyle='info' onClick={this.openModal} >Ver mensaje   <Glyphicon glyph='share' /></Button>
                        <Button bsStyle='danger' onClick={this.delete} >Borrar   <Glyphicon glyph='trash' /></Button>
                    </ButtonGroup>
                </td>
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Mensaje</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactMarkdown source={this.state.mensaje.mensaje}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.closeModal}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </tr>
        )
    }
}
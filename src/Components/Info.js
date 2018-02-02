import React from 'react';
import logo from './../Images/LogoGrande.png'
import firebase from './../Functions/conexion' 
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Image, Glyphicon } from 'react-bootstrap';
import moment from 'moment'
import { database } from 'firebase';

export default class Info extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            correo: '',
            modal: false,
        }
    }
    componentWillMount(){

    }
    openModal=()=>{this.setState({modal: true})}
    closeModal=()=>{this.setState({modal: false})}
    handleMensaje=(e)=>{this.setState({correo: e.target.value})}
    enviarCorreo=()=>{
        var mensaje = firebase.database().ref('mensajes').push()
        var data = {
            mensaje: this.state.correo || '',
            fecha: moment().format()
        }
        mensaje.set(data)
        this.closeModal()
        this.setState({
            correo: '',
        })
    }
    render(){
        return(
            <div className='Info' style={{"margin":"10px", "opacity":"0.9", "height":"550px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h2>Dirección</h2>
                        <Row>
                            <Col xs={0} sm={0} md={3} lg={3}/>
                            <Col xs={12} sm={12} md={6} lg={6}>
                            <Image responsive src="http://new.ucatec.edu.bo/ucatec/img/mapucatecstatic.png" rounded />
                            </Col>
                            <Col xs={0} sm={0} md={3} lg={3}/>
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h2>Contacto</h2>
                        <Image src={logo}/>
                        <h4>Correo Webmaster</h4>
                        <p>rodobenjo@gmail.com</p>
                        <h4>Telefono Celular</h4>
                        <p>71471729</p>
                        <h4>Telefono Fijo</h4>
                        <p>4713467</p>
                        <Button bsStyle='info' onClick={this.openModal} >Enviar Correo   <Glyphicon glyph='envelope' /></Button>
                    </Col>
                </Row>
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Enviar correo de consulta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Label>Mensaje:</Label>
                        <FormControl
                            type="text"
                            value={this.state.correo}
                            placeholder="Mensaje al administrador"
                            ref ="msg"
                            componentClass="textarea"
                            onChange={this.handleMensaje}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.enviarCorreo}>Enviar</Button>
                        <Button bsStyle="danger" onClick={this.closeModal}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
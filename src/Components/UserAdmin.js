import React, { Component } from 'react';
import { Navbar, NavDropdown, NavItem, Grid, Panel, FormControl, FormGroup} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image, Label } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import browserHistory from 'react-router/lib/browserHistory'

var db = firebase.database();

export default class UserAdmin extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			user:'',
			selectUs:'',
			keyUs:'',corrUs:'', nomUs:'', nivelUs:0, nomNivel: '',
		}
	}
	componentWillMount(){
		var that = this
		var usuario = db.ref('usuarios').child(this.props.params.userId)
		usuario.on('value',(snapshot) => {
			that.setState({
				user: snapshot.val() || '',
				nivelUs: snapshot.val().nivel || ''
			})
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			var usuario = db.ref('usuarios').child(nextProps.params.userId)
			usuario.on('value',(snapshot) => {
				that.setState({
					user: snapshot.val() || '',
					nivelUs: snapshot.val().nivel || ''
				})
			})
		}
	}
	subirNivel =()=>{
		this.state.nivelUs < 4?
		this.setState({nivelUs: this.state.nivelUs+1}):
		this.setState({nivelUs: this.state.nivelUs+0});
	}
	bajarNivel =()=>{
		this.state.nivelUs > 1?
		this.setState({nivelUs: this.state.nivelUs-1}):
		this.setState({nivelUs: this.state.nivelUs-0});
	}
	actualizarNivel=()=>{
		var qUsuarios = db.ref('usuarios')
		qUsuarios.child(this.props.params.userId).update({
			nivel: this.state.nivelUs,
		});
		alert('Datos guardados')
		browserHistory.goBack()
	}
	render(){
		return(
			<div className='UserAdmin'>
				<h4>Administración de cuenta de: <b>{this.state.user.displayName || "null"}</b></h4>
				<h3>Opciones</h3>
				<Row>
					<Col xs={0} sm={0} md={3} lg={3}/>
					<Col xs={12} sm={12} md={6} lg={6}>
					<FormGroup>
						<Label>Correo de Usuario</Label>
						<FormControl readOnly type="text" name="txtCorreo" value={this.state.user.email}/>
						<Label>Nombre</Label>
						<FormControl readOnly type="text" name="txtNomUs" value={this.state.user.displayName}/>
						<Label>Nivel de Usuario</Label>
						<FormControl readOnly type="text" name="txtNivelUs" value={this.state.nivelUs}/>
						<Label>Nombre de tipo de usuario:</Label>
						<FormControl readOnly type="text" value={	
							this.state.nivelUs=== 1?
								"Visitante":
							this.state.nivelUs === 2?
								"Empleado":
							this.state.nivelUs === 3?
								"Administrador":
								"Webmaster"
						}/>
						<Button onClick={this.subirNivel} bsStyle="warning">Promover</Button>
						<Button onClick={this.bajarNivel} bsStyle="warning">Rebajar</Button>
					</FormGroup>
					</Col>
					<Col xs={0} sm={0} md={3} lg={3}/>
				</Row>
				<Row>
					<Button onClick={this.actualizarNivel} bsStyle="success">Guardar Cambios</Button>
					<Button onClick={this.cerrarModalUs} bsStyle="danger">Cerrar</Button>
				</Row>
			</div>
		)
	}
}
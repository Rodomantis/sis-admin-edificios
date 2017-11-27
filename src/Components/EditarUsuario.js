import React, { Component } from 'react';
import { Navbar, NavDropdown, NavItem, Grid, Panel, FormControl, FormGroup} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image, Label, Glyphicon } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import browserHistory from 'react-router/lib/browserHistory'

var db = firebase.database();

export default class EditarUsuario extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			user:'',
			selectUs:'',
			keyUs:'',corrUs:'', nomUs:'', nivelUs:0, nomNivel: '',
			displayName: '', photoURL: '',
		}
	}
	componentWillMount(){
		var that = this
		var usuario = db.ref('usuarios').child(this.props.params.userId)
		usuario.on('value',(snapshot) => {
			that.setState({
				user: snapshot.val() || '',
				nivelUs: snapshot.val().nivel || '',
				displayName: snapshot.val().displayName || '',
				photoURL: snapshot.val().photoURL || ''
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
					nivelUs: snapshot.val().nivel || '',
					displayName: snapshot.val().displayName || '',
					photoURL: snapshot.val().photoURL || ''
				})
			})
		}
	}
	actualizarNivel=()=>{
		var qUsuarios = db.ref('usuarios')
		qUsuarios.child(this.props.params.userId).update({
			displayName: this.state.displayName || '',
			photoURL: this.state.photoURL || '',
		});
		alert('Datos guardados')
		browserHistory.goBack()
	}
	handleName=(e)=>{this.setState({displayName: e.target.value})}
	handleImage=(e)=>{this.setState({photoURL: e.target.value})}
	render(){
		return(
			<div className='UserAdmin'>
				<h3>Administración de cuenta de: <b>{this.state.user.displayName || "null"}</b></h3>
				<h4>Editar Datos</h4>
				<Row>
					<Col xs={0} sm={0} md={3} lg={3}/>
					<Col xs={12} sm={12} md={6} lg={6}>
					<FormGroup>
						<Label>Correo de Usuario</Label>
						<FormControl readOnly type="text" name="txtCorreo" value={this.state.user.email}/>
						<Label>Nombre</Label>
						<FormControl type="text" name="txtNomUs" onChange={this.handleName} value={this.state.displayName}/>
						<Label>Imagen</Label>
						<FormControl type="text" name="txtNomUs" onChange={this.handleImage} value={this.state.photoURL}/>
						<Row>
							<Image src={this.state.photoURL || "https://myspace.com/common/images/user.png"} rounded style={{'width':'100px','height':'100px', 'paddingTop':'5px'}}/>
						</Row>
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
					</FormGroup>
					</Col>
					<Col xs={0} sm={0} md={3} lg={3}/>
				</Row>
				<Row>
					<Button onClick={this.actualizarNivel} bsStyle="success">Guardar Cambios   <Glyphicon glyph='hdd'/></Button>
				</Row>
			</div>
		)
	}
}
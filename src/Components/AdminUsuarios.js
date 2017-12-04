import React from 'react';
import funciones from './../Functions/funciones-guardar';
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import Link from 'react-router/lib/Link'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table , Glyphicon} from 'react-bootstrap';

var db = firebase.database();
var qUsuarios = db.ref("usuarios");

/*nota no terminado lo mas probable es que los vecinos tambien se registren con correo*/

export default class AdminUsuarios extends React.Component{
	constructor(props){
		super(props);
		this.state={
			mostrarModalUs: false,
			correo: '',arrayUsuarios: [],
			arrayBusqueda: [],
			estadoLista:1,
			selectUs:'',
			keyUs:'',corrUs:'', nomUs:'', nivelUs:0, nomNivel: '',
			selUser:'',
		};
	}
	componentWillMount(){
		var that = this;
		qUsuarios.on("value",(snapshot) => {
			//that.setState({ arrayUsuarios: snapshot.val(),});
			console.log(snapshot.val());
			this.setState({ arrayUsuarios: snapshot.val(),});
		});
	}
	abrirModalUs=()=>{
		this.setState({mostrarModalUs: true,});
		this.sendUs();
	}
	cerrarModalUs=()=>{this.setState({mostrarModalUs: false,});}
	handleBuscarUsuario=(e)=>{
		this.setState({correo: e.target.value, 
			selectUs:''}
			,()=>{this.busquedaUsuarios();}
		);
	}
	handleListaUsuario=(e)=>{
		//this.setState({selectUs: e.target.value,});
		this.setState({selUser: _.pick(this.state.arrayUsuarios,(value,key) => 
				value.email.startsWith(this.state.correo)
			)
		})
	}
	busquedaUsuarios = () => {
		/*var arrayBusquedaUs = _.pick(this.state.arrayUsuarios,(value) => 
			value.correoUsuario.startsWith(this.state.correo)
		);
		console.log(arrayBusquedaUs);*/
		this.setState({
			arrayBusqueda :  _.pick(this.state.arrayUsuarios,(value) => 
				value.email.startsWith(this.state.correo)
			)
		});
	}
	enviarDatosUsuario = () => {
		this.state.selectUs == ''?
		alert("Seleccione un Usuario"):
		this.abrirModalUs();
	}
	sendUs =()=> {
		qUsuarios.orderByChild("correoUsuario").equalTo(this.state.selectUs).on("child_added",(snapshot) => {
			this.setState({
				corrUs: snapshot.val().correoUsuario,
				nomUs: snapshot.val().nombreUsuario,
				nivelUs: snapshot.val().nivel,
				keyUs: snapshot.key,
			});
		},this);
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
		qUsuarios.child(this.state.keyUs).update({
			nivel: this.state.nivelUs,
		});
		this.cerrarModalUs();
	}
	/*buscarCorreo=()=>
	{
		var arrayBusquedaUs = _.filter(this.state.arrayUsuarios,(value) => 
			value.correoUsuario.startsWith(this.state.correo)
		);
		this.setState({
			arrayBusquedaUs : arrayBusquedaUs,
		});
		console.log(this.state.arrayBusquedaUs);
	}*/
	render(){
		return(
			<div className="AdminUs">
				<h3>Administracion de usuarios</h3>
				<Row>
					<Col xs={12} md={4} sm={4} lg={4}>
					<h4>Buscar Usuario:</h4>
					<FormControl type="text" name="txtCorreoBuscar" onChange={this.handleBuscarUsuario} placeholder="Buscar correo de usuario" />
					<Button onClick={this.buscarCorreo} bsStyle='warning'>Buscar   <Glyphicon glyph='search'/></Button>
					</Col>
				</Row>
					<h3>Seleccionar Usuario para modificar o consultar:</h3>
					<ListaUsuarios listaUsuarios={this.state.correo===''?
						this.state.arrayUsuarios:
						this.state.arrayBusqueda
					}/>   
			</div>
		);
	}
}

class ListaUsuarios extends React.Component{
	constructor(props){
		super(props)
		this.state ={
			userList: '', userSavedData: ''
		}
	}
	componentWillMount(){
		var that = this
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
		this.setState({
			userList: this.props.listaUsuarios || '',
		})
	}
	render(){
		return(
			<Table responsive style={{'textAlign':'left'}}>
				<thead>
					<tr>
						<th>UID</th>
						<th>Nombre</th>
						<th>Correo</th>
						<th>Nivel</th>
						<th>Administrar</th>
					</tr>
				</thead>
				<tbody>
				{_.map(this.props.listaUsuarios,(value,key)=>
					<UserEdit usuario={value} usuarioId={key} permission={this.state.userSavedData.nivel}/>
				)}
				</tbody>
			</Table>
		)
	}
}

class UserEdit extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			usuario: '',
			usuarioId: '', showModalDelete: false,
		}
	}
	componentWillMount(){
		var that = this 
		that.setState({
			usuario: that.props.usuario || '',
			usuarioId: that.props.usuarioId || ''
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this 
			that.setState({
				usuario: nextProps.usuario || '',
				usuarioId: nextProps.usuarioId || ''
			})
		}
	}
	delete=()=>{
		firebase.database().ref('usuarios').child(this.props.usuarioId).on('value',(snapshot)=>{
			snapshot.ref.remove()
		});
		this.closeModalDelete()
	}
	openModalDelete=()=>{
		this.setState({
			showModalDelete: true,
		})
	}
	closeModalDelete=()=>{
		this.setState({
			showModalDelete: false,
		})
	}
	render(){
		return(
			<tr>
				<td>{this.state.usuarioId}</td>
				<td>{this.state.usuario.displayName}</td>
				<td>{this.state.usuario.email}</td>
				<td>{this.state.usuario.nivel}</td>
				<td>
					<Link to={`/administrador/admin-usuarios/${this.state.usuarioId}/usuario`}>
						<Button bsStyle='info'>Administrar <Glyphicon glyph='user'/></Button>
					</Link>
					<Link to={`/administrador/admin-usuarios/${this.state.usuarioId}/departamentos`}>
						<Button bsStyle='warning'>Control de pagos <Glyphicon glyph='zoom-in'/></Button>
					</Link>
					{this.props.permission >=3?
						<Button bsStyle='danger' onClick={this.openModalDelete}>Borrar <Glyphicon glyph='trash'/></Button>:
						null
					}
				</td>
				<Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea borrar al usuario?
					</Modal.Body>
					<Modal.Footer>
						<ButtonGroup>
							<Button bsStyle='danger' onClick={this.delete}>Borrar</Button>
							<Button bsStyle='info' onClick={this.closeModalDelete}>Cancelar</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>
			</tr>
		)
	}
}

import React from 'react';
import funciones from './../Functions/funciones-guardar';
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';

var db = firebase.database();
var qVecinos = db.ref("vecinos");
var qExpensas = db.ref("expensas");

class RegistroCobros extends React.Component{
	constructor(props){
		super(props)
		this.state={
			usuarios: '', buscarNombre: '', arrayBuscar:'',
		}
	}
	componentWillMount(){
		var that = this
		var usuarios = firebase.database().ref('usuarios')
		usuarios.on('value',(snapshot)=>{
			that.setState({
				usuarios: snapshot.val()
			})
		})
	}
	buscarPorNombre=()=>{
		this.setState({
			arrayBuscar : _.pick(this.state.usuarios,(value) => {
				var displayName = value.displayName || value.nombreUsuario || ''
				return displayName.toUpperCase().includes(this.state.buscarNombre.toUpperCase())
			}),
		});
	}
	handleBuscarVecino=(e)=>{
		this.setState({
			buscarNombre: e.target.value
		},()=>{this.buscarPorNombre();})
	}
	render(){
		var counter = 0
		return(
			<div className='RegistroCobros'>
				<h3>Modulo de generacion de recibos</h3>
				<h4>Seleccionar Vecino para generar recibo</h4>
				<ControlLabel>Buscar Vecino</ControlLabel>
				<FormControl
					type="text"
					value={this.state.buscarNombre}
					placeholder="Ingresar nombre vecino"
					onChange={this.handleBuscarVecino}
				/>
				<h4>Tabla de usuarios</h4>
				<Table responsive style={{'textAlign':'left'}}>
					<thead>
						<tr>
							<th>#</th>
							<th>Vecino</th>
							<th>Correo</th>
							<th>Accion</th>
						</tr>
					</thead>
					<tbody>
					{this.state.arrayBuscar === ''?
						_.map(this.state.usuarios,(value,key)=>{
							counter=counter+1
							return <SeleccionVecino num={counter} vecino={value} idVecino={key}/>
						}):
						_.map(this.state.arrayBuscar,(value,key)=>{
							counter=counter+1
							return <SeleccionVecino num={counter} vecino={value} idVecino={key}/>
						})
					}
					</tbody>
				</Table>
				{}
			</div>
		)
	}
}

class SeleccionVecino extends React.Component{
	constructor(props){
		super(props)
		this.state={
			vecino: '',
			idVecino: '',
		}
	}
	componentWillMount(){
		var that = this
		that.setState({
			vecino: that.props.vecino || '',
			idVecino: that.props.idVecino || '',
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			that.setState({
				vecino: nextProps.vecino || '',
				idVecino: nextProps.idVecino || '',
			})
		}
	}
	render(){
		return(
			<tr>
				<td>{this.props.num}</td>
				<td>
					{this.state.vecino.displayName || this.state.vecino.nombreUsuario}
				</td>
				<td>
					{this.state.vecino.email || this.state.vecino.correoUsuario || ''}
				</td>
				<td>
					<Link to={`/administrador/registros-cobros-expensas/${this.state.idVecino}/departamentos`}>
						<Button bsStyle={'info'}>Seleccionar Departamento  <Glyphicon glyph='list'/></Button>
					</Link>
				</td>
			</tr>
		)
	}
}

export default RegistroCobros
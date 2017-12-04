import React from 'react';
import funciones from './../Functions/funciones-guardar';
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';

var db = firebase.database();

class PagosEmpleado extends React.Component{
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
                usuarios: _.pick(snapshot.val(),(value,key)=>
                    value.nivel >= 2
                )
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
	handleBuscar=(e)=>{
		this.setState({
			buscarNombre: e.target.value
		},()=>{this.buscarPorNombre();})
	}
	render(){
		return(
			<div className='RegistroCobros'>
				<h3>Modulo de pagos de empleado</h3>
				<h4>Seleccionar empleado para generar el pago</h4>
				<ControlLabel>Buscar empleado</ControlLabel>
				<FormControl
					type="text"
					value={this.state.buscarNombre}
					placeholder="Ingresar nombre del Empleado"
					onChange={this.handleBuscar}
				/>
				<h4>Tabla de Empleados</h4>
				<Table responsive style={{'textAlign':'left'}}>
					<thead>
						<tr>
							<th>ID</th>
							<th>Empleado</th>
                            <th>Nivel</th>
							<th>Correo</th>
							<th>Accion</th>
						</tr>
					</thead>
					<tbody>
					{this.state.arrayBuscar === ''?
						_.map(this.state.usuarios,(value,key)=>
							<SeleccionUsuario usuario={value} idUsuario={key}/>
						):
						_.map(this.state.arrayBuscar,(value,key)=>
							<SeleccionUsuario usuario={value} idUsuario={key}/>
						)
					}
					</tbody>
				</Table>
			</div>
		)
	}
}

class SeleccionUsuario extends React.Component{
	constructor(props){
		super(props)
		this.state={
			usuario: '',
			idUsuario: '',
		}
	}
	componentWillMount(){
		var that = this
		that.setState({
			usuario: that.props.usuario || '',
			idUsuario: that.props.idUsuario || '',
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			that.setState({
				usuario: nextProps.usuario || '',
				idUsuario: nextProps.idUsuario || '',
			})
		}
	}
	render(){
		return(
			<tr>
				<td>{this.state.idUsuario}</td>
				<td>
					{this.state.usuario.displayName || this.state.usuario.nombreUsuario}
				</td>
                <td>
                    {this.state.usuario.nivel == 4?
                        'Administrador':
                    this.state.usuario.nivel == 3? 
                        'Encargado':
                        'Empleado'                   
                    }
				</td>
				<td>
					{this.state.usuario.email || this.state.usuario.correoUsuario || ''}
				</td>
				<td>
					<Link to={`/administrador/pagos-empleados/generar-pago/${this.state.idUsuario}/`}>
						<Button bsStyle={'info'}>Generar Pago <Glyphicon glyph='list'/></Button>
					</Link>
				</td>
			</tr>
		)
	}
}

export default PagosEmpleado
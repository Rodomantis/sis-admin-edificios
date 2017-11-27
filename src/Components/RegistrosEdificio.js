import React from 'react';
import funciones from './../Functions/funciones-guardar';
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import Firebase from 'firebase'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table , Glyphicon } from 'react-bootstrap';

var db = firebase.database();
var qExpensas = db.ref("expensas");
var qVec = db.ref("vecinos");

class RegistrosEdificio extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			mostrarModalExp:false, mostrarModalVec: false,
			CiVec:'',nombreVec:'',apellidoVec:'',telefonoVec:'',
			arrayExp: [], arrayVec:[],
			codigoExp:'', nombreExp:'', empresaExp:'',
		};
	}
	//En ES6 el willmount de cualquier cosa que no sea modificacion de state va dentro del contructor
	componentWillMount(){
		qExpensas.on("value",(snapshot) => {
			this.setState({ arrayExp: snapshot.val() });
		},this );
		qVec.on("value",(snapshot) => {
			this.setState({ arrayVec: snapshot.val() });
		},this );
	}
	registrarExpensas =()=>{
		funciones.guardarExp(
			this.state.nombreExp,
			this.state.empresaExp,
		);
		this.cerrarModalExp();
	}
	/*registrarVecinos=()=>{
		funciones.guardarVecino(
			this.state.CiVec,
			this.state.nombreVec,
			this.state.apellidoVec,
			this.state.telefonoVec
		);
		this.cerrarModalVec();
	}*/
	abrirModalExp=()=>{this.setState({ mostrarModalExp: true });}
	cerrarModalExp=()=>{this.setState({ mostrarModalExp: false });}
	abrirModalVec=()=>{this.setState({ mostrarModalVec: true });}
	cerrarModalVec=()=>{this.setState({ mostrarModalVec: false });}
	handleGuardarNombre=(e)=> { this.setState({ nombreExp: e.target.value, });}
	handleGuardarEmpresa=(e)=> { this.setState({ empresaExp: e.target.value,});}
	render() {
		return (
		<div className="RegistrosEdificio">
			<Row>
				<Button bsSize="large" bsStyle="primary" onClick={this.abrirModalExp}>
					Registrar Nuevas Expensas   <Glyphicon glyph='plus'/>
				</Button>
			</Row>
			<h3>Tabla de Expensas</h3>
			<Table responsive style={{'textAlign':'left'}}>
						<thead>
							<tr>
								<th>Codigo</th>
								<th>Nombre</th>
								<th>Empresa</th>
								<th>Registro</th>
								</tr>
						</thead>
						<tbody>
							{_.map(this.state.arrayExp,(value) => 
								<tr>
									<td>{value.codigoExpensa}</td>
									<td>{value.nombreExpensa}</td>
									<td>{value.empresaProv}</td>
									<td>{value.fechaRegistro}</td>
								</tr>
							)}
						</tbody>
					</Table>
			<Modal show={this.state.mostrarModalExp} onHide={this.cerrarModalExp}>
				<Modal.Header closeButton>
					<Modal.Title>Productos</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<div>
					<Label>Nombre Expensa: </Label>
					<FormControl type="text" onChange={this.handleGuardarNombre} value={this.state.nombreExp} placeholder="Nombre" />
					<Label>Nombre Empresa a pagar: </Label>
					<FormControl type="text" onChange={this.handleGuardarEmpresa} value={this.state.empresaExp} placeholder="Empresa" />
				</div>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="primary" onClick={this.registrarExpensas}>Registrar   <Glyphicon glyph='hdd'/></Button>
					<Button bsStyle="danger" onClick={this.cerrarModalExp}>Cerrar   <Glyphicon glyph='remove'/></Button>
				</Modal.Footer>
			</Modal>
		</div>
		);
	}		
}

export default RegistrosEdificio
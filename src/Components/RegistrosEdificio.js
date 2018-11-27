import React from 'react';
import funciones from './../Functions/funciones-guardar';
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import Firebase from 'firebase'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table , Glyphicon , InputGroup } from 'react-bootstrap';

var db = firebase.database();
var qExpensas = db.ref("expensas");
var qVec = db.ref("vecinos");

class RegistrosEdificio extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			mostrarModalExp:false, mostrarModalVec: false,
			CiVec:'',nombreVec:'',apellidoVec:'',telefonoVec:'',
			arrayExp: [], arrayVec:[], costoExp: 0,
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
		if(this.state.nombreExp !== "")
		{
			funciones.guardarExp(
				this.state.nombreExp,
				this.state.empresaExp,
				this.state.costoExp,
			);
			this.cerrarModalExp();
		}
		else{
			alert("Debe guardar al menos el nombre de la expensa")
		}
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
	handleGuardarMonto=(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({costoExp: Number(e.target.value) || 0})
        }
    }
	render() {
		var counter = 0
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
								<th>#</th>
								<th>Nombre</th>
								<th>Empresa</th>
								<th>Monto mensual</th>
								<th>Registro</th>
								<th>Funcion</th>
							</tr>
						</thead>
						<tbody>
							{_.map(this.state.arrayExp,(value,key) => {
								counter=counter+1
								return <Expensa num={counter} expensa={value} expensaId={key}/>
							})}
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
					<Label>Costo mensual de la expensa: </Label>
					<InputGroup>
						<InputGroup.Addon>Bs:</InputGroup.Addon>
						<FormControl type="text" onChange={this.handleGuardarMonto} value={this.state.costoExp} placeholder="0" />
						<InputGroup.Addon>.00</InputGroup.Addon>
					</InputGroup>
				</div>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="primary" onClick={this.registrarExpensas}>Registrar   <Glyphicon glyph='hdd'/></Button>
					{/*<Button bsStyle="danger" onClick={this.cerrarModalExp}>Cerrar   <Glyphicon glyph='remove'/></Button>*/}
				</Modal.Footer>
			</Modal>
		</div>
		);
	}		
}

class Expensa extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            expensa:'',
			expensaId:'', showModalDelete: false,
			showModalEdit: false, 
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            expensa: that.props.expensa ||'',
			expensaId: that.props.expensaId || '',
			montoExpensa: that.props.expensa.montoExpensa || 0,
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                expensa: nextProps.expensa ||'',
				expensaId: nextProps.expensaId || '',
				montoExpensa: nextProps.expensa.montoExpensa || 0,
            })
        }
    }
    delete=()=>{
		firebase.database().ref('expensas').child(this.props.expensaId).on('value',(snapshot)=>{
			snapshot.ref.remove()
		});
		this.closeModalDelete()
	}
	editExpensa=()=>{
		var that = this
		var expensa = firebase.database().ref('expensas').child(this.props.expensaId)
		expensa.update({montoExpensa: that.state.montoExpensa})
		this.closeModalEdit()
	}
	handleMonto=(e)=>{this.setState({montoExpensa: e.target.value || 0})}
	openModalDelete=()=>{this.setState({showModalDelete: true,})}
	closeModalDelete=()=>{this.setState({showModalDelete: false,})}
	openModalEdit=()=>{this.setState({showModalEdit: true})}
	closeModalEdit=()=>{this.setState({showModalEdit: false})}
    render(){
		var fecha = new Date(this.state.expensa.fechaRegistro).toJSON().slice(0,10).replace(/-/g,'/')
        return(
            <tr>
                <td>{this.props.num}</td>
				<td>{this.state.expensa.nombreExpensa || "0"}</td>
				<td>{this.state.expensa.empresaProv}</td>
				<td>{this.state.expensa.montoExpensa}</td>
				<td>{fecha}</td>
                <td><Button bsStyle='danger' onClick={this.openModalDelete}>Borrar  <Glyphicon glyph='trash'/></Button>
				<Button onClick={this.openModalEdit} bsStyle='warning'>Editar  <Glyphicon glyph='pencil'/></Button></td>
                <Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea borrar la expensa?
					</Modal.Body>
					<Modal.Footer>
						<ButtonGroup>
							<Button bsStyle='danger' onClick={this.delete}>Borrar</Button>
							<Button bsStyle='info' onClick={this.closeModalDelete}>Cancelar</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>
                <Modal show={this.state.showModalEdit} onHide={this.closeModalEdit}>
					<Modal.Header closeButton>
						<Modal.Title>Editar Monto</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Label>Costo mensual de la expensa: </Label>
						<InputGroup>
							<InputGroup.Addon>Bs:</InputGroup.Addon>
							<FormControl type="text" onChange={this.handleMonto} value={this.state.montoExpensa} placeholder="0" />
							<InputGroup.Addon>.00</InputGroup.Addon>
						</InputGroup>
					</Modal.Body>
					<Modal.Footer>
						<ButtonGroup>
							<Button bsStyle='success' onClick={this.editExpensa}>Guardar</Button>
							<Button bsStyle='info' onClick={this.closeModalEdit}>Cancelar</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>
            </tr>
        )
    }
}

export default RegistrosEdificio
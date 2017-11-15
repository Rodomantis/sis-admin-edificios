import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table } from 'react-bootstrap';

export default class RegistroDep extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            openModalDep: false, deparrayDep: [], buscarVecino:'',
            arrayVecinos: [], arrayBuscarVecino: [],
            name:'',floor:'',number:'',tel:'', selVecino:'',
        }
    }
    componentWillMount(){
        firebase.database().ref('departamentos').on('value',(snapshot)=>{
            this.setState({ departamentos: snapshot.val() || ''})
        },this)
        firebase.database().ref('usuarios').on("value",(snapshot) => {
			this.setState({ arrayVecinos: snapshot.val() || ''})
		},this )
    }
    guardarDep=()=>{
        funciones.guardarDep(
            this.state.selVecino,
            this.state.name,
            this.state.floor,
            this.state.number,
            this.state.tel,
        )
        this.cerrarModaldep()
    }
    busquedaVecino = () => {
		this.setState({
			arrayBuscarVecino : _.pick(this.state.arrayVecinos,(value) => 
				value.displayName.toUpperCase().includes(this.state.buscarVecino.toUpperCase())
			),
		});
	}
	handleBuscarVec=(e)=>{this.setState({ buscarVecino: e.target.value, },()=>{this.busquedaVecino();});}
	handleSelVecino=(e)=> {
		this.setState({ 
			selVecino: e.target.value.substr(0, e.target.value.indexOf(' '))
			},this.selectVecino);
    }
    cerrarModaldep =()=>{
        this.setState({
            openModalDep: false
        })
    }
    handleName =(e)=>{this.setState({name: e.target.value})}
    handleFloor =(e)=>{this.setState({floor: e.target.value})}
    handleNumber =(e)=>{this.setState({number: e.target.value})}
    handleTel =(e)=>{this.setState({tel: e.target.value})}
    render(){
        return(
            <div className='RegisterDep'>
                <Button bsSize='large' bsStyle='danger'
                onClick={()=>{
                    this.setState({
                        openModalDep: true
                    })
                }
                }>Registrar Departamento</Button>
                <h3>Lista de departamentos</h3>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Dueño</th>
                            <th>Edificio</th>
                            <th>Piso</th>
                            <th>Numero</th>
                            <th>Telefono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.departamentos,(value,key)=>
                            <tr>
                                <td>{key}</td>
                                <td>{value.propietario}</td>
                                <td>{value.nombreEdificio}</td>
                                <td>{value.piso}</td>
                                <td>{value.numero}</td>
                                <td>{value.tel}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Modal show={this.state.openModalDep} onHide={this.cerrarModaldep}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registro de Departamento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Label>Propietario</Label>
                        <FormControl type="text" onChange={this.handleBuscarVec} value={this.state.buscarVecino} placeholder="Apellido del vecino" />
                            <FormControl componentClass="select" onChange={this.handleSelVecino} multiple style={{"height":"100px"}}>
                                {
                                    this.state.buscarVecino === ''?
                                    _.map(this.state.arrayVecinos, (val,key) =>
                                        <option>{key} {val.displayName}</option>
                                    ):
                                    _.map(this.state.arrayBuscarVecino, (val,key) =>
                                        <option>{key} {val.displayName}</option>
                                    )
                                }
                        </FormControl>
                        <Label>Edificio</Label>
                        <FormControl type="text" onChange={this.handleName} value={this.state.name} placeholder="Nombre del edificio" />
                        <Label>Piso</Label>
                        <FormControl type="text" onChange={this.handleFloor} value={this.state.floor} placeholder="Piso" />
                        <Label>Numero</Label>
                        <FormControl type="text" onChange={this.handleNumber} value={this.state.number} placeholder="Numero" />
                        <Label>Telefono</Label>
                        <FormControl type="text" onChange={this.handleTel} value={this.state.tel} placeholder="Telefono" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.guardarDep}>Guardar Departamento</Button>
                        <Button bsStyle="danger" onClick={this.cerrarModaldep}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
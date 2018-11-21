import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon} from 'react-bootstrap';

export default class RegistroProveedor extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            openModalProv: false,
            proveedores: '',
            name:'',address:'',cel:'',tel:'', email:'',
        }
    }
    componentWillMount(){
        firebase.database().ref('proveedores').on('value',(snapshot)=>{
            this.setState({ proveedores: snapshot.val() || ''})
        },this)
    }
    guardarProv=()=>{
        if(this.state.name != ''){
            var proveedor = firebase.database().ref('proveedores').push()
            var data = {
                nombre: this.state.name,
                direccion: this.state.address || '',
                telefono: this.state.tel || '',
                celular: this.state.cel || '',
                correo: this.state.email || '',
            }
            proveedor.set(data)
        }else{
            alert('Debe ingresar al menos el Nombre del proveedor')
        }
    }
    abrirModalProv =()=>{
        this.setState({
            openModalProv: true
        })
    }
    cerrarModalProv =()=>{
        this.setState({
            openModalProv: false
        })
    }
    handleName =(e)=>{this.setState({name: e.target.value})}
    handleAddress =(e)=>{this.setState({address: e.target.value})}
    handleTel =(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({tel: e.target.value})
        }
    }
    handleCel =(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({cel: e.target.value})
        }
    }
    handleMail =(e)=>{this.setState({email: e.target.value})}
    render(){
        var counter = 0
        return(
            <div className='RegisterDep'>
                <Button bsSize='large' bsStyle='danger' onClick={this.abrirModalProv}>Registrar Proveedores</Button>
                <h3>Lista de Proveedores</h3>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Direccion</th>
                            <th>Telefono Movil</th>
                            <th>Telefono</th>
                            <th>Correo</th>
                            <th>Funcion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.proveedores,(value,key)=>{
                            counter = counter+1
                            return <Proveedor num={counter} proveedor={value} proveedorId={key}/>
                        })}
                    </tbody>
                </Table>
                <Modal show={this.state.openModalProv} onHide={this.cerrarModalProv}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registro de Departamento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Label>Nombre</Label>
                        <FormControl type="text" onChange={this.handleName} value={this.state.name} placeholder="Nombre" />
                        <Label>Direccion</Label>
                        <FormControl type="text" onChange={this.handleAddress} value={this.state.address} placeholder="Direccion" />
                        <Label>Telefono</Label>
                        <FormControl type="text" onChange={this.handleTel} value={this.state.tel} placeholder="Telefono" />
                        <Label>Telefono Movil</Label>
                        <FormControl type="text" onChange={this.handleCel} value={this.state.cel} placeholder="Celular" />
                        <Label>Correo</Label>
                        <FormControl type="email" onChange={this.handleMail} value={this.state.email} placeholder="Correo" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.guardarProv}>Guardar Proveedor</Button>
                        <Button bsStyle="danger" onClick={this.cerrarModalProv}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

class Proveedor extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            proveedor:'',
            proveedorId:'', showModalDelete: false,
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            proveedor: that.props.proveedor ||'',
            proveedorId: that.props.proveedorId || '',
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                proveedor: nextProps.proveedor ||'',
                proveedorId: nextProps.proveedorId || '',
            })
        }
    }
    delete=()=>{
		firebase.database().ref('proveedores').child(this.props.proveedorId).on('value',(snapshot)=>{
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
                <td>{this.props.num}</td>
                <td>{this.state.proveedor.nombre}</td>
                <td>{this.state.proveedor.direccion}</td>
                <td>{this.state.proveedor.telefono}</td>
                <td>{this.state.proveedor.celular}</td>
                <td>{this.state.proveedor.correo}</td>
                <td><Button bsStyle='danger' onClick={this.openModalDelete}>Borrar  <Glyphicon glyph='trash'/></Button></td>
                <Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea borrar el proveedor?
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
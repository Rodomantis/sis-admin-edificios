import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon} from 'react-bootstrap';

export default class RegistroDep extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            openModalDep: false, deparrayDep: [], buscarVecino:'',
            arrayVecinos: [], arrayBuscarVecino: [], departamentos: '',
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
    handleFloor =(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({
                floor: Number(e.target.value)
            })
        }
    }
    handleNumber =(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({number: Number(e.target.value)})
        }
    }
    handleTel =(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({tel: Number(e.target.value)})
        }
    }
    render(){
        var counter = 0
        return(
            <div className='RegisterDep'>
                <Button bsSize='large' bsStyle='danger'
                onClick={()=>{
                    this.setState({
                        openModalDep: true
                    })
                }
                }>Registrar Departamento   <Glyphicon glyph='plus'/></Button>
                <h3>Lista de departamentos</h3>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Codigo Dueño</th>
                            <th>Edificio</th>
                            <th>Piso</th>
                            <th>Numero</th>
                            <th>Telefono</th>
                            <th>Funcion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.departamentos,(value,key)=>{
                            counter = counter+1
                            return <Departamento num={counter} departamento={value} departamentoId={key}/>
                        })}
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
                                        <option>{key} | {val.displayName}</option>
                                    ):
                                    _.map(this.state.arrayBuscarVecino, (val,key) =>
                                        <option>{key} |  {val.displayName}</option>
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

class Departamento extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            departamento:'',
            departamentoId:'', showModalDelete: false,
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            departamento: that.props.departamento ||'',
            departamentoId: that.props.departamentoId || '',
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                departamento: nextProps.departamento ||'',
                departamentoId: nextProps.departamentoId || '',
            })
        }
    }
    delete=()=>{
		firebase.database().ref('departamentos').child(this.props.departamentoId).on('value',(snapshot)=>{
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
                <td>{this.state.departamento.propietario}</td>
                <td>{this.state.departamento.nombreEdificio}</td>
                <td>{this.state.departamento.piso}</td>
                <td>{this.state.departamento.numero}</td>
                <td>{this.state.departamento.tel}</td>
                <td><Button bsStyle='danger' onClick={this.openModalDelete}>Borrar  <Glyphicon glyph='trash'/></Button></td>
                <Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea borrar el departamento?
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
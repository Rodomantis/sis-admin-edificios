import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon, InputGroup} from 'react-bootstrap';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router/lib';

moment().format('YYYY/MM/DD, h:mm:ss a')

export default class RegistroGastos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            openModalGasto: false,
            gastos: '', expensas: '',
            nombre: '', fecha: '', monto: 0, idRegistro: '',
            userSavedData: '',
            startDate: moment(),
            fechaInicial: moment().format(),
            fechaLimite: moment().format(),
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
        firebase.database().ref('gastos').on('value',(snapshot)=>{
            this.setState({ gastos: snapshot.val() || ''})
        },this)
        firebase.database().ref('expensas').on("value",(snapshot) => {
			this.setState({ expensas: snapshot.val() || ''});
		},this );
    }
    render(){
        return(
            <div className='RegisterDep'>
                <Link to='/administrador/registros-gastos/registro'>
                <Button bsSize='large' bsStyle='danger'>Registrar Gastos   <Glyphicon glyph='plus'/></Button>
                </Link>
                <h3>Lista de Gastos</h3>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Expensa</th>
                            <th>Monto</th>
                            <th>Fecha Inicial</th>
                            <th>Fecha Limite</th>
                            <th>Usuario</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.gastos,(value,key)=>
                            <Gasto gasto={value} gastoId={key}/>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class Gasto extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            gasto:'',
            gastoId:'', showModalDelete: false,
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            gasto: that.props.gasto ||'',
            gastoId: that.props.gastoId || '',
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                gasto: nextProps.gasto ||'',
                gastoId: nextProps.gastoId || '',
            })
        }
    }
    delete=()=>{
		firebase.database().ref('gastos').child(this.props.gastoId).on('value',(snapshot)=>{
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
                <td>{this.state.gastoId}</td>
                <td>
                    <ul>
                        <li>{this.state.gasto.codExpensa || ''}</li>
                        <li>{this.state.gasto.nombre || ''}</li>
                        <li>{this.state.gasto.empresa || ''}</li>
                    </ul>
                </td>
                <td>{this.state.gasto.monto}</td>
                <td>{this.state.gasto.fechaInicial || this.state.gasto.fecha}</td>
                <td>{this.state.gasto.fechaLimite}</td>
                <td>{this.state.gasto.usuario}</td>
                <td><Button bsStyle='danger' onClick={this.openModalDelete}>Borrar  <Glyphicon glyph='trash'/></Button></td>
                <Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea borrar el gasto?
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
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
        firebase.database().ref('gastos').orderByChild('fechaLimite').on('value',(snapshot)=>{
            this.setState({ gastos: snapshot.val() || ''})
        },this)
        firebase.database().ref('expensas').on("value",(snapshot) => {
			this.setState({ expensas: snapshot.val() || ''});
		},this );
    }
    render(){
        var counter = 0
        return(
            <div className='RegisterDep'>
                <Link to='/administrador/registros-gastos/registro'>
                <Button bsSize='large' bsStyle='danger'>Registrar Gastos   <Glyphicon glyph='plus'/></Button>
                </Link>
                <h3>Lista de Gastos</h3>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Mes a pagar</th>
                            <th>Año</th>
                            <th>Monto Total</th>
                            <th>Monto por Usuario</th>
                            <th>Fecha Limite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.gastos,(value,key)=>{
                            counter=counter+1
                            return <Gasto num={counter} gasto={value} gastoId={key}/>
                        })}
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
        var fecha = new Date(this.state.gasto.fechaLimite).toJSON().slice(0,10).replace(/-/g,'/')
        return(
            <tr>
                <td>{this.props.num}</td>
                <td>
                    {this.state.gasto.mesPago}
                </td>
                <td>
                    {this.state.gasto.yearPago}
                </td>
                <td>{this.state.gasto.montoExpensas}</td>
                <td>{this.state.gasto.montoProp}</td>
                <td>
                {(new Date().getTime()) > (new Date(this.state.gasto.fechaLimite).getTime())?
                    <b style={{'color':'red'}}>{fecha}</b>:
                    fecha
                }</td>
                <td>
                    <Button bsStyle='danger' onClick={this.openModalDelete}>Borrar  <Glyphicon glyph='trash'/></Button>
                    <Link to={`/administrador/registros-gastos/${this.state.gastoId}/deudores`}>
                        <Button bsStyle='info'>Ver deudores  <Glyphicon glyph='exclamation-sign'/></Button>
                    </Link>
                </td>
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
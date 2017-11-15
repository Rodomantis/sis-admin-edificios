import React from 'react';
import funciones from './../Functions/funciones-guardar';
import browserHistory from 'react-router/lib/browserHistory'
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table } from 'react-bootstrap';

var db = firebase.database();
var qVecinos = db.ref("vecinos");
var qExpensas = db.ref("expensas");

class GenerarRecibo extends React.Component{
	constructor(props){
		super(props)
		this.state={
			expensas: '',
			selExpensa : '', valIdExp: '',
			pagarTabla:'', tabExpInicial: [],
			totalFactura:0, usuario:'', modalSave: false
		}
	}
	componentWillMount(){
		var that = this
		qExpensas.on('value',(snapshot)=>{
			that.setState({
				expensas: snapshot.val()
			})
        })
        firebase.database().ref('usuarios').child(this.props.params.userId).on('value',(snapshot)=>{
            that.setState({
				usuario: snapshot.val() || ''
			})
        })
	}
	handleListaExpensas=(e)=>{
		this.setState({
			valIdExp: e.target.value.substr(0, e.target.value.indexOf(' '))
		});
	}
	addExpensa=()=> {
		if(this.state.valIdExp !== '')
		{
			var that = this
			var exp = _.pick(this.state.expensas,(val,key) => 
				val.codigoExpensa == this.state.valIdExp
			);
			var data = ''
			_.map(exp,(value,key)=>{
				data = { codExpensa: key || '', nombreExpensa: value.nombreExpensa || '', costo: 0, }
				console.log(data)
			})
			var tabExpInicial = that.state.tabExpInicial
			tabExpInicial.push(data)
			this.setState({ tabExpInicial: tabExpInicial });
		}
	}
	sumarFactura=()=>{
		var factura = 0
		_.map(this.state.tabExpInicial,value=>{
			factura = factura + value.costo
		})
		this.setState({totalFactura: factura || 0})
	}
	deleteElement=(index)=>{
		var array = this.state.tabExpInicial;
		array.splice(index, 1);
		this.setState({tabExpInicial: array });
		this.sumarFactura()
	} 
	editarCosto=(index,value,cost)=>{
		var tabExpInicial= this.state.tabExpInicial
		tabExpInicial[index] = {
			codExpensa: value.codExpensa ,
			nombreExpensa: value.nombreExpensa ,
			costo: Number(cost) || 0,
		}
		this.setState({tabExpInicial: tabExpInicial });
		this.sumarFactura()
    }
    guardarRecibo=()=> {
		if(this.state.totalFactura > 0){
			funciones.guardarRecibo(
				this.props.params.userId || '',
				this.state.tabExpInicial || '',
				this.state.totalFactura
			);
			browserHistory.goBack()
		}
		else{
			alert('La factura no tiene valor')
		}
	}
	openModalSave=()=>{this.setState({modalSave:true})}
	closeModalSave=()=>{this.setState({modalSave:false})}
	render(){
		return(
			<div className='GenerarRecibo'>
				<h3>Generar factura</h3>
                <h4>Usuario: {this.state.usuario.displayName || this.state.vecino.nombreUsuario}</h4>
				<Row>
					<Col xs={12} sm={12} md={4} lg={4}>
						<h4>Lista de Expensas</h4>
						<FormControl componentClass="select" multiple onClick={this.handleListaExpensas} style={{'height':'250px', 'borderRadius': '10'}}>
							{_.map(this.state.expensas,(value) => 
								<option>{value.codigoExpensa}  {value.nombreExpensa} {value.empresaProv}</option>
							)}	
						</FormControl>
						<Button bsStyle="primary" onClick={this.addExpensa}>Añadir expensa</Button>
					</Col>
					<Col xs={12} sm={12} md={8} lg={8}>
						<h4>Lista de expensas a pagar</h4>
						<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "250px"}}>
							<Table responsive style={{'textAlign':'left'}}>
								<thead>
									<tr>
										<th>Borrar</th>
										<th>Codigo</th>
										<th>Nombre</th>
										<th>Monto</th>
									</tr>
								</thead>
								<tbody>
									{_.map(this.state.tabExpInicial,(value,key,index)=>
										<ExpensaEditar expensa={value} index={key}
										deleteElement={this.deleteElement} editarCosto={this.editarCosto}
										/>
									)}
								</tbody>
							</Table>
						</div>
						<div>
							<h4>Total Factura:</h4><FormControl type="text"  value={this.state.totalFactura}/>
						</div>
					</Col>
				</Row>
				<Row>
					<div style= {{'paddingTop':'10px'}}>
						<Button bsStyle='info' onClick={this.openModalSave}>Generar factura</Button>
					</div>
				</Row>
				<Modal show={this.state.modalSave} onHide={this.closeModalSave}>
					<Modal.Header closeButton>
						<Modal.Title>Generacion de recibo</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea realizar el registro del pago?
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="primary" onClick={this.guardarRecibo}>Guardar</Button>
						<Button bsStyle="success">Guardar e Imprimir</Button>
						<Button onClick={this.closeModalSave}>Cerrar</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

class ExpensaEditar extends React.Component{
	constructor(props){
		super(props)
		this.state={
			expensa: '',
			index: '', costo:''
		}
	}
	componentWillMount(){
		var that = this
		that.setState({
			expensa: this.props.expensa || '',
			index: this.props.index ,
			costo: this.props.expensa.costo,
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			that.setState({
				expensa: nextProps.expensa || '',
				index: nextProps.index,
				costo: nextProps.expensa.costo,
			})
		}
	}
	borrarFila=()=>{
		this.props.deleteElement(this.state.index)
	}
	handleCosto=(e)=>{
		this.setState({costo: e.target.value})
		this.props.editarCosto(this.state.index,this.state.expensa,e.target.value)
	}
	render(){
		return(
			<tr>
				<td><Button bsStyle={'danger'} onClick={this.borrarFila}>-</Button></td>
				<td>{this.state.expensa.nombreExpensa}</td>
				<td>{this.state.expensa.codExpensa}</td>
				<td>
					<FormControl type="text" style={{"width":"100px"}} 
					value={this.state.costo} onChange={this.handleCosto}/>
				</td>
			</tr>
		)
	}
}

export default GenerarRecibo
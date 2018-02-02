import React from 'react';
import funciones from './../Functions/funciones-guardar';
import browserHistory from 'react-router/lib/browserHistory'
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';
import moment from 'moment'
import DatePicker from 'react-datepicker'


var db = firebase.database();
var qVecinos = db.ref("vecinos");
moment().format('YYYY/MM/DD, h:mm:ss a')

export default class PagoMultas extends React.Component{
	constructor(props){
		super(props)
		this.state={
			multas: '',
			selExpensa : '', valIdExp: '',
			pagarTabla:'', tabExpInicial: [],
			totalFactura:0, usuario:'', modalSave: false, 
			departamento: '', departamentoId: '', fecha: moment().format(),
			date: moment(), userSavedData: ''
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
		var multas = firebase.database().ref('pagosMultas').orderByChild('idDep').equalTo(this.props.params.idDepartamento)
		multas.on('value',(pagoSnapshot)=>{
			var multasPagadas = []
			_.map(pagoSnapshot.val(),(value)=>{
				multasPagadas = multasPagadas.concat(value.idPagoMulta)
			})
            //console.log(pagosRealizados)
            var qMultas = db.ref("multas").orderByChild('idDep').equalTo(this.props.params.idDepartamento)
			qMultas.on('value',(snapshot)=>{
				that.setState({
					multas: _.pick(snapshot.val(),(value,key)=>
						!(_.contains(multasPagadas,key))
					)
				})
			})
		})
        firebase.database().ref('usuarios').child(this.props.params.userId).on('value',(snapshot)=>{
            that.setState({
				usuario: snapshot.val() || ''
			})
		})
		firebase.database().ref('departamentos').child(this.props.params.idDepartamento).on('value',(snapshot)=>{
			that.setState({
				departamento: snapshot.val() || '',
				departamentoId: snapshot.key ||  '',
			})
		})
	}
    /*handleListaExpensas=(e)=>{
		this.setState({
			valIdExp: e.target.value.substr(0, e.target.value.indexOf(' '))
		});
	}*/
	addMulta=(valIdMulta)=> {
			var that = this
			var exp = _.pick(this.state.multas,(val,key) => 
				key == valIdMulta
			);
			var data = ''
			_.map(exp,(value,key)=>{
				data = { 
					idPagoMulta: valIdMulta,
					fechaMulta: value.fechaMulta,
					fechaPago: moment().format(),
					monto: Number(value.monto) || 0,
					motivo: value.motivo,
				}
				console.log(data)
			})
			var tabExpInicial = that.state.tabExpInicial
			tabExpInicial.push(data)
			this.setState({ tabExpInicial: tabExpInicial });
			this.sumarFactura()
	}
	sumarFactura=()=>{
		var factura = 0
		_.map(this.state.tabExpInicial,value=>{
			factura = factura + value.monto
		})
		this.setState({totalFactura: factura || 0})
	}
	deleteElement=(index)=>{
		var array = this.state.tabExpInicial;
		array.splice(index, 1);
		this.setState({tabExpInicial: array });
		this.sumarFactura()
	} 
	/*editarCosto=(index,value,cost)=>{
		var tabExpInicial= this.state.tabExpInicial
		tabExpInicial[index] = {
			codGastoEd: value.codGastoEd || '',
			codExpensa: value.codExpensa || '', 
			empresa: value.empresa || '',
			nombre: value.nombre || '' ,
			fechaInicial: value.fechaInicial || '',
			fechaLimite: value.fechaLimite || '',
			costo: Number(cost) || 0,
		}
		this.setState({tabExpInicial: tabExpInicial });
		this.sumarFactura()
    }*/
    guardarRecibo=()=> {
		if(this.state.totalFactura > 0){
			_.map(this.state.tabExpInicial, (value, key)=>{
				var qPagos = db.ref('pagosMultas')
				var pagoRef = qPagos.push()
				var datosPago = {
                    idPagoMulta: value.idPagoMulta,
					fechaPago: moment().format(),
					motivo: value.motivo,
					fechaMulta: value.fechaMulta,
					monto: Number(value.monto) || 0,
					idVecino: this.props.params.userId,
					idDep: this.props.params.idDepartamento,
				}
				pagoRef.set(datosPago)
			})
			browserHistory.goBack()
		}
		else{
			alert('La factura no tiene valor')
		}
	}
	openModalSave=()=>{this.setState({modalSave:true})}
	closeModalSave=()=>{this.setState({modalSave:false})}
	render(){
		var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/')
		return(
			<div className='GenerarRecibo'>
				<h3>Pagar multas de: {this.state.usuario.displayName || this.state.usuario.nombreUsuario}</h3>
				<h4>Edificio: <b>{this.state.departamento.nombreEdificio}</b> | Piso: <b>{this.state.departamento.piso}</b> | Numero: <b>{this.state.departamento.numero}</b></h4>
				<h3>Fecha:</h3>
				<h4>{fecha}</h4>
				<Row>
					<Col xs={12} sm={12} md={6} lg={6}>
						<h4>Lista de multas a pagar disponibles</h4>
						<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "250px"}}>
							<Table responsive style={{'textAlign':'left'}}>
								<thead>
									<tr>
										<th>Añadir</th>
										<th>Fecha multa</th>
										<th>Motivo</th>
										<th>Monto</th>
									</tr>
								</thead>
								<tbody>
									{_.map(this.state.multas,(value,key)=>
										<MultaAdd multa={value} multaId={key} addMulta={this.addMulta} tabExp={this.state.tabExpInicial}/>
									)}
								</tbody>
							</Table>
						</div>
					</Col>
					<Col xs={12} sm={12} md={6} lg={6}>
						<h4>Lista de multas para pagar</h4>
						<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "250px"}}>
							<Table responsive style={{'textAlign':'left'}}>
								<thead>
									<tr>
										<th>Borrar</th>
										<th>Fecha Multa</th>
										<th>Motivo</th>
										<th>Monto</th>
									</tr>
								</thead>
								<tbody>
									{_.map(this.state.tabExpInicial,(value,key,index)=>
										<MultaEditar multa={value} index={key}
										deleteElement={this.deleteElement}
										/>
									)}
								</tbody>
							</Table>
						</div>
						<div>
							<h4>Total Factura:</h4><FormControl readOnly type="text"  value={this.state.totalFactura}/>
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
						<Button onClick={this.closeModalSave}>Cerrar</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

class MultaEditar extends React.Component{
	constructor(props){
		super(props)
		this.state={
			multa: '',
			index: '', monto:''
		}
	}
	componentWillMount(){
		var that = this
		that.setState({
			multa: this.props.multa || '',
			index: this.props.index || '',
			monto: this.props.multa.monto|| '',
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			that.setState({
				multa: nextProps.multa || '',
				index: nextProps.index|| '',
				monto: nextProps.multa.monto|| '',
			})
		}                                                                                     
	}
	borrarFila=()=>{
		this.props.deleteElement(this.state.index)
	}
	/*handleCosto=(e)=>{
		this.setState({costo: e.target.value})
		this.props.editarCosto(this.state.index,this.state.expensa,e.target.value)
	}*/
	render(){
		var fechaMulta = new Date(this.state.multa.fechaMulta).toJSON().slice(0,10).replace(/-/g,'/');
		return(
			<tr>
				<td><Button bsStyle={'danger'} onClick={this.borrarFila}><Glyphicon glyph='minus'/></Button></td>
				<td>
					{fechaMulta}
				</td>
				<td>
					{this.state.multa.motivo}
				</td>
				<td>
					{this.state.multa.monto}
				</td>
			</tr>
		)
	}
}

class MultaAdd extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			multa: '',
			multaId:'',
		}
	}
	componentWillMount(){
		var that = this
		that.setState({
			multa: that.props.multa || '',
			multaId: that.props.multaId || '',
			tabExp: that.props.tabExp || ''
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			that.setState({
				multa: nextProps.multa || '',
				multaId: nextProps.multaId || '',
				tabExp: nextProps.tabExp || ''
			})
		}
	}
	addMulta=()=>{
		var tabExpKeys = []
		_.map(this.state.tabExp,(value)=>{
			tabExpKeys.push(value.idPagoMulta)
		})
		console.log(tabExpKeys)
		if(!_.contains(tabExpKeys,this.state.multaId)){
			this.props.addMulta(this.state.multaId)
		}
	}
	render(){
		var fechaMulta = new Date(this.state.multa.fechaMulta || moment().format()).toJSON().slice(0,10).replace(/-/g,'/');
		return(
			<tr>
				<td><Button bsStyle='success' onClick={this.addMulta}><Glyphicon glyph='plus'/></Button></td>
				<td>
					{fechaMulta}
				</td>
				<td>
					{this.state.multa.motivo}
				</td>
				<td>
					{this.state.multa.monto}
				</td>
			</tr>
		)
	}
}

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
var qExpensas = db.ref("gastos");
moment().format('YYYY/MM/DD, h:mm:ss a')

export default class GenerarRecibo extends React.Component{
	constructor(props){
		super(props)
		this.state={
			expensas: '',
			selExpensa : '', valIdExp: '',
			pagarTabla:'', tabExpInicial: [],
			totalFactura:0, usuario:'', modalSave: false, 
			departamento: '', departamentoId: '', fecha: moment().format(),
			date: moment(),
		}
	}
	componentWillMount(){
		var that = this
		var pagos = firebase.database().ref('pagos').orderByChild('idDep').equalTo(this.props.params.idDepartamento)
		pagos.on('value',(pagoSnapshot)=>{
			var pagosRealizados = []
			_.map(pagoSnapshot.val(),(value)=>{
				pagosRealizados = pagosRealizados.concat(value.codGastoEd)
			})
			console.log(pagosRealizados)
			qExpensas.on('value',(snapshot)=>{
				that.setState({
					expensas: _.pick(snapshot.val(),(value,key)=>
						!(_.contains(pagosRealizados,key))
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
	handleListaExpensas=(e)=>{
		this.setState({
			valIdExp: e.target.value.substr(0, e.target.value.indexOf(' '))
		});
	}
	addExpensa=(valIdExp)=> {
			var that = this
			var exp = _.pick(this.state.expensas,(val,key) => 
				key == valIdExp
			);
			var data = ''
			_.map(exp,(value,key)=>{
				data = { 
					codGastoEd: key,
					codExpensa: value.codExpensa || '', 
					empresa: value.empresa || '',
					nombre: value.nombre || '', 
					fechaInicial: value.fechaInicial || '',
					fechaLimite: value.fechaLimite || '',
					costo: 0, 
				}
				console.log(data)
			})
			var tabExpInicial = that.state.tabExpInicial
			tabExpInicial.push(data)
			this.setState({ tabExpInicial: tabExpInicial });
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
    }
    guardarRecibo=()=> {
		if(this.state.totalFactura > 0){
			funciones.guardarRecibo(
				this.state.fecha || moment().format(),
				this.props.params.userId || '',
				this.state.tabExpInicial || '',
				this.state.totalFactura || 0,
				this.props.params.idDepartamento || '',
			);
			browserHistory.goBack()
		}
		else{
			alert('La factura no tiene valor')
		}
	}
	openModalSave=()=>{this.setState({modalSave:true})}
	closeModalSave=()=>{this.setState({modalSave:false})}
	handleDate=(date)=>{
        var that = this
        that.setState({
          date: date
        },()=>{
            that.setState({
                fecha: moment(new Date(date)).format()
            })
        });
    }
	render(){
		var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/')
		return(
			<div className='GenerarRecibo'>
				<h3>Generar recibo para: {this.state.usuario.displayName || this.state.usuario.nombreUsuario}</h3>
				<h4>Departamento ID: {this.state.departamentoId}</h4>
				<h4>Fecha: 
				<DatePicker
					className="form-control"
                    readOnly
                    selected={this.state.date}
                    onChange={this.handleDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="YYYY/MM/DD"
                />
				</h4>
				<Row>
					<Col xs={12} sm={12} md={6} lg={6}>
						<h4>Lista de Expensas a pagar disponibles</h4>
						<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "250px"}}>
							<Table responsive style={{'textAlign':'left'}}>
								<thead>
									<tr>
										<th>Añadir</th>
										<th>ID</th>
										<th>Expensa</th>
										<th>Fechas</th>
									</tr>
								</thead>
								<tbody>
									{_.map(this.state.expensas,(value,key)=>
										<ExpensaAdd expensa={value} expensaId={key} addExpensa={this.addExpensa}/>
									)}
								</tbody>
							</Table>
						</div>
					</Col>
					<Col xs={12} sm={12} md={6} lg={6}>
						<h4>Lista de expensas para pagar</h4>
						<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "250px"}}>
							<Table responsive style={{'textAlign':'left'}}>
								<thead>
									<tr>
										<th>Borrar</th>
										<th>ID</th>
										<th>Expensa</th>
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
				<td><Button bsStyle={'danger'} onClick={this.borrarFila}><Glyphicon glyph='minus'/></Button></td>
				<td>{this.state.expensa.codGastoEd}</td>
				<td>
					<ul>
						<li>{this.state.expensa.codExpensa}</li>
						<li>{this.state.expensa.empresa}</li>
						<li>{this.state.expensa.nombre}</li>
					</ul>
				</td>
				<td>
					<FormControl type="text" style={{"width":"100px"}} 
					value={this.state.costo} onChange={this.handleCosto}/>
				</td>
			</tr>
		)
	}
}

class ExpensaAdd extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			expensa: '',
			expensaId:'',
		}
	}
	componentWillMount(){
		var that = this
		that.setState({
			expensa: that.props.expensa || '',
			expensaId: that.props.expensaId || '',
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			that.setState({
				expensa: nextProps.expensa || '',
				expensaId: nextProps.expensaId || '',
			})
		}
	}
	addExp=()=>{
		this.props.addExpensa(this.state.expensaId)
	}
	render(){
		var fechaInicial = new Date(this.state.expensa.fechaInicial).toJSON().slice(0,10).replace(/-/g,'/');
		var fechaLimite = new Date(this.state.expensa.fechaLimite).toJSON().slice(0,10).replace(/-/g,'/');
		return(
			<tr>
				<td><Button bsStyle='success' onClick={this.addExp}><Glyphicon glyph='plus'/></Button></td>
				<td>{this.state.expensaId}</td>
				<td>
					<ul>
						<li>{this.state.expensa.codExpensa}</li>
						<li>{this.state.expensa.empresa}</li>
						<li>{this.state.expensa.nombre}</li>
					</ul>
				</td>
				<td>
					<p>{fechaInicial} -</p>
					<p>{fechaLimite}</p>
				</td>
			</tr>
		)
	}
}

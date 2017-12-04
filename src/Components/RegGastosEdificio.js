import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon, InputGroup} from 'react-bootstrap';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import browserHistory from 'react-router/lib/browserHistory'
//import 'react-datepicker/dist/react-datepicker.css';

var db = firebase.database();
var qVecinos = db.ref("vecinos");
var qExpensas = db.ref("expensas");
var qGastos = db.ref('gastos');
moment().format('YYYY/MM/DD, h:mm:ss a')

export default class RegGastosEdificio extends React.Component{
	constructor(props){
		super(props)
		this.state={
			expensas: '',
			selExpensa : '', valIdExp: '',
			pagarTabla:'', tabExpInicial: [],
			totalFactura:0, usuario:'', modalSave: false, 
			departamento: '', departamentoId: '', fecha: moment().format(),
            date: moment(),
            meses: ['Enero', 'Febrero', 'Marzo', 'Abril',
            'Mayo','Junio','Julio','Agosto','Septiembre',
            'Octubre','Noviembre','Diciembre'],
            year: new Date().getFullYear(),
            mesPago: '', yearPago: new Date().getFullYear(),
            costoProp: 0,
		}
	}
	componentWillMount(){
		var that = this
        var expensas = firebase.database().ref('expensas')
        expensas.on('value',(snapshot)=>{
            that.setState({
                expensas: snapshot.val() || ''
            })
        })
        var meses= ['Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo','Junio','Julio','Agosto','Septiembre',
        'Octubre','Noviembre','Diciembre']
        that.setState({
            mesPago: meses[new Date().getMonth()]
        })
	}
	addExpensa=(valIdExp)=> {
			var that = this
			var exp = _.pick(this.state.expensas,(val,key) => 
				key == valIdExp
			);
			var data = ''
			_.map(exp,(value,key)=>{
				data = { 
					codExpensa: key || '', 
					empresaProv: value.empresaProv || '',
					nombreExpensa: value.nombreExpensa || '', 
					costo: value.montoExpensa || 0, 
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
            codExpensa: value.codExpensa || '', 
            empresaProv: value.empresaProv || '',
            nombreExpensa: value.nombreExpensa || '',
			costo: Number(cost) || 0,
		}
		this.setState({tabExpInicial: tabExpInicial });
		this.sumarFactura()
    }
    guardarGasto=()=> {
        if(this.state.totalFactura == 0){
            alert('Debe marcar expensas para pagar')
        }else{
            var gasto = qGastos.push()
            var gastoKey = gasto.key
            var datosGasto = {
                montoExpensas: this.state.totalFactura,
                mesPago: this.state.mesPago,
                yearPago: this.state.yearPago,
                fechaLimite: this.state.fecha || moment().format(),
                montoProp: this.state.costoProp || 0,
            }
            gasto.set(datosGasto)
            _.map(this.state.tabExpInicial,(value,key)=>{
                var gastoExpensa = firebase.database().ref('gastosExpensas').push()
                var datosExp = {
                    codGasto: gastoKey,
                    codExpensa: value.codExpensa || '', 
                    empresaProv: value.empresaProv || '',
                    nombreExpensa: value.nombreExpensa || '',
                    costoTotalMes: value.costo || 0,
                }
                gastoExpensa.set(datosExp)
            })
            browserHistory.goBack()
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
    handleMes=(e)=>{this.setState({mesPago: e.target.value})}
    handleYear=(e)=>{this.setState({yearPago: e.target.value})}
    handleCostoProp=(e)=>{this.setState({costoProp: e.target.value})}
	render(){
		var fecha = new Date().toJSON()
		return(
			<div className='GenerarRecibo'>
				<h3>Generar detalle de pago mensual de expensas</h3>
				<Row>
                <Col xs={12} sm={12} md={4} lg={4}>
                <h4>Mes a pagar</h4>
                <FormControl componentClass="select" placeholder="select" value={this.state.mesPago}
                onChange={this.handleMes}>
                    {_.map(this.state.meses,(value)=>
                        <option>{value}</option>
                    )}
                </FormControl>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                <h4>Año</h4>
                <FormControl componentClass="select" placeholder="select" value={this.state.yearPago}
                onChange={this.handleYear}>
                    {_.map([this.state.year-1,this.state.year,this.state.year+1],(value)=>
                        <option>{value}</option>
                    )}
                </FormControl>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                <h4>Fecha Limite de pago:</h4>
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
                </Col>
                </Row>
				<Row>
					<Col xs={12} sm={12} md={6} lg={6}>
						<h4>Lista de Expensas para añadir</h4>
						<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "250px"}}>
							<Table responsive style={{'textAlign':'left'}}>
								<thead>
									<tr>
										<th>Añadir</th>
										<th>ID</th>
										<th>Expensa</th>
                                        <th>Empresa</th>
										<th>Monto</th>
									</tr>
								</thead>
								<tbody>
									{_.map(this.state.expensas,(value,key)=>
										<ExpensaAdd expensa={value} expensaId={key} addExpensa={this.addExpensa} tabExp={this.state.tabExpInicial}/>
									)}
								</tbody>
							</Table>
						</div>
					</Col>
					<Col xs={12} sm={12} md={6} lg={6}>
						<h4>Lista de expensas añadidas</h4>
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
					</Col>
				</Row>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h4>Monto a cobrar propietarios:</h4>
                        <FormControl type="text"  value={this.state.costoProp} onChange={this.handleCostoProp}/>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h4>Total a pagar expensas:</h4>
                        <FormControl readOnly type="text"  value={this.state.totalFactura}/>
                    </Col>
                </Row>
				<Row>
					<div style= {{'paddingTop':'10px'}}>
						<Button bsStyle='info' onClick={this.openModalSave}>Generar gasto mensual</Button>
					</div>
				</Row>
				<Modal show={this.state.modalSave} onHide={this.closeModalSave}>
					<Modal.Header closeButton>
						<Modal.Title>Generacion de Gasto Mensual</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea realizar el registro del gasto mensual?
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="primary" onClick={this.guardarGasto}>Guardar</Button>
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
				<td>{this.state.expensa.codExpensa}</td>
				<td>{this.state.expensa.nombreExpensa}</td>
                <td>{this.state.expensa.empresaProv}</td>
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
            tabExp: that.props.tabExp || ''
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this
			that.setState({
				expensa: nextProps.expensa || '',
                expensaId: nextProps.expensaId || '',
                tabExp: nextProps.tabExp || ''
			})
		}
	}
	addExp=()=>{
        var tabExpKeys = []
		_.map(this.state.tabExp,(value)=>{
			tabExpKeys.push(value.codExpensa)
		})
		console.log(tabExpKeys)
		if(!_.contains(tabExpKeys,this.state.expensaId)){
            this.props.addExpensa(this.state.expensaId)
        }
	}
	render(){
		//var fechaInicial = new Date(this.state.expensa.fechaInicial).toJSON().slice(0,10).replace(/-/g,'/');
		return(
			<tr>
				<td><Button bsStyle='success' onClick={this.addExp}><Glyphicon glyph='plus'/></Button></td>
				<td>{this.state.expensaId}</td>
				<td>
                        {this.state.expensa.nombreExpensa}
                </td>
                <td>
						{this.state.expensa.empresaProv}
				</td>
				<td>
                        {this.state.expensa.montoExpensa}
				</td>
			</tr>
		)
	}
}
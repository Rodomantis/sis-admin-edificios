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

moment().format('YYYY/MM/DD, h:mm:ss a')

export default class RegistroGastos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            openModalGasto: false,
            gastos: '', expensas: '',
            nombre: '', fecha: '', monto: 0, idRegistro: '',
            userSavedData: '', codExpensa: '',
            startDate: moment(), finalDate: moment(),
            fechaInicial: moment().format(),
            fechaLimite: moment().format(), buscarExpensa: '',
            arrayBuscarExpensa: '',
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
    guardarGasto=()=>{
        if(this.state.codExpensa != '' || Number(this.state.monto) > 0){
            var gasto = firebase.database().ref('gastos').push()
            var data = {
                nombre: this.state.nombre || '',
                empresa: this.state.empresa || '',
                codExpensa: this.state.codExpensa || '',
                monto: Number(this.state.monto) || 0,
                fechaInicial: this.state.fechaInicial || new Date().toJSON(),
                fechaLimite: this.state.fechaLimite || new Date().toJSON(),
                usuario: this.state.userSavedData.uid || '', 
            }
            gasto.set(data)
            browserHistory.goBack()
        }else{
            alert('Debe ingresar al menos el Nombre del Gasto')
        }
    }
    handleName =(e)=>{this.setState({nombre: e.target.value})}
    handleCost=(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({monto: Number(e.target.value) || 0})
        }
    }
    handleStartDate=(date)=>{
        var that = this
        that.setState({
          startDate: date
        },()=>{
            that.setState({
                fechaInicial: moment(new Date(date)).format()
            })
        });
    }
    handleFinalDate=(date)=>{
        var that = this
        that.setState({
          finalDate: date
        },()=>{
            that.setState({
                fechaLimite: moment(new Date(date)).format()
            })
        });
    }
    handleListaExpensas=(e)=> {
        this.setState({
            codExpensa: e.target.value.substr(0, e.target.value.indexOf(' ')),
        }, this.selectExpensa);
    }
    busquedaExpensa = () => {
		this.setState({
			arrayBuscarExpensa : _.pick(this.state.expensas,(value) => 
				value.nombreExpensa.toUpperCase().includes(this.state.buscarExpensa.toUpperCase())
            ),
            codExpensa: '',
		})
    }
    selectExpensa=()=> {
		var sel = _.pick(this.state.expensas, (val,key) =>
			key == this.state.codExpensa
		);
		_.map(sel, (val,key)=>
			this.setState({
				codExpensa: key,
				nombre: val.nombreExpensa,
				empresa: val.empresaProv,
			})
		);
	}
	handleBuscarExpensa=(e)=>{this.setState({ buscarExpensa: e.target.value, },()=>{this.busquedaExpensa();});}
    render(){
        return(
            <div className='RegisterDep'>
                <h3>Registrar pago de gasto</h3>
                <Row>
                    <Col xs={0} sm={0} md={3} lg={3}/>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Label>Buscar por nombre</Label>
                        <FormControl type="text" onChange={this.handleBuscarExpensa} value={this.state.buscarExpensa} placeholder="Nombre del gasto"/>
                        <Label>Lista de expensas</Label>
                        <FormControl componentClass="select" onChange={this.handleListaExpensas} multiple>
                        {this.state.buscarExpensa === ""?
                            _.map(this.state.expensas, (value,key)=>
                                <option>{value.codigoExpensa} | {value.empresaProv} | {value.nombreExpensa}</option>
                            ):
                            _.map(this.state.arrayBuscarExpensa, (value,key)=>
                            <option>{value.codigoExpensa} | {value.empresaProv} | {value.nombreExpensa}</option>
                            )
                        }
                        </FormControl>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Label>Fecha Inicial</Label>
                                <DatePicker
                                    className="form-control"
                                    readOnly
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDate}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={30}
                                    dateFormat="YYYY/MM/DD"
                                />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Label>Fecha Limite</Label>
                                <DatePicker
                                    className="form-control"
                                    readOnly
                                    selected={this.state.finalDate}
                                    onChange={this.handleFinalDate}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={30}
                                    dateFormat="YYYY/MM/DD"
                                />
                            </Col>
                        </Row>
                        <Label>Monto</Label>
                        <FormControl type="text" onChange={this.handleCost} value={this.state.monto} placeholder="00" />
                    </Col>
                    <Col xs={0} sm={0} md={3} lg={3}/>
                </Row>
                <div style={{'paddingTop': '10px'}}>
                    <Button bsStyle="success" onClick={this.guardarGasto}>Guardar Proveedor   <Glyphicon glyph='hdd'/></Button>
                </div>
            </div>
        )
    }
}
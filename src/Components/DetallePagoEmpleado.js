import React from 'react';
import ReactDOM from 'react-dom'
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon} from 'react-bootstrap';
import moment from 'moment'
import DatePicker from 'react-datepicker'

moment().format('YYYY/MM/DD, h:mm:ss a')

export default class DetallePagoEmpleado extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            pagosEmpleados: '',
            descuentos: '',
            empleado:'',
            name:'', email:'', pago:0, fecha: moment().format(),
            descuentos: 0, date: moment(), discountList:[],
            discountName: '', discountAmount: 0,
        }
    }
    componentWillMount(){
        firebase.database().ref('pagosEmpleados').on('value',(snapshot)=>{
            this.setState({ pagosEmpleados: snapshot.val() || ''})
        },this)
        firebase.database().ref('descuentosEmpleados').on('value',(snapshot)=>{
            this.setState({ descuentos: snapshot.val() || ''})
        },this)
        firebase.database().ref('usuarios').child(this.props.params.idEmpleado).on('value',(snapshot)=>{
            this.setState({ empleado: snapshot.val() || ''})
        },this)
    }
    guardarPago=()=>{
        if(this.state.pago !== 0){
            var pago = firebase.database().ref('pagosEmpleados').push()
            var pagoKey = pago.key
            var data = {
                idEmpleado: this.props.params.idEmpleado,
                nombre: this.state.empleado.displayName,
                fecha: this.state.fecha || '',
                pago: Number(this.state.pago) || 0,
                descuentos: Number(this.state.descuentos) || 0,
                correo: this.state.empleado.email || '',
            }
            pago.set(data)
            _.map(this.state.discountList, (value,key)=>{
                var descuento = firebase.database().ref('descuentos').push()
                var datosDescuento = {
                    discountName: value.discountName,
                    discountAmount: value.discountAmount,
                    idPagoEmpleado: pagoKey,
                }
                descuento.set(datosDescuento)
            })
            window.location.reload()
        }else{
            alert('Debe ingresar al menos el sueldo')
        }
    }
    addDiscount=()=>{
        var data = {
            discountName: this.state.discountName,
            discountAmount: this.state.discountAmount,
        }
        var discountList = this.state.discountList
        discountList.push(data)
        this.setState({discountList: discountList})
        this.sumarDescuentos()
        ReactDOM.findDOMNode(this.refs.refDiscount).focus()
    }
    handlePay=(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({pago: Number(e.target.value) || 0})
        }
    }
    handleDiscount=(e)=>{this.setState({discountName: e.target.value})}
    handleDiscountAmount=(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({discountAmount: Number(e.target.value) || 0})
        }
    }
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
    deleteElement=(index)=>{
		var array = this.state.discountList;
		array.splice(index, 1);
		this.setState({discountList: array });
		this.sumarDescuentos()
    } 
    sumarDescuentos=()=>{
		var totalDesc = 0
		_.map(this.state.discountList,value=>{
			totalDesc = totalDesc + value.discountAmount
		})
		this.setState({descuentos: totalDesc || 0})
	}
    render(){
        return(
            <div className='RegisterDep'>
                <h3>Lista de pagos a empleados</h3>
                <div style={{'height': '200px', 'overflowY': 'scroll'}}>
                    <Table responsive style={{'textAlign':'left'}}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID Empleado</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Monto Pago</th>
                                <th>Fecha Pago</th>
                                <th>Descuentos</th>
                                <th>Funcion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(this.state.pagosEmpleados,(value,key)=>
                                <PagoEmp pago={value} pagoId={key}/>
                            )}
                        </tbody>
                    </Table>
                </div>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h3>Registro de pago a empleado</h3>
                        <Label className='pull-left'>Nombre</Label>
                        <FormControl type="text" value={this.state.empleado.displayName} readOnly />
                        <Label className='pull-left'>Correo</Label>
                        <FormControl type="email" value={this.state.empleado.email} readOnly />
                        <Label className='pull-left'>Monto</Label>
                        <FormControl type="text" value={this.state.pago} onChange={this.handlePay} />
                        <Label>Fecha</Label>
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
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h3>Añadir descuento</h3>
                        <Label className='pull-left'>Motivo descuento</Label>
                        <FormControl type="text" value={this.state.discountName} 
                        onChange={this.handleDiscount} ref='refDiscount' />
                        <Label className='pull-left'>Monto descuento</Label>
                        <FormControl type="text" value={this.state.discountAmount} onChange={this.handleDiscountAmount} />
                        <Button bsStyle='warning' onClick={this.addDiscount}>Añadir   <Glyphicon glyph='plus'/></Button>
                        <div style={{'height': '200px', 'overflowY': 'scroll'}}>
                            <Table responsive style={{'textAlign':'left'}}>
                                <thead>
                                    <tr>
                                        <th>Motivo</th>
                                        <th>Descuento</th>
                                        <th>Borrar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {_.map(this.state.discountList,(value,key)=>
                                    <tr>
                                        <td>{value.discountName}</td>
                                        <td>{value.discountAmount}</td>
                                        <td>
                                            <Button bsStyle='danger' onClick={()=>{
                                                this.deleteElement(key)
                                            }}
                                            ><Glyphicon glyph='minus'/></Button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
                <div style={{'paddingTop': '5px'}}>
                    <Button  bsStyle='danger' onClick={this.guardarPago}>Guardar Pago   <Glyphicon glyph='hdd'/></Button>
                </div>
            </div>
        )
    }
}

class PagoEmp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            pago:'',
            pagoId:'', showModalDelete: false,
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            pago: that.props.pago ||'',
            pagoId: that.props.pagoId || '',
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                pago: nextProps.pago ||'',
                pagoId: nextProps.pagoId || '',
            })
        }
    }
    delete=()=>{
		firebase.database().ref('pagosEmpleados').child(this.props.pagoId).on('value',(snapshot)=>{
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
                <td>{this.state.pagoId}</td>
                <td>{this.state.pago.idEmpleado}</td>
                <td>{this.state.pago.nombre}</td>
                <td>{this.state.pago.correo}</td>
                <td>{this.state.pago.pago}</td>
                <td>{this.state.pago.fecha}</td>
                <td>{this.state.pago.descuentos}</td>
                <td><Button bsStyle='danger' onClick={this.openModalDelete}>Borrar  <Glyphicon glyph='trash'/></Button></td>
                <Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea borrar el pago?
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
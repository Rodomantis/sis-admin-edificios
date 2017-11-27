import React from 'react';
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
            descuentos: 0, date: moment(),
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
            var data = {
                idEmpleado: this.props.params.idEmpleado,
                nombre: this.state.empleado.displayName,
                fecha: this.state.fecha || '',
                pago: Number(this.state.pago) || 0,
                descuentos: Number(this.state.descuentos) || 0,
                correo: this.state.empleado.email || '',
            }
            pago.set(data)
        }else{
            alert('Debe ingresar al menos el sueldo')
        }
    }
    handlePay=(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({pago: Number(e.target.value) || 0})
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
    render(){
        return(
            <div className='RegisterDep'>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Label>Nombre</Label>
                        <FormControl type="text" value={this.state.empleado.displayName} readOnly />
                        <Label>Correo</Label>
                        <FormControl type="email" value={this.state.empleado.email} readOnly />
                        <Label>Monto</Label>
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
                        <div style={{'paddingTop': '5px'}}>
                            <Button  bsStyle='danger' onClick={this.guardarPago}>Guardar Pago   <Glyphicon glyph='hdd'/></Button>
                        </div>
                    </Col>
                </Row>
                <h3>Lista de pagos a empleados</h3>
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
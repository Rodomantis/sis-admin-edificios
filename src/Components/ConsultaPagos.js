import React from 'react';
import ReactDOM from 'react-dom'
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon} from 'react-bootstrap';
import { Link } from 'react-router/lib';
import moment from 'moment'

export default class ConsultaPagos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            pagosEmpleado: '',
        }
    }
    componentWillMount(){
        firebase.database().ref('pagosEmpleados').orderByChild('idEmpleado').equalTo(this.props.params.userId).on('value',(snapshot)=>{
            this.setState({ pagosEmpleado: snapshot.val() || ''})
        },this)
    }
    render(){
        var counter = 0
        return(
            <div className='ConsultaPagos'>
                <h3>Lista de registro de cobro de sueldos</h3>
                <h4>Para cualquier consulta contactar al administrador</h4>
                <div style={{'height': '400px', 'overflowY': 'scroll'}}>
                    <Table responsive style={{'textAlign':'left'}}>
                        <thead>
                            <tr>
                                <th>Numero Pago</th>
                                <th>Monto Pago</th>
                                <th>Fecha Pago</th>
                                <th>Descuentos</th>
                                <th>Funcion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(this.state.pagosEmpleado,(value,key)=>{
                                counter = counter+1
                                return( 
                                    <tr>
                                        <td>{counter}</td>
                                        <td>{value.pago}</td>
                                        <td>{moment(value.fecha).format('DD/MM/YYYY')}</td>
                                        <td>{value.descuentos}</td>
                                        <Link to={`/usuario/${this.props.params.userId}/consulta-pagos/${key}/descuentos`}>
                                            <td><Button bsStyle='danger'>Consultar Descuentos   <Glyphicon glyph='search'/></Button></td>
                                        </Link>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
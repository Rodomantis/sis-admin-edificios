import React from 'react';
import ReactDOM from 'react-dom'
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon} from 'react-bootstrap';

export default class ConsultaDescuentos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            descuentos: '',
        }
    }
    componentWillMount(){
        firebase.database().ref('descuentos').orderByChild('idPagoEmpleado').equalTo(this.props.params.idPago).on('value',(snapshot)=>{
            this.setState({ descuentos: snapshot.val() || ''})
        },this)
    }
    render(){
        return(
            <div className='ConsultaDescuentos'>
                <h3>Lista de descuentos del pago: {this.props.params.idPago}</h3>
                <h4>Para cualquier consulta contactar al administrador</h4>
                <div style={{'height': '400px', 'overflowY': 'scroll'}}>
                {this.state.descuentos == ''?
                    <h4>El pago no tiene descuentos</h4>:
                    <Table responsive style={{'textAlign':'left'}}>
                        <thead>
                            <tr>
                                <th>ID Descuento</th>
                                <th>Motivo</th>
                                <th>Monto descuento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(this.state.descuentos,(value,key)=>
                                <tr>
                                    <td>{key}</td>
                                    <td>{value.discountName}</td>
                                    <td>{value.discountAmount}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                }
                </div>
            </div>
        )
    }
}
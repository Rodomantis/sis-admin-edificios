import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';

export default class Multas extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            departamento: '', multas:'',
            usuario: '',
        }
    }
    componentWillMount(){
		firebase.database().ref('departamentos').child(this.props.params.idDep).on('value',(snapshot)=>{
            this.setState({ departamento: snapshot.val() || ''})
        },this)
        firebase.database().ref('multas').orderByChild('idDep').equalTo(this.props.params.idDep).on('value',(snapshot)=>{
            this.setState({ multas: snapshot.val() || ''})
        },this)
    }
    render(){
        return(
            <div className='ClienteDep'>
                <h3>Lista de multas registradas del departamento: </h3>
				<h4>Edificio: <b>{this.state.departamento.nombreEdificio}</b> | Piso: <b>{this.state.departamento.piso}</b> | Numero: <b>{this.state.departamento.numero}</b></h4>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Motivo</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.multas,(value,key)=>
                            <tr>
                                <td>{value.fechaMulta}</td>
                                <td>{value.motivo}</td>
                                <td>{value.monto}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}
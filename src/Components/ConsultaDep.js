import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';

export default class ConsultaDep extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            departamentos: '',
            usuario: '',
        }
    }
    componentWillMount(){
        firebase.database().ref('departamentos').orderByChild('propietario').equalTo(this.props.params.userId).on('value',(snapshot)=>{
            this.setState({ departamentos: snapshot.val() || ''})
        },this)
        firebase.database().ref('usuarios').child(this.props.params.userId).on("value",(snapshot) => {
			this.setState({ usuario: snapshot.val() || ''})
		},this )
    }
    render(){
        return(
            <div className='ConsultaDep'>
                <h3>Lista de departamentos registrados de {this.state.usuario.displayName}</h3>
                <h4>Seleccionar el departamento para consultar los pagos realizados</h4>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Edificio</th>
                            <th>Piso</th>
                            <th>Numero</th>
                            <th>Telefono</th>
                            <th>Consulta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.departamentos,(value,key)=>
                            <tr>
                                <td>{key}</td>
                                <td>{value.nombreEdificio}</td>
                                <td>{value.piso}</td>
                                <td>{value.numero}</td>
                                <td>{value.tel}</td>
                                <td>
                                <Link to={`/administrador/admin-usuarios/${this.props.params.userId}/departamentos/${key}/recibos`}>
                                    <Button bsStyle='info'>Consultar recibos   <Glyphicon glyph='list'/></Button>
                                </Link>
                                <Link to={`/usuario/${this.props.params.userId}/departamentos/${key}/pagos-pendientes/`}>
                                    <Button bsStyle='danger'>Consultar pagos pendientes  <Glyphicon glyph='info-sign'/></Button>
                                </Link>
								<Link to={`/usuario/${this.props.params.userId}/departamentos/${key}/multas/`}>
                                    <Button bsStyle='warning'>Consultar multas  <Glyphicon glyph='search'/></Button>
                                </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}
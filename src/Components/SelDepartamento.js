import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import Link from 'react-router/lib/Link'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon} from 'react-bootstrap';

export default class SelDepartamento extends React.Component{
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
        var counter = 0
        return(
            <div className='SelDepartamento'>
                <h3>Lista de departamentos registrados de {this.state.usuario.displayName}</h3>
                <h4>Seleccionar un departamento para pagar los servicios</h4>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Edificio</th>
                            <th>Piso</th>
                            <th>Numero</th>
                            <th>Telefono</th>
                            <th>Generar Recibo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.departamentos,(value,key)=>{
                            counter = counter+1
                            return <tr>
                                <td>{counter}</td>
                                <td>{value.nombreEdificio}</td>
                                <td>{value.piso}</td>
                                <td>{value.numero}</td>
                                <td>{value.tel}</td>
                                <td>
                                    <Link to={`/administrador/registros-cobros-expensas/${this.props.params.userId}/departamentos/${key}/generar-recibo`}>
                                    <Button bsStyle={'warning'}>Generar Recibo   <Glyphicon glyph='pencil'/></Button>
                                    </Link>
                                    <Link to={`/administrador/registros-cobros-expensas/${this.props.params.userId}/departamentos/${key}/pago-multas`}>
                                    <Button bsStyle={'info'}>Pagar multas   <Glyphicon glyph='plus'/></Button>
                                    </Link>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}
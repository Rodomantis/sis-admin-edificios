import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon, InputGroup} from 'react-bootstrap';
import { Link } from 'react-router/lib';

export default class Deudores extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            pagosExpensa: '',
            departamentos: '', depAlDia:'',
        }
    }
    componentWillMount(){
        firebase.database().ref('pagos').orderByChild('idPagoExp').equalTo(this.props.params.idGasto).on('value',(snapshot)=>{
            this.setState({ pagosExpensa: snapshot.val() || ''})
            firebase.database().ref('departamentos').on("value",(depSnapshot) => {
                var pagosExpensa = snapshot.val() || ''
                var depCumplidos = _.pluck(pagosExpensa, 'idDep')
                console.log(depCumplidos)
                this.setState({ 
                    departamentos: _.pick(depSnapshot.val(),(value,key)=>
                        !(_.contains(depCumplidos,key))
                    )|| '',
                    depAlDia: _.pick(depSnapshot.val(),(value,key)=>
                        (_.contains(depCumplidos,key))
                    )|| ''
                })
            },this )
        },this)
    }
    render(){
        return(
            <div className='Deudores'>
                <h3>Lista de departamentos deudores</h3>
                <h4>Informar al correspondiente vecino</h4>
                <div style={{'height':'300px', 'overflowY':'scroll'}}>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>Edificio</th>
                            <th>Piso</th>
                            <th>Numero</th>
                            <th>Cod. Propietario</th>
                            <th>Telefono</th>
                            <th>Funcion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.departamentos,(value,key)=>
                            <tr>
                                <td>{value.nombreEdificio}</td>
                                <td>{value.piso}</td>
                                <td>{value.numero}</td>
                                <td>
                                <Link to={'/administrador/admin-usuarios/'+value.propietario+'/usuario'}>
                                    {value.propietario}
                                </Link>
                                </td>
                                <td>{value.tel}</td>
                                <Link to={'/administrador/registros-cobros-expensas/'+value.propietario+'/departamentos/'+key+'/generar-recibo'}>
                                    <Button bsStyle='info'>Realizar pago   <Glyphicon glyph='hdd'/></Button>
                                </Link>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </div>
                <h3>Lista de departamentos al dia</h3>
                <div style={{'height':'300px', 'overflowY':'scroll'}}>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>Edificio</th>
                            <th>Piso</th>
                            <th>Numero</th>
                            <th>Cod. Propietario</th>
                            <th>Telefono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.depAlDia,(value,key)=>
                            <tr>
                                <td>{value.nombreEdificio}</td>
                                <td>{value.piso}</td>
                                <td>{value.numero}</td>
                                <td>
                                <Link to={'/administrador/admin-usuarios/'+value.propietario+'/usuario'}>
                                    {value.propietario}
                                </Link>
                                </td>
                                <td>{value.tel}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </div>
            </div>
        )
    }
}
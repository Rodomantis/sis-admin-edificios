import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';
import moment from 'moment'

var db = firebase.database();

export default class Multas extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            departamento: '', multas:'',
            usuario: '', userSavedData:'',
            pagosMultas: '',
        }
    }
    componentWillMount(){
        var that = this;
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
		firebase.database().ref('departamentos').child(this.props.params.idDep).on('value',(snapshot)=>{
            this.setState({ departamento: snapshot.val() || ''})
        },this)
        firebase.database().ref('multas').orderByChild('idDep').equalTo(this.props.params.idDep).on('value',(snapshot)=>{
            this.setState({ multas: snapshot.val() || ''})
        },this)
        var multas = firebase.database().ref('pagosMultas').orderByChild('idDep').equalTo(this.props.params.idDep)
		multas.on('value',(pagoSnapshot)=>{
            that.setState({multasPagadas: pagoSnapshot.val()})
			var multasPagadas = []
			_.map(pagoSnapshot.val(),(value)=>{
				multasPagadas = multasPagadas.concat(value.idPagoMulta)
			})
            //console.log(pagosRealizados)
            var qMultas = db.ref("multas").orderByChild('idDep').equalTo(this.props.params.idDep)
			qMultas.on('value',(snapshot)=>{
				that.setState({
					multas: _.pick(snapshot.val(),(value,key)=>
						!(_.contains(multasPagadas,key))
					)
				})
			})
		})
    }
    render(){
        return(
            <div className='ClienteDep'>
                <h3>Lista de multas registradas del departamento: </h3>
				<h4>Edificio: <b>{this.state.departamento.nombreEdificio}</b> | Piso: <b>{this.state.departamento.piso}</b> | Numero: <b>{this.state.departamento.numero}</b></h4>
                <div style={{'height': '200px', 'overflowY': 'scroll'}}>
                {this.state.userSavedData.nivel >=3?
                    <Link to={`/usuario/${this.props.params.userId}/departamentos/${this.props.params.idDep}/multas/nueva`}>
                        <Button bsStyle={'danger'}>Generar multa   <Glyphicon glyph='plus'/></Button>
                    </Link>:
                    null
                }
                <br/>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>Fecha Multa</th>
                            <th>Motivo</th>
                            <th>Monto</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.multas,(value,key)=>
                            <tr>
                                <td>{moment(value.fechaMulta).format('DD/MM/YYYY hh:mm')}</td>
                                <td>{value.motivo}</td>
                                <td>{value.monto}</td>
                                <td>
                                {this.state.userSavedData.nivel >=3?
                                <Link to={`/administrador/registros-cobros-expensas/${this.props.params.userId}/departamentos/${this.props.params.idDep}/pago-multas`}>
                                    <Button bsStyle={'info'}>Pagar multas   <Glyphicon glyph='lock'/></Button>
                                </Link>:
                                'Pago pendiente'
                                }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </div>
                <br/>
                <h3>Lista de multas pagadas</h3>
                <div style={{'height': '200px', 'overflowY': 'scroll'}}>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>Fecha Multa</th>
                            <th>Fecha de pago</th>
                            <th>Motivo</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.multasPagadas,(value,key)=>
                            <tr>
                                <td>{moment(value.fechaMulta).format('DD/MM/YYYY hh:mm')}</td>
                                <td>{moment(value.fechaPago).format('DD/MM/YYYY hh:mm')}</td>
                                <td>{value.motivo}</td>
                                <td>{value.monto}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </div>
            </div>
        )
    }
}
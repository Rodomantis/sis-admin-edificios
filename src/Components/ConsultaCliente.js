import React, { Component } from 'react';
import _ from 'underscore'
import { Navbar, NavDropdown, NavItem, Grid, Table, Glyphicon } from 'react-bootstrap';
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import Link from 'react-router/lib/Link'

var db = firebase.database()

export default class ConsultaCliente extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			recibosDep: '',
			idVecino:'', userSavedData: '', departamento: ''
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
		var idVecino = that.props.params.userId || '' 
		var idDep = that.props.params.idDep || ''
		this.setState({
			idVecino: idVecino,
		})
		var recibosDep = db.ref('recibos').orderByChild('idDep').equalTo(idDep)
		recibosDep.on('value',(snapshot)=>{
			this.setState({
				recibosDep: snapshot.val()
			})
		})
		firebase.database().ref('departamentos').child(idDep).on('value',(snapshot)=>{
			that.setState({
				departamento: snapshot.val() || '',
				departamentoId: snapshot.key ||  '',
			})
		})
	}
	render(){
		return(
			<div className='ClientHome'>
				<h3>Lista de recibos pagados: {this.state.userSavedData.displayName || 'NoNAME'}</h3>
				<h4>Departamento N°: <b>{this.state.departamento.numero}</b> | Piso: <b>{this.state.departamento.piso}</b> | Edificio: <b>{this.state.departamento.nombreEdificio}</b></h4>
				<h3>Seleccione el recibo correspondiente para mas detalle</h3>
				{this.state.recibosDep === ''?
					<h4>El cliente no tiene cuentas pagadas</h4>:
					<TablaRecibos recibosDep={this.state.recibosDep} idDep={this.props.params.idDep} idVecino={this.props.params.userId}/>
				}
			</div>
		)
	}
}

class TablaRecibos extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			recibosDep: '' 
		}
	}
	componentWillMount(){
		this.setState({
			recibosDep: this.props.recibosDep || '',
			idDep: this.props.idDep || '',
		})
	}
	render(){
		return(
				<Table responsive style={{'textAlign':'left'}}>
					<thead>
						<tr>
							<th>Codigo Recibo</th>
							<th>Fecha recibo</th>
							<th>Total</th>
							<th>Funcion</th>
						</tr>
					</thead>
					<tbody>
						{_.map(this.state.recibosDep, (value, key)=>{
							var fecha = new Date(value.fechaRecibo).toJSON().slice(0,10).replace(/-/g,'/')
							return(
								<tr key={key}>
									<td>{key}</td>
									<td>{fecha}</td>
									<td>{value.totalRecibo}</td>
									<td>
										<Link to={`/usuario/${this.props.idVecino}/departamentos/${this.state.idDep}/consulta-pagos/${key}/pago-detalle`}>
											<Button bsStyle='info'>Ir a detalle   <Glyphicon glyph='th-list'/></Button>
										</Link>
									</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
		)
	}
}


import React, { Component } from 'react';
import _ from 'underscore'
import Link from 'react-router/lib/Link'
import { Navbar, NavDropdown, NavItem, Grid, Table, Glyphicon } from 'react-bootstrap';
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import jsPDF from 'jspdf'
import logo from './../Images/Logo.png'
import moment from 'moment'

var db = firebase.database()

export default class PagoDetalle extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			pagos: '',
			userSavedData: '',
			user: '',
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
						user: value.val() || '',
				  	})
			  	})
			} else {
                that.setState({
                    userSavedData: '',
                })
			}
        });
		var detalleRecibo = db.ref('pagos').orderByChild('idRecibo').equalTo(this.props.params.idRecibo)
		detalleRecibo.on('value',(snapshot)=>{
			this.setState({
				pagos: snapshot.val()
			})
		})
		var departamento = db.ref('departamentos').child(this.props.params.idDep)
		departamento.on('value',(snapshot)=>{
			this.setState({
				departamento: snapshot.val()
			})
		})
		firebase.database().ref('recibos').child(this.props.params.idRecibo).on('value', (snapshot)=>{
			this.setState({
				recibo: snapshot.val()
			})
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps)
		{
			var detalleRecibo = db.ref('pagos').orderByChild('idRecibo').equalTo(nextProps.params.idRecibo)
			detalleRecibo.on('value',(snapshot)=>{
				this.setState({
					pagos: snapshot.val()
				})
			})
		}
	}
	imprimir=()=>{
		var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/')
		var doc = new jsPDF({
			format: [279.4, 215.9]
		}) 
		var numeroRecibo= 0
		var tablaInicio = 80
		doc.setFontSize(8)
		doc.text(20,10,"Condominios Acacias")
		doc.setFontSize(18)
		doc.text(60,20,"Recibo de control de expensas")
		doc.addImage(logo, 'PNG', 150, 8, 30, 10)
		doc.setFontSize(11)
		doc.text(20,30,"Codigo recibo:")
		doc.setFontSize(11)
		doc.text(60,30, this.props.params.idRecibo)
		doc.setFontSize(11)
		doc.text(20,40,"ID Vecino:")
		doc.setFontSize(11)
		doc.text(60,40, this.state.user.displayName)
		doc.setFontSize(11)
		doc.text(20,50,"Edificio:")
		doc.setFontSize(11)
		doc.text(60,50, this.state.departamento.nombreEdificio)
		doc.setFontSize(11)
		doc.text(20,60,"Piso:")
		doc.setFontSize(11)
		doc.text(40,60, (this.state.departamento.piso).toString())
		doc.setFontSize(11)
		doc.text(80,60,"Departamento:")
		doc.setFontSize(11)
		doc.text(110,60, (this.state.departamento.numero).toString())
		doc.setFontSize(16)
		doc.text(80,70,"Detalle de pago:")
		doc.setFontSize(11)
		doc.text(20,80,"Id Pago:")
		doc.setFontSize(11)
		doc.text(70,80,"Mes a pagar:")
		doc.setFontSize(11)
		doc.text(120,80,"Año:")
		doc.setFontSize(11)
		doc.text(170,80,"Monto:")
		_.map(this.state.pagos, (value, key)=>{
			tablaInicio = tablaInicio + 7
			numeroRecibo = numeroRecibo + 1 
			doc.setFontSize(9)
			doc.text(20,tablaInicio,numeroRecibo.toString())
			doc.setFontSize(9)
			doc.text(70,tablaInicio,value.mesPago)
			doc.setFontSize(9)
			doc.text(120,tablaInicio,value.yearPago.toString())
			doc.setFontSize(9)
			doc.text(170,tablaInicio,value.costoExpensa.toString())
		})
		tablaInicio = tablaInicio + 5
		doc.setFontSize(11)
		doc.text(170,tablaInicio, "_____")
		doc.setFontSize(11)
		tablaInicio = tablaInicio + 10
		doc.setFontSize(11)
		doc.text(20,tablaInicio,"Monto total a pagar:")
		doc.setFontSize(11)
		doc.text(170,tablaInicio, (this.state.recibo.totalRecibo).toString())
		tablaInicio = tablaInicio + 10
		doc.setFontSize(11)
		doc.text(20,tablaInicio,"Fecha:")
		doc.setFontSize(11)
		doc.text(50,tablaInicio, fecha)
		doc.save('Recibo:'+ this.props.params.idRecibo)
	}
	render(){
		return(
			<div className='PagoDetalle'>
				<h3>Detalle del recibo Codigo: {this.props.params.idRecibo}</h3>
				<h4>Hacer click en el ID del servicio para ver todos los pagos</h4>
				<Button bsStyle='danger' onClick={this.imprimir}>Imprimir Recibo   <Glyphicon glyph='hdd'/></Button>
				{this.state.pagos === ''?
					<h4>Factura mal detallada, no hay pagos</h4>:
					<TablaPagos pagos={this.state.pagos} idVecino={this.props.params.userId} idDep={this.props.params.idDep}/>
				}
			</div>
		)
	}
}

class TablaPagos extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			pagos: '' 
		}
	}
	componentWillMount(){
		this.setState({
			pagos: this.props.pagos || '',
		})
	}
	render(){
		var counter = 0
		return(
				<Table responsive style={{'textAlign':'left'}}>
					<thead>
						<tr>
							<th>#</th>
							<th>Codigo expensa</th>
							<th>Costo Expensa</th>
							<th>Fecha Limite</th>
							<th>Mes Pago</th>
							<th>Año</th>
						</tr>
					</thead>
					<tbody>
						{_.map(this.state.pagos, (value, key)=>{
							counter=counter+1
							return <tr>
								<td>
									{counter}
								</td>
								<td>{value.idPagoExp || ''}</td>
								<td>{value.costoExpensa}</td>
								<td>{moment(value.fechaLimite).format('DD/MM/YYYY')}</td>
								<td>{value.mesPago}</td>
								<td>{value.yearPago}</td>
								<td>
									<Link to={`/usuario/${this.props.idVecino}/departamentos/${this.props.idDep}/detalle-servicio/${value.idPagoExp}`}>
										<Button bsStyle='info'>Historial pago servicio   <Glyphicon glyph='list-alt'/></Button>
									</Link>
								</td>
							</tr>
						})}
					</tbody>
				</Table>
		)
	}
}
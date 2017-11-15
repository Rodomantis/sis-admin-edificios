import React, { Component } from 'react';
import _ from 'underscore'
import Link from 'react-router/lib/Link'
import { Navbar, NavDropdown, NavItem, Grid, Table } from 'react-bootstrap';
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'

var db = firebase.database()

export default class PagoDetalle extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			pagos: '',
		}
	}
	componentWillMount(){
		var detalleRecibo = db.ref('pagos').orderByChild('idRecibo').equalTo(this.props.params.idRecibo)
		detalleRecibo.on('value',(snapshot)=>{
			this.setState({
				pagos: snapshot.val()
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
	render(){
		return(
			<div className='PagoDetalle'>
				<h3>Detalle del recibo: {this.props.params.idRecibo}</h3>
				<h4>Hacer click en el ID del servicio para ver todos los pagos</h4>
				{this.state.pagos === ''?
					<h4>Factura mal detallada, no hay pagos</h4>:
					<TablaPagos pagos={this.state.pagos} idVecino={this.props.params.userId}/>
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
		return(
				<Table responsive style={{'textAlign':'left'}}>
					<thead>
						<tr>
							<th>ID Pago</th>
							<th>Codigo Expensa</th>
							<th>Monto</th>
							<th>Pago servicio</th>
						</tr>
					</thead>
					<tbody>
						{_.map(this.state.pagos, (value, key)=>
							<tr>
								<td>
									{key}
								</td>
								<td>{value.codExpensa}</td>
								<td>{value.costoExpensa}</td>
								<td>
									<Link to={`/usuario/${this.props.idVecino}/detalle-servicio/${value.codExpensa}`}>
										<Button bsStyle='info'>Historial pago servicio</Button>
									</Link>
								</td>
							</tr>
						)}
					</tbody>
				</Table>
		)
	}
}
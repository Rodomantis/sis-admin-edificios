import React, { Component } from 'react';
import _ from 'underscore'
import Link from 'react-router/lib/Link'
import { Navbar, NavDropdown, NavItem, Grid, Table, Glyphicon } from 'react-bootstrap';
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
		return(
				<Table responsive style={{'textAlign':'left'}}>
					<thead>
						<tr>
							<th>ID</th>
							<th>Id expensa</th>
							<th>Costo Expensa</th>
							<th>Fecha Limite</th>
							<th>Mes Pago</th>
							<th>Año</th>
						</tr>
					</thead>
					<tbody>
						{_.map(this.state.pagos, (value, key)=>
							<tr>
								<td>
									{key}
								</td>
								<td>{value.idPagoExp || ''}</td>
								<td>{value.costoExpensa}</td>
								<td>{new Date(value.fechaLimite).toJSON().slice(0,10).replace(/-/g,'/')}</td>
								<td>{value.mesPago}</td>
								<td>{value.yearPago}</td>
								<td>
									<Link to={`/usuario/${this.props.idVecino}/departamentos/${this.props.idDep}/detalle-servicio/${value.idPagoExp}`}>
										<Button bsStyle='info'>Historial pago servicio   <Glyphicon glyph='list-alt'/></Button>
									</Link>
								</td>
							</tr>
						)}
					</tbody>
				</Table>
		)
	}
}
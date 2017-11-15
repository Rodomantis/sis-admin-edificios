import React, { Component } from 'react';
import _ from 'underscore'
import { Navbar, NavDropdown, NavItem, Grid, Table } from 'react-bootstrap';
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import Link from 'react-router/lib/Link'

var db = firebase.database()

export default class ConsultaCliente extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			recibosCliente: '',
			idVecino:'', userSavedData: '',
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
		this.setState({
			idVecino: idVecino,
		})
		var recibosCliente = db.ref('recibos').orderByChild('idVecino').equalTo(idVecino)
		recibosCliente.on('value',(snapshot)=>{
			this.setState({
				recibosCliente: snapshot.val()
			})
		})
	}
	render(){
		return(
			<div className='ClientHome'>
				<h4>Lista de recibos pagados: {this.state.userSavedData.displayName || 'NoNAME'}</h4>
				{this.state.recibosCliente === ''?
					<h4>El cliente no tiene cuentas pagadas</h4>:
					<TablaRecibos recibosCliente={this.state.recibosCliente} idVecino={this.state.idVecino}/>
				}
			</div>
		)
	}
}

class TablaRecibos extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			recibosCliente: '' 
		}
	}
	componentWillMount(){
		this.setState({
			recibosCliente: this.props.recibosCliente || '',
			idVecino: this.props.idVecino || '',
		})
	}
	render(){
		return(
				<Table responsive style={{'textAlign':'left'}}>
					<thead>
						<tr>
							<th>ID Recibo</th>
							<th>Fecha recibo</th>
							<th>Total</th>
							<th>Funcion</th>
						</tr>
					</thead>
					<tbody>
						{_.map(this.state.recibosCliente, (value, key)=>
							<tr>
								<td>{key}</td>
								<td>{value.fechaRecibo}</td>
								<td>{value.totalRecibo}</td>
								<td>
									<Link to={`/usuario/${this.state.idVecino}/consulta-pagos/${key}/pago-detalle`}>
										<Button bsStyle='info'>Ir a detalle</Button>
									</Link>
								</td>
							</tr>
						)}
					</tbody>
				</Table>
		)
	}
}


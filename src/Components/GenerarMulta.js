import React, { Component } from 'react';
import { Navbar, NavDropdown, NavItem, Grid, Panel, FormControl, FormGroup, ControlLabel, InputGroup} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image, Label, Glyphicon } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import browserHistory from 'react-router/lib/browserHistory'
import moment from 'moment'
import { database } from 'firebase';

export default class GenerarMulta extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            idDep: '',
            idVecino: '',
            activa: true,
            monto: 0,
            motivo: '',
            fechaMulta: moment().format(),
            userSavedData: '',
        }
    }
    componentWillMount(){
        var that = this
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
        that.setState({
            idDep: that.props.params.idDep || '',
            idVecino: that.props.params.userId || '',
            fechaMulta: moment().format()
        })
    }
    handleAmount=(e)=>{
        const re = /^[0-9\b]+$/
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({monto: Number(e.target.value) || 0})
        }
    }
    handleMotivo=(e)=>{this.setState({motivo: e.target.value})}
    guardarMulta=()=>{
        if(this.state.monto == 0 || this.state.motivo == ''){
            alert('Debe ingresar el monto y el motivo de la multa')
        } else {
            var multa = firebase.database().ref('multas').push()
            var data = {
                idDep: this.state.idDep || '',
                idVecino: this.state.idVecino || '',
                activa: true,
                monto: this.state.monto || 0,
                motivo: this.state.motivo || '',
                fechaMulta: moment().format()
            }
            multa.set(data)
            browserHistory.goBack()
        }
    }
    render(){
        return(
            <div className='GenerarMulta'>
            {this.state.userSavedData.nivel >= 3?
            <Row>
                <Col xs={12} sm={12} md={3} lg={3}/>
                <Col xs={12} sm={12} md={6} lg={6}>
                <h3>Modulo de generación de multas</h3>
                <ControlLabel>Motivo de multa</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.motivo}
                        placeholder="Motivo de la multa"
                        ref ="msgMulta"
                        componentClass="textarea"
                        onChange={this.handleMotivo}
                    />
                <ControlLabel>Monto de multa</ControlLabel>
                <InputGroup >
                    <InputGroup.Addon>Bs</InputGroup.Addon>
                    <FormControl type="text" value={this.state.monto} onChange={this.handleAmount} />
                    <InputGroup.Addon>.00</InputGroup.Addon>
                </InputGroup>
                <div style={{'paddingTop': '10px'}}>
                <Button bsStyle='warning' onClick={this.guardarMulta}>Guardar<Glyphicon glyph='hdd'/></Button>
                </div>
                </Col>
                <Col xs={12} sm={12} md={3} lg={3}/>
            </Row>:<h3>No puede acceder a esta función</h3>
            }
            </div>
        )
    }
}
import React from 'react';
import funciones from './../Functions/funciones-guardar';
import _ from 'underscore';
import firebase from './../Functions/conexion'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Glyphicon, InputGroup} from 'react-bootstrap';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router/lib';

moment().format('YYYY/MM/DD, h:mm:ss a')

export default class PagosPendientes extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            openModalGasto: false,
            gastos: '', expensas: '',
            nombre: '', fecha: '', monto: 0, idRegistro: '',
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
        var pagos = firebase.database().ref('pagos').orderByChild('idDep').equalTo(this.props.params.idDep)
		pagos.on('value',(pagoSnapshot)=>{
			var pagosRealizados = []
			_.map(pagoSnapshot.val(),(value)=>{
				pagosRealizados = pagosRealizados.concat(value.codGastoEd)
			})
			console.log(pagosRealizados)
			firebase.database().ref('gastos').on('value',(snapshot)=>{
				that.setState({
					gastos: _.pick(snapshot.val(),(value,key)=>
						!(_.contains(pagosRealizados,key))
					)
				})
			})
		})
        /*firebase.database().ref('gastos').on('value',(snapshot)=>{
            this.setState({ gastos: snapshot.val() || ''})
        },this)*/
        firebase.database().ref('expensas').on("value",(snapshot) => {
			this.setState({ expensas: snapshot.val() || ''});
		},this );
    }
    render(){
        return(
            <div className='PagosPendientes'>
                <h3>Lista de Gastos</h3>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Expensa</th>
                            <th>Expensa</th>
                            <th>Empresa</th>
                            <th>Monto</th>
                            <th>Fecha Inicial</th>
                            <th>Fecha Limite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.gastos,(value,key)=>
                            <PagoPendiente gasto={value} gastoId={key}/>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class PagoPendiente extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            gasto:'',
            gastoId:'', showModalDelete: false,
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            gasto: that.props.gasto ||'',
            gastoId: that.props.gastoId || '',
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                gasto: nextProps.gasto ||'',
                gastoId: nextProps.gastoId || '',
            })
        }
    }
    render(){
        return(
            <tr>
                <td>{this.state.gastoId}</td>
                <td>{this.state.gasto.codExpensa || ''}</td>
                <td>{this.state.gasto.nombre || ''}</td>
                <td>{this.state.gasto.empresa || ''}</td>
                <td>{this.state.gasto.monto}</td>
                <td>{this.state.gasto.fechaInicial || this.state.gasto.fecha}</td>
                <td>{this.state.gasto.fechaLimite}</td>
            </tr>
        )
    }
}
import React, { Component } from 'react';
import _ from 'underscore'
import Link from 'react-router/lib/Link'
import { Grid, Table } from 'react-bootstrap';
import { Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'

export default class DetalleServicio extends React.Component{
    constructor(props){
        super(props)
        this.state={
            pagosExpensa:'',
            recibos: '',
            expensa: ''
        }
    }
    componentWillMount(){
        var that = this
        var llavesRecibos = []
        firebase.database().ref('recibos').orderByChild('idDep').equalTo(this.props.params.idDep).on('value',(recSnapshot)=>{
            var recibos = recSnapshot.val()
            console.log(recibos)
            var llavesRecibos = []
            _.map(recibos,(rec, keyRec)=>{
                llavesRecibos = llavesRecibos.concat(keyRec)
            })
            console.log(llavesRecibos)
            firebase.database().ref('pagos').orderByChild('codExpensa').equalTo(this.props.params.idServicio).on('value',(snapshot)=>{
                console.log(snapshot.val())
                var pagosExpensa = _.pick(snapshot.val(), (pago)=>{
                    return _.contains(llavesRecibos, pago.idRecibo)
                })
                console.log(pagosExpensa)
                that.setState({
                    pagosExpensa: pagosExpensa
                })
            })
        })
        firebase.database().ref('expensas').child(this.props.params.idServicio).on('value',(snapshot)=>{
            that.setState({expensa: snapshot.val() || ''})
        })
    }
    render(){
        return(
            <div className='DetalleServicio'>
                <h4>Pagos del servicio <b>{this.state.expensa.nombreExpensa}</b> de la empresa <b>{this.state.expensa.empresaProv}</b></h4>
                <h4>Usuario: <b>{this.props.params.userId}</b> Departamento: <b>{this.props.params.idDep}</b></h4>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Id recibo</th>
                            <th>Fecha de pago</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.pagosExpensa,(value,key)=>
                            <tr>
                                <td>{key || ''}</td>
                                <td>{value.idRecibo || ''}</td>
                                <td>{value.fecha || ''}</td>
                                <td>{value.costoExpensa || ''}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}
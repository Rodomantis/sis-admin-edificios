import React from 'react';

import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table, Image } from 'react-bootstrap';

export default class Info extends React.Component{
    render(){
        return(
            <div className='Info' style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h3>Dirección</h3>
                        <Row>
                            <Col xs={0} sm={0} md={3} lg={3}/>
                            <Col xs={12} sm={12} md={6} lg={6}>
                            <Image responsive src="http://new.ucatec.edu.bo/ucatec/img/mapucatecstatic.png" rounded />
                            </Col>
                            <Col xs={0} sm={0} md={3} lg={3}/>
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <h3>Contacto</h3>
                        <h4>Correo Webmaster</h4>
                        <p>rodobenjo@gmail.com</p>
                        <h4>Telefono Celular</h4>
                        <p>71471729</p>
                        <h4>Telefono Fijo</h4>
                        <p>4713467</p>
                    </Col>
                </Row>
            </div>
        )
    }
}
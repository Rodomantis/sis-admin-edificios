import React, { Component } from 'react';

export default class NoMatch extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                <h1>404</h1> 
                <h3>No se encuentra la pagina</h3>
            </div>
        );
    }
}
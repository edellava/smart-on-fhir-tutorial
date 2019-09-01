/*jshint esversion: 6 */
import React, { Component } from 'react';
import { MedItem } from './MedItem';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table'

class Meds extends Component {
    
    
    render() {
        return (
            <div>
                <Table striped bordered hover size="sm" >
                    <thead style={headStyle}>
                        <tr>
                            <td>Medication Name</td>
                            <td>RxNorm</td>
                            <td>Status</td>
                            <td>DEA Schedule</td>
                            <td>Include in Contract</td>
                        </tr>
                    </thead>
                    <tbody> 
                        {this.props.meds.map((med) => (
                            <MedItem key={med.id} med={med} patient={this.props.patient} doctor={this.props.doctor} handler={this.props.handler}/>
                        ))} 
                    </tbody>
                </Table>
            </div>
        );
    }
}
const headStyle = {
    backgroundColor: '#5b5858',
    color: '#fff',
    cellPadding: '10'
}

Meds.propTypes = {
    meds: PropTypes.array.isRequired,
    patient: PropTypes.object.isRequired
}



export default Meds;
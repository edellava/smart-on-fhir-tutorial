import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table'

class PtInfo extends Component {
    render() {

        return (
            <div>
                <Table bordered variant='dark' size="sm">
                    <thead>
                        <tr>
                            <th colSpan="4" className='text-center'>
                                Patient Info
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> Name: </td>
                            <td> {this.props.patient.name}</td>
                        </tr>
                        <tr>
                            <td>Sex: </td>
                            <td>{this.props.patient.gender}</td>
                        </tr>
                        <tr>
                            <td>Birthdate: </td>
                            <td>{this.props.patient.birthdate}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }
}

PtInfo.propTypes = {
    patient: PropTypes.object.isRequired
}


const cellStyle = {
    textAlign: 'center'
}

export default PtInfo;
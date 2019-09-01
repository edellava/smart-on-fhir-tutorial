import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import ReactDOM from 'react-dom';
//import {MyDoc} from './MyDoc';
//import { PDFDownloadLink } from '@react-pdf/renderer';
import 'bootstrap/dist/css/bootstrap.min.css';
//import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
//import FormControl from 'react-bootstrap/FormControl'





export class MedItem extends Component {
    state = {
        checked: true
    }

    getStyle = () => {
        return {
            color: this.props.med.status === 'active' ? '#000000' : '#bfbfbf',
            padding: '5px',
            border: '1px #000000 dotted',
            fontSize: '70%'
        }    
    }

    // printDocument = () => {
    //     let newDiv = document.createElement("div");
    //     ReactDOM.render(<MyDoc med={this.props.med} patient={this.props.patient} doctor={this.props.doctor}/>, document.getElementById('root'));  
    // }

   onClick = () => {

       this.state.checked ? this.setState({checked: false}) : this.setState({checked: true});
       this.props.handler(this.props.med.id)
       console.log(this.state.checked)
   }

   
    render() {
        return ( 
            
                <tr style={this.getStyle()} >
                    
                    <td>{this.props.med.name}</td>
                    <td>{this.props.med.id}</td>
                    <td>{this.props.med.status}</td>
                    <td>{this.props.med.schedule}</td>
                    <td>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onClick={this.onClick} type="checkbox" aria-label="checkbox" style={styles.checkbox} />
                        </Form.Group> 
                    </td>
                    
                   
                    
                </tr> 
             
        )
    }
}

const styles = {
    checkbox: {
        width: '150%',
        height: '150%',
    }
}
MedItem.propTypes = {
    med: PropTypes.object.isRequired
}


export default MedItem

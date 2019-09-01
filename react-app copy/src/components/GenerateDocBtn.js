import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import MyDoc from './MyDoc';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'


export default class GenerateDocBtn extends Component {
     
    printDocument = () => {
        let selectedMeds = this.props.meds.filter(med => med.selected===true)
        console.log("sekected meds", selectedMeds)
        if(selectedMeds.length > 0) {
            ReactDOM.render(<MyDoc meds={selectedMeds} patient={this.props.patient} doctor={this.props.doctor}/>, document.getElementById('root')); 
        } 
    }

    render() {
        return (   
            <div style={style} className="mb5">
                <OverlayTrigger trigger="focus" placement="right" overlay={popover}>
                    <Button size="lg" variant="primary" onClick={this.printDocument.bind(this)}>Generate Contract</Button>
                </OverlayTrigger>
            </div>   
        )
    }
}


const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        You must select at least one medication before generating a contract
      </Popover.Content>
    </Popover>
)

const style = {
    padding: 0,
    
}
import React from "react";
import { FormModal } from './FormModal';
import * as Constants from "../Constants"
import { Panel,Button,ButtonToolbar } from 'react-bootstrap';
import { ConfirmationModal } from "./ConfirmationModal";

export class Categories extends React.Component {
    constructor(){
        super();
        this.state = {
            editFormShow:false,
            deleteFormShow:false
        }
    }

    render() {
        console.log(this.props);
        let editFormShow = () => this.setState({ editFormShow: false });
        let deleteFormShow = () => this.setState({ deleteFormShow: false });
        return (
            <Panel>
            <Panel.Body>
            {this.props.data.category_name}
            <ButtonToolbar className="pull-right">
            <Button bsStyle="info" bsSize="small" onClick={() => this.setState({ editFormShow: true })}>
                Edit
            </Button>
            <Button bsStyle="info" bsSize="small" onClick={() => this.setState({ deleteFormShow: true })}>
                Delete
            </Button>

            <FormModal show={this.state.editFormShow} onHide={editFormShow} />
            <ConfirmationModal heading={Constants.DELETE_CATEGORY_HEADING} message={Constants.DELETE_CATEGORY_MESSAGE}
            show={this.state.deleteFormShow} onHide={deleteFormShow} />
            </ButtonToolbar>
            </Panel.Body>
            </Panel>
        );
    }
}
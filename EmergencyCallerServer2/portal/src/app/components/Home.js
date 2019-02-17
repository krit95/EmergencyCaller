import React from "react";
import { Categories } from "./Categories";
import { Items } from "./Items";
import { FormModal } from "./FormModal"
import * as Constants from "../Constants"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button,ButtonToolbar,PageHeader } from 'react-bootstrap';

export class Home extends React.Component {
    constructor(){
        super();
        this.state = {
            items:[],
            categories:[],
            addFormShow:false
        }
    }
    componentDidMount() {
        fetch(Constants.GET_CATEGORIES)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                this.setState({
                    categories:data.categories
                })
            }).catch((err) => {
                console.log(err)
            })
        fetch(Constants.GET_ITEMS)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                this.setState({
                    items:data.items
                })
            }).catch((err) => {
                console.log(err)
            })    
    }
    render() {
        let addFormShow = () => this.setState({ addFormShow: false });
        return (
            <div>
                <Tabs>
                    <TabList>
                        <Tab>Categories</Tab>
                        <Tab>Items</Tab>
                    </TabList>
                    <TabPanel>
                        <PageHeader>
                            Categories
                        <small>
                        <Button bsStyle="info" className="pull-right" onClick={() => this.setState({ addFormShow: true })}>
                            Add New Category
                        </Button>
                        </small>
                        </PageHeader>
                        <div>{this.state.categories.map(t =><Categories key={t._id} data={t} />)}</div>
                    </TabPanel>
                    <TabPanel>
                    <PageHeader>
                            Items
                        <small>
                        <Button bsStyle="info" className="pull-right" onClick={() => this.setState({ addFormShow: true })}>
                            Add New Item
                        </Button>
                        </small>
                        </PageHeader>
                        <div>{this.state.items.map(t => <Items key={t._id} data={t} />)}</div>
                    </TabPanel>
                </Tabs>
                <FormModal show={this.state.addFormShow} onHide={addFormShow} />
            </div>
        );
    }
}
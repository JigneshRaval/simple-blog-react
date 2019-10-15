// https://www.slightedgecoder.com/2017/12/03/loading-react-components-dynamically-demand/
// https://www.slightedgecoder.com/2018/10/28/loading-react-components-dynamically-on-demand-using-react-lazy/
// DEMO : https://codesandbox.io/s/qv743wwrr4

import React, { Component, Suspense } from 'react';
import NullView from './NullView';

import * as Views from './index';

// TableView Default data ( this can be passed from App level also )
const tableData = {
    labels: [
        '12am-3am',
        '3am-6am',
        '6am-9am',
        '9am-12pm',
        '12pm-3pm',
        '3pm-6pm',
        '6pm-9pm',
        '9pm-12am'
    ],

    datasets: [
        {
            title: 'Some Data',
            values: [25, 40, 30, 35, 8, 52, 17, -4]
        },
        {
            title: 'Another Set',
            values: [25, 50, -10, 15, 18, 32, 27, 14]
        },
        {
            title: 'Yet Another',
            values: [15, 20, -3, -15, 58, 12, -17, 37]
        }
    ]
};

class DynamicComponentServiceExm1 extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            loadedComponentsOld: [],
            componentsOld: [],
            loadedComponentsNew: [],
            componentsNew: []
        };
    }

    // Old way using import ( https://www.slightedgecoder.com/2017/12/03/loading-react-components-dynamically-demand/ )
    // ====================================
    addViewOld = async (viewName: string, data = {}) => {
        // Don't load more than once.
        if (this.state.loadedComponentsOld.includes(viewName)) return;

        console.log(`Loading ${viewName} view...`);

        import(`./${viewName}`)
            .then(Component => {
                console.log('Dynamic component Component : ', Component);
                this.setState({
                    loadedComponentsOld: this.state.loadedComponentsOld.concat(viewName),
                    componentsOld: this.state.componentsOld.concat(
                        <Component.default
                            key={Math.random()}
                            // data={this.props.data}
                            data={data}
                        />
                    )
                });
                console.log('Dynamic component state : ', this.state);
            })
            .catch(error => {
                console.log('Error in rendering dynamic component old way : ', error);
                this.setState({
                    loadedComponentsOld: this.state.loadedComponentsOld.concat(viewName),
                    componentsOld: this.state.componentsOld.concat(
                        <NullView key={Math.random()} />
                    )
                });
            });
    }

    handleShowTableChangeOld = async (event: any) => {
        await this.addViewOld('TableView', tableData);
    }

    handleShowGraphChangeOld = async (event: any) => {
        await this.addViewOld('GraphView');
    }

    handleNullGraphChangeOld = async (event: any) => {
        await this.addViewOld('NullView');
    }

    // NEW WAY using React.Lazy and Suspense (https://www.slightedgecoder.com/2018/10/28/loading-react-components-dynamically-on-demand-using-react-lazy/)
    // ====================================
    addView = async (viewName: string, componentData = {}) => {
        const { loadedComponentsNew } = this.state;

        // Don't load more than once.
        if (loadedComponentsNew[viewName]) return;

        const View = Views[viewName];
        const key = Math.random();
        const data = this.props.data || componentData;

        const component = View ? (
            <View key={key} data={data} />
        ) : (
                <Views.NullView key={key} />
            );

        this.setState((prevState: any) => ({
            componentsNew: [...prevState.componentsNew, component],
            loadedComponentsNew: { ...prevState.loadedComponentsNew, [viewName]: true }
        }));
    }

    handleShowTableChange = async (event: any) => {
        await this.addView('TableView', tableData);
    }

    handleShowGraphChange = async (event: any) => {
        await this.addView('GraphView');
    }

    handleNullGraphChange = async (event: any) => {
        await this.addView('NullView');
    }

    render() {
        const { componentsOld, componentsNew } = this.state;

        return (
            <div className="App">
                <h2>Old Way : using import method</h2>
                <p><a href="https://www.slightedgecoder.com/2017/12/03/loading-react-components-dynamically-demand/" target="_blank">Loading React Components Dynamically on Demand</a></p>

                <div className="buttons">
                    <div>
                        <button id="table" onClick={this.handleShowTableChangeOld}>Show Table Old way</button>
                        <button id="graph" onClick={this.handleShowGraphChangeOld}>Show Graph Old way</button>
                        <button id="null" onClick={this.handleNullGraphChangeOld}>Not yet implemented Old way...</button>
                    </div>
                </div>
                <div className="views">
                    {componentsOld.length === 0 ? (
                        <div>Nothing to display...</div>
                    ) : (
                            componentsOld
                        )}
                </div>

                <h2>New Way : using Suspense and Lazy method</h2>
                <p><a href="https://www.slightedgecoder.com/2018/10/28/loading-react-components-dynamically-on-demand-using-react-lazy/" target="_blank">Loading React Components Dynamically on Demand using React.lazy</a></p>

                <div className="buttons">
                    <div>
                        <button id="table" onClick={this.handleShowTableChange}>Show Table New Way</button>
                        <button id="graph" onClick={this.handleShowGraphChange}>Show Graph New Way</button>
                        <button id="null" onClick={this.handleNullGraphChange}>Not yet implemented New Way...</button>
                    </div>
                </div>
                <div className="views">
                    <Suspense fallback={<div>Loading a view</div>}>
                        {componentsNew.length === 0 ? (
                            <div>Nothing to display...</div>
                        ) : (
                                componentsNew
                            )}
                    </Suspense>
                </div>
            </div>
        );
    }
}

export default DynamicComponentServiceExm1;

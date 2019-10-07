import React, { Component } from "react";

import NullView from "./NullView.component";

class DynamicComponentService extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            loadedComponents: [],
            components: []
        };
    }

    addView = async (viewName: any) => {
        // Don't load more than once.
        if (this.state.loadedComponents.includes(viewName)) return;

        console.log(`Loading ${viewName} view...`);

        import(`./views/${viewName}.js`)
            .then(Component => {
                this.setState({
                    loadedComponents: this.state.loadedComponents.concat(viewName),
                    components: this.state.components.concat(
                        <Component.default
                            key={Math.random()}
                            data={this.props.data}
                        />
                    )
                });
            })
            .catch(error => {
                this.setState({
                    loadedComponents: this.state.loadedComponents.concat(viewName),
                    components: this.state.components.concat(
                        <NullView key={Math.random()} />
                    )
                });
            });
    };

    handleShowTableChange = async (event: any) => {
        await this.addView("TableView");
    };

    handleShowGraphChange = async (event: any) => {
        await this.addView("GraphView");
    };

    handleNullGraphChange = async (event: any) => {
        await this.addView("NullView");
    };

    render() {
        const { components } = this.state;

        return (
            <div className="App">
                <div className="buttons">
                    <div>
                        <button id="table" onClick={this.handleShowTableChange}>Show Table</button>
                    </div>
                    <div>
                        <button id="graph" onClick={this.handleShowGraphChange}>Show Graph</button>
                    </div>
                    <div>
                        <button id="null" onClick={this.handleNullGraphChange}>Not yet implemented...</button>
                    </div>
                </div>
                <div className="views">
                    {components.length === 0 ? (
                        <div>Nothing to display...</div>
                    ) : (
                            components
                        )}
                </div>
            </div>
        );
    }
}

export default DynamicComponentService;

import React from 'react';

class DynamicCompExample2 extends React.Component {

    // constructor(props) {
    //     super(props);
    //     this.state = { module: null };
    // }

    /* Sets the state to save the dynamic component when needed */
    state: any = {
        DynamicComponent: null
    };

    /*
     * Function to be called onClick event.
     * Waits for the import to be completed and stores the default exported
     * value in the state so we can rendered when needed.
     */
    // Method 1 : add component using onclick event
    handleOnClick = async () => {
        const DynamicComponent = await import('./DynamicComponent');

        this.setState({
            DynamicComponent: DynamicComponent.default
        });
    }

    /**
     * <Dynamic path='./App' />
     */
    // Method 2 : add component dynamically on component mount
    /* componentDidMount() {
        const { path }: any = this.props;
        import(`${path}`)
            .then(module => this.setState({ module: module.default }))
    } */

    // Method 3 : add component dynamically on any event like onclick
    /* getComponent = async () => {
        const { default: module } = await import('./DynamicComponent');
        const element = document.createElement('div');
        element.innerHTML = module.render();
        return element;
    } */

    render() {
        /* Gets the dynamically imported component */
        const { DynamicComponent } = this.state;
        // const { module: Component } = this.state;

        return (
            <header className="header">

                {/* Calls the function needed onClick */}
                <div
                    onClick={this.handleOnClick}>
                    Load Github!
                </div>

                <nav>
                    {/* Waits for the component to exist and renders it */}
                    {DynamicComponent && <DynamicComponent />}
                </nav>

            </header>
        );
    }
}

export default DynamicCompExample2;

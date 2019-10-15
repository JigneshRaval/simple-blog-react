// https://codeburst.io/dynamic-imports-react-and-redux-29f6d2d88d77

import React from 'react';
import PropTypes from 'prop-types';

export class LazyLoadModule extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            module: null
        };
    }

    componentDidCatch(error: any) {
        this.setState({ hasError: error });
    }

    async componentDidMount() {
        try {
            const { resolve } = this.props;
            const { default: module } = await resolve();
            this.setState({ module });
        } catch (error) {
            this.setState({ hasError: error });
        }
    }

    render() {
        const { module, hasError }: any = this.state;

        if (hasError) return <div>{hasError.message}</div>;
        if (!module) return <div>Loading module...</div>;

        if (module.view) return React.createElement(module.view);

        return <div>Module loaded</div>;
    }
}
/*
LazyLoadModule.propTypes = {
    resolve: PropTypes.func
};
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function AssistiveText({ text }: any) {
    if (text) {
        return <span>{text}</span>;
    }
    return null;
}

AssistiveText.propTypes = {
    text: PropTypes.string,
};

AssistiveText.defaultProps = {
    text: undefined,
};

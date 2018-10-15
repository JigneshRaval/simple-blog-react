import React from 'react';

const HOC = (WrappedComponent: any) => (props: any) => {
    console.log('HOC Props : ', props);
    return (
        <div>
            <WrappedComponent {...props}>
                {props.children.toUpperCase()}
            </WrappedComponent>
        </div>
    )
}

export default HOC;

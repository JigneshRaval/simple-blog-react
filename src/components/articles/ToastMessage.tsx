// Example of useState
import React, { useState, useEffect } from "react";


const ToastMessage = (props: any) => {
    const [isToastVisible, setToastVisibility] = useState(false);

    useEffect(() => {
        // componentDidMount
        setToastVisibility(true);

        if (!props.isConfirm) {
            setTimeout(() => {
                setToastVisibility(false);
            }, 3000);
        }

        // componentWillUnmount
        const cleanUp = () => {

        }
    }, [props.displayToastMessage]);

    const hideToastMessage = () => {
        setToastVisibility(false);
    }

    const cancelDelete = (event: any) => {
        event.preventDefault();
        props.onConfirm();
        setToastVisibility(false);
        return false;
    }

    return (
        <React.Fragment>
            {
                isToastVisible ? <div className={'alert alert-' + props.toastMessageType}>
                    {/* <a className="uk-alert-close" uk-close="true">&times;</a> */}
                    <h3>{props.toastMessageType}</h3>
                    <p>{props.children}</p>
                    {
                        props.isConfirm ? <React.Fragment><button className="btn btn-default" onClick={e => cancelDelete(e)}>Yes</button> <button className="btn btn-primary" onClick={hideToastMessage}>No</button></React.Fragment> : null}
                </div> : null
            }
        </React.Fragment>
    )
}


export default ToastMessage;

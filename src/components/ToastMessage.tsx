import React, { useState } from "react";


const ToastMessage = (props: any) => {
    const [isToastVisible, setToastVisibility] = useState(props.displayToastMessage);

    const showToast = (event: any) => {
        event.preventDefault()
        setToastVisibility(true);
        setTimeout(() =>
            setToastVisibility(false)
            , 3000)
    }

    return (
        <React.Fragment>
            {
                isToastVisible ? <div uk-alert="{'duration': 150}">
                    <a className="uk-alert-close" uk-close>&times;</a>
                    <h3>Notice</h3>
                    <p>{props.children}</p>
                </div> : null
            }
        </React.Fragment>
    )
}


export default ToastMessage;

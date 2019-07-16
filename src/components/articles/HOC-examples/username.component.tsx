import React from 'react';

const UserName = (props: any) => {
    console.log('HOC Child Props : ', props);
    return <div>{props.children}</div>
}

export default UserName;

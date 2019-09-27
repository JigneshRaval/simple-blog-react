import React from 'react';

import TagsInline from '../shared/Tags-Inline.component';

const ActionMenu = (props: any) => (
    <div className="card-controls dropdown">
        <button className="btn btn-link" type="button" id={'dropdownMenuButton_' + props.data._id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="cc-bx-dots-vertical-rounded"></i><span className="sr-only">Action Menu</span></button>
        <div className="dropdown-menu" aria-labelledby={'dropdownMenuButton_' + props.data._id}>
            <ul className="">
                <li className="dropdown-header">Actions</li>
                <li className="dropdown-item"><a href="javascript:void(0);" data-toggle="modal" data-target={'#modal-' + props.type} onClick={() => props.onEditRecord(props.data._id, true)}><i className="cc-bx-pencil"></i> Edit {props.title}</a></li>
                <li className="dropdown-item"><a href="javascript:void(0);" onClick={() => props.onAddToastMessage('warning', `Are you sure you want to delete this record?.`, true, props.data._id)}><i className="cc-bx-trash"></i> Delete {props.title}</a></li>
                <li className="dropdown-item"><a href="javascript:void(0);" onClick={() => props.markAsFavorite(props.data._id, props.data.favorite)} data-favorite={props.data.favorite}><i className="cc-bx-star"></i> Mark as Favorite</a></li>
                <li className="dropdown-header">Tags</li>
                <TagsInline data={props.data} onFilterRecords={props.onFilterRecords} className={'dropdown-item'} />
                <li className="dropdown-item"><button className="btn btn-primary" onClick={(event) => props.onFilterRecords(event, 'all')}><i className="cc-bx-x-circle"></i> Clear filter</button></li>
            </ul>
        </div>
    </div>
);

export default ActionMenu;



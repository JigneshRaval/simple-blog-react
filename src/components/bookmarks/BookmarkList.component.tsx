import React, { useState, useEffect } from "react";
import BookmarkListItem from './BookmarkListItem.component';
import LoadingSpinner from '../shared/LoadingSpinner';

const BookmarksList = (props: any) => {

    const { filteredRecords, loading } = props;

    return (
        <div className="post-list__wrapper" >
            <div className="uk-flex uk-flex-column">
                {
                    loading ? <LoadingSpinner text={'Loading bookmarks...'} /> : filteredRecords && filteredRecords.length > 0 ?
                        filteredRecords.map((record: any, index: number) => {
                            return (
                                <BookmarkListItem
                                    key={index}
                                    bookmark={record}
                                    index={index}
                                    {...props} />
                            )
                        }) : <div className="message-no-article">Sorry, No article found</div>
                }
            </div>
        </div>
    );
}

export default BookmarksList;

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.

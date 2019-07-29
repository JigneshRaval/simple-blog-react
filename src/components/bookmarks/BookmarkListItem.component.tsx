// Bookmark-List-Item.component.tsx

// Single item in the list

// REACT
// ==========================
import React, { useEffect } from 'react';
// import { Link } from "react-router-dom";

// COMPONENTS
// ==========================
import TagsInline from '../shared/Tags-Inline.component';


const BookmarkListItem = (props: any) => {

    // console.log('Bookmark list item props :', props);

    // IMP : Added this to not render whole list every time when user clicks on any bookmark from left navigation
    // or any new bookmark added or deleted, or filtering or serching bookmarks
    useEffect(() => {
        // console.log('activeTab : ', props);
    }, []);

    const { bookmark, onDeleteBookmark, onEditBookmark, onFilterBookmarks, markAsFavorite, activeTab, index, onAddToastMessage } = props;

    return (
        <div className={"uk-card uk-card-default" + (activeTab === index ? ' active' : '')} key={bookmark._id}>

            <div className="card" data-category={bookmark.category}>
                <div className="card-controls uk-inline">
                    <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                    <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                        <ul className="uk-nav uk-dropdown-nav">
                            <li className="uk-nav-header">Actions</li>
                            <li className="uk-active"><a href="javascript:void(0);" onClick={() => onEditBookmark(bookmark._id, true)}><span uk-icon="pencil"></span> Edit Bookmark</a></li>
                            <li><a href="javascript:void(0);" onClick={() => onAddToastMessage('warning', `Are you sure you want to delete this bookmark?.`, true, bookmark._id)}><span uk-icon="trash"></span> Delete Bookmark</a></li>
                            <li><a href="javascript:void(0);" onClick={() => markAsFavorite(bookmark._id, bookmark.favorite)} data-favorite={bookmark.favorite}><span uk-icon="star"></span> Mark as Favorite</a></li>
                            <li className="uk-nav-header">Tags</li>
                            <TagsInline data={bookmark} onFilterBookmarks={props.onFilterBookmarks} />
                            <li><a href="javascript:void(0);" onClick={(event) => onFilterBookmarks(event, 'all')}>Clear filter</a></li>
                        </ul>
                    </div>
                </div>

                <div className="card-header">
                    {
                        bookmark.favorite ? <span className="isFavorite" aria-label="favorite"><i className="corner"></i><i className="icon ion-ios-star"></i></span> : ''
                    }
                    <div className="bookmark-category"><span className="small-dot" data-category={bookmark.category.toLowerCase()}></span>{bookmark.category}</div>
                    <h2 className="uk-card-title">
                        <a href={bookmark.sourceUrl} target="_blank" bookmark-id={bookmark._id} >{bookmark.title}</a>
                    </h2>
                    <a
                        target="_blank"
                        href={bookmark.sourceUrl.split('/')[0] + "//" + bookmark.sourceUrl.split('/')[2]}
                        style={{ textTransform: 'uppercase' }}>{bookmark.sourceUrl.split('/')[2]}</a>
                    <p>{bookmark.description}</p>
                </div>

                <div className="card-footer">
                    <div>

                    </div>
                </div>
            </div>

        </div>
    );

}

export default BookmarkListItem;

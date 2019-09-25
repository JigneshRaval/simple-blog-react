import React, { useRef } from 'react';
import ArticleContext from '../../services/context';

const SearchComponent = (props: any) => {
    let timer: any;
    const { onFilterRecords } = props;

    const inputRef = useRef();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // console.log(event)
    }

    const filterArticles = (event: any, type: string) => {
        event.persist();
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            onFilterRecords(event, type);
        }, 1000);
    }



    return (

        <React.Fragment>

            <form className="search-form" onSubmit={handleSubmit}>
                <label className="visually-hidden" htmlFor="searchBar">Search articles by Title, Tag or Category</label>
                <input className="form-control search-form-input" name="searchBar" id="searchBar" type="text" placeholder="Search articles by Title, Tag or Category" onChange={(event) => filterArticles(event, 'search')} ref={inputRef} aria-label="Search" />

                <button type="button" className="close clear-search" data-dismiss="modal" aria-label="Close" onClick={(event) => { (inputRef.current as HTMLInputElement).value = ''; filterArticles(event, 'all') }} title="Click this button to clear search results.">
                    <span aria-hidden="true">&times;</span>
                </button>
            </form>

            {/* <button className="ad2hs-prompt uk-button uk-button-primary">Add to Home</button> */}

        </React.Fragment>

    );
}

export default SearchComponent;

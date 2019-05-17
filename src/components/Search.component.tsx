import React, { useRef } from 'react';
import ArticleContext from '../services/context';

const SearchComponent = (props: any) => {
    const inputRef = useRef();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(event)
    }

    const { onFilterArticles } = props;

    return (

        <React.Fragment>

            <form className="uk-search uk-search-default uk-width-1-1" onSubmit={handleSubmit}>
                <span uk-search-icon=""></span>
                <input className="uk-search-input" name="searchBar" id="searchBar" type="text" placeholder="Search articles by Title, Tag or Category" onKeyDown={(event) => onFilterArticles(event, 'search')} ref={inputRef} />

                <button type="button" className="close clear-search" data-dismiss="modal" aria-label="Close" onClick={(event) => { (inputRef.current as HTMLInputElement).value = ''; onFilterArticles(event, 'all') }} title="Clear Search">
                    <span aria-hidden="true">&times;</span>
                </button>
            </form>

            <button className="ad2hs-prompt uk-button uk-button-primary">Add to Home</button>

        </React.Fragment>

    );
}

export default SearchComponent;

import React from 'react';
import ArticleContext from '../services/context';

const SearchComponent = (props: any) => {
    return (
        <ArticleContext.Consumer>
            {
                ({ actions }) => (
                    <React.Fragment>

                        <form className="uk-search uk-search-default uk-width-1-1">
                            <span uk-search-icon=""></span>
                            <input className="uk-search-input" name="searchBar" id="searchBar" type="text" placeholder="Search articles by Title, Tag or Category" onChange={(event) => actions.onFilterArticles(event, 'search')} />

                            <button type="button" className="close clear-search" data-dismiss="modal" aria-label="Close" onClick={(event) => { (event.target as HTMLInputElement).value = ''; actions.onFilterArticles(event, 'all') }} title="Clear Search">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </form>

                        <button className="ad2hs-prompt uk-button uk-button-primary">Add to Home</button>

                    </React.Fragment>
                )
            }

        </ArticleContext.Consumer>
    );
}

export default SearchComponent;

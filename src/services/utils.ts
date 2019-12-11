// utils.ts
// ==============================

// Utility functions
import {
    APP_ROOT,
    JQUERY,
    BOOTSTRAP_CSS,
    BOOTSTRAP_JS,
    HANDLEBARS,
    REQUIRE_METHOD,
    BABEL,
    BABEL_PRESET_ENV,
    REACT,
    VUEJS,
    SCSS,
    RXJS_5,
    RXJS_6,
    rxjsOutputStyle,
    rxjsOutputScript,
    CODEMIRROR_CONTENT
} from './demo-contants';

declare var $: any;

let codeMirror: any;
let preview: any;
let previewFrame: any;
let _template = 'JavaScript';

class Utils {
    scrollDuration: number = 250;
    lastScrollTop: number = 0;
    delta = 5;
    scrollTimer: any;
    timer: any;
    highlightColors = ['#ff6', '#a0ffff', '#9f9', '#f99', '#f6f'];

    constructor() {
        this.init();
    }

    public init() {
        // show header if mouse reaches near to top browser border
        document.addEventListener('mousemove', function (e) {
            if (e.clientY < 10) {
                document.body.classList.remove('shrinkHeader');
            }
        });
    }

    public scrollToTop(element: any) {
        let scrollStep = -window.scrollY / (this.scrollDuration / 15);

        let scrollInterval = setInterval(function () {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 5);
    }

    public handleScrollEvent = () => {
        // let timer: any;
        let scrollElement = document.querySelector('#scrollToTop');

        window.addEventListener('scroll', () => {
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer);
            }
            this.scrollTimer = setTimeout(() => {
                this.getScrollPosition(scrollElement);
            }, 250);
        }, false);

    }

    /**
     * @function : Scroll to top with smooth animation using javascript only
     * @param event
     */
    public getScrollPosition(scrollElement: any) {
        let scrollTop = window.pageYOffset;

        if (scrollTop > 300) {
            scrollElement.classList.add('isVisible');
        } else {
            scrollElement.classList.remove('isVisible');
        }

        // Ref: https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c
        // Make sure they scroll more than delta ( delta = 5 )
        if (Math.abs(this.lastScrollTop - scrollTop) <= this.delta) {
            return;
        }

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is 'behind' the navbar.
        // header height = 96px
        if (scrollTop > this.lastScrollTop && scrollTop > 96) {
            // Scroll Down
            document.body.classList.add('shrinkHeader');
        } else {
            // Scroll Up
            if (scrollTop + window.innerHeight < document.body.offsetHeight) {
                document.body.classList.remove('shrinkHeader');
            }
        }

        // console.log('scrollTop =', scrollTop, ' this.lastScrollTop =', this.lastScrollTop)
        this.lastScrollTop = scrollTop;
    }


    /**
     * @function : Toggle Sidebar Navigation
     * @param event
     */
    public toggleSidebarPanel(event: any) {
        const bodyElem = document.querySelector('body');
        if (bodyElem) {
            if (bodyElem.classList.contains('isIndexNavOpened')) {
                // Left sidebar navigation closed
                bodyElem.classList.remove('isIndexNavOpened');
                this.updateLocalStorage('isIndexNavOpened', 'false');
            } else {
                bodyElem.classList.add('isIndexNavOpened');
                this.updateLocalStorage('isIndexNavOpened', 'true');
            }
        }
    }


    public generatePagination() {
        $('.pagination-holder').jPages({
            containerID: 'postList',
            perPage: 8,
            startPage: 1,
            startRange: 1,
            midRange: 5,
            endRange: 1,
            minHeight: false,
        });
    }

    public updateLocalStorage(key: any, value: any) {
        if ('localStorage' in (<any>window) && (<any>window)['localStorage'] !== null) {
            localStorage.setItem(key, value);
        }
    }

    /**
     * @function : Toggle settings dropdown in header section
     * @param event
     */
    public toggleDropdown(event: any) {
        let node = event.currentTarget.nextElementSibling;

        if (event.target.classList.contains('isActive')) {
            event.target.classList.remove('isActive');
            node.classList.remove('dropdown-active');
        } else {
            event.target.classList.add('isActive');
            node.classList.add('dropdown-active');
        }
    }


    public toggleGrid() {
        let body = document.querySelector('body');
        if (body) {
            if (!body.classList.contains('showVerticalGrid')) {
                body.classList.add('showVerticalGrid');
            } else {
                body.classList.remove('showVerticalGrid');
            }
        }
    }

    /**
     * Function to filter Articles by search value and filterBy type
     * @param event : object - Provide search value
     * @param filterBy : string - provide filterBy value like filterBy tags, category, all, search
     * @param articles : Array - List of all Articles to be filtered.
     */
    public filterArticles(event: any, filterBy: string, articles: any) {
        let searchTerm = event.target.value || event.target.getAttribute('data-tag-name');
        let searchBarElem = document.querySelector('.uk-search-default');
        let searchBox = document.querySelector('.uk-search-input');

        event.target.parentElement.classList.add('active');
        if (searchBox) {
            // (searchBox as HTMLInputElement).value = searchTerm;
        }

        if (searchTerm) {
            if (searchBarElem) {
                searchBarElem.classList.add('isSearching');
            }

            // If 'searchTerm' provided then, Set filtered articles in the state
            // this.setState({ filteredArticles: filteredList });

            return this.filterArticlesBy(searchTerm, filterBy, articles);
        } else {

            // Hide clear search icon
            if (searchBarElem) {
                searchBarElem.classList.remove('isSearching');
            }

            // If 'searchTerm' NOT provided then, Set default articles list into the filtered articles in the state
            // this.setState({ filteredArticles: this.state.articles });

            return articles;

        }
    }

    /**
     * Function to filter Articles by search value and filterBy type
     * @param searchTerm : string - Provide search value
     * @param filterBy : string - provide filterBy value like filterBy tags, category, all, search
     * @param articles : Array - List of all Articles to be filtered.
     */
    public filterArticlesBy(searchTerm: string, filterBy: string, articles: any) {
        let searchBy: string = '';
        let keywords = searchTerm.replace(/(to |the )/gi, '');
        if (searchTerm.indexOf(':') !== -1) {
            searchBy = searchTerm.split(':')[0];
            keywords = keywords.split(':')[1];
        }
        let pattern2 = `((?=.*\\b${keywords}\\b)|(${keywords.split(' ').join('|')}))`;
        let articleBySearch: Array<any> = [];

        switch (filterBy) {
            // Method 1: filter articles either by tags, category or by title which is matching with search term
            case 'search':
                let t0 = performance.now();

                if (searchBy.toLowerCase() === 'title') {
                    articleBySearch = this.filterList(keywords, articles);
                } else {
                    articles.map((article: any) => {
                        let allKeywordsMatch = true;

                        if (article.title.toLowerCase().search(new RegExp(pattern2, 'gi')) === -1 || article.htmlCode.toLowerCase().search(new RegExp(pattern2, 'gi')) === -1) {
                            allKeywordsMatch = false;
                        } else {
                            allKeywordsMatch = true;
                        }

                        // keywords.map((keyword) => {
                        /* if (article.title.toLowerCase().indexOf(keyword.toLowerCase()) === -1 && article.htmlCode.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
                            allKeywordsMatch = false;
                        } */

                        /* if (article.tags.some((tag: string) => tag.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)) {
                            allKeywordsMatch = true;
                        } else {
                            if (article.title.toLowerCase().indexOf(keyword.toLowerCase()) === -1 && article.category.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
                                allKeywordsMatch = false;
                            }
                        } */
                        // });

                        if (allKeywordsMatch) articleBySearch.push(article);
                    });
                }

                let t1 = performance.now();
                console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to filter records :', articleBySearch);

                return [...articleBySearch];

            // Method 2: filter articles by tags matching with search term
            case 'tag':
                let articleByTags = articles.filter(({ tags }: any) => {
                    return tags.some((tag: any) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                });

                return [...articleByTags];

            // Method 3: filter articles by tags matching with search term
            case 'category':
                let articlesByCategory = articles.filter(({ category }: any) => {
                    return category.toLowerCase().includes(searchTerm.toLowerCase());
                });

                return [...articlesByCategory];

            // Method 4: reset all the filters and display all the articles.
            case 'all':
                return [...articles];

            // TODO : Remove or update if required
            default:
                return articles.map((article: any) => {
                    if (article[filterBy].indexOf(searchTerm) > -1) {
                        // filteredList.push(article);
                    }
                });
        }
    }

    // USAGE : filterList(this.state.q, this.state.list);
    // https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
    public filterList(searchTerm: string, articles: any) {
        function escapeRegExp(s: any) {
            return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        }
        const words = searchTerm
            // .toLowerCase()
            .split(/\s+/g)
            .map(s => s.trim())
            .filter(s => !!s);

        const hasTrailingSpace = searchTerm.endsWith(' ');

        const searchRegex = new RegExp(
            words
                .map((word, i) => {
                    if (i + 1 === words.length && !hasTrailingSpace) {
                        // The last word - ok with the word being "startswith"-like
                        return `(?=.*\\b${escapeRegExp(word)})`;
                    } else {
                        // Not the last word - expect the whole word exactly
                        return `(?=.*\\b${escapeRegExp(word)}\\b)`;
                    }
                })
                .join('') + '.+',
            'gi'
        );

        console.log('searchRegex :', searchRegex);

        return articles.filter((item: any) => {
            // console.log('Matched :', searchRegex.test(item.title) ? item.title : null);
            return searchRegex.test(item.title);
        });
    }

    public filterListByTitle(searchTerm: string, articles: any) {
        return articles.filter((article: any) => {
            return article.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });
    }

    // TODO: Need further improvements, this is not efficient
    public highlightSearchTerms() {
        let searchPara = document.querySelector('.article__content > article').innerHTML;
        searchPara = searchPara.toString();
        let searchTerm = document.querySelector('.search-form-input');
        const rand = this.highlightColors[Math.floor(Math.random() * this.highlightColors.length)];

        let terms = searchTerm && searchTerm.value.trim();
        if (terms) {
            terms = terms.replace(/(to |the |with )/gi, '');
            let pattern2 = `((${terms})|(${terms.split(' ').join('|')}))`;
            let highlighted = searchPara.replace(new RegExp(pattern2, 'gi'), (match: any) => `<mark class="highlight-search" style="background-color:${rand}">${match}</mark>`);
            document.querySelector('.article__content > article').innerHTML = highlighted;
        }
    }

    public formatDate(dateFormat: any, separator: string, date: any) {
        let formattedDate,
            locale = 'en-us';
        let dt = new Date(date);
        let day = dt.getDate();
        let month = dt.toLocaleString(locale, { month: 'long' });
        let year = dt.getFullYear();

        switch (dateFormat) {
            case 'dd/mm/yyyy':
                formattedDate = `${day}${separator}${month}${separator}${year}`;
            default:
                formattedDate = `${month} ${day}, ${year}`;
        }
        return formattedDate;
    }

    public getUniqueCategories = (articles: any) => {
        let uniqueCategories = articles.reduce((uniqCats: any, article: any) => {
            if (uniqCats.indexOf(article.category) === -1) {
                uniqCats.push(article.category);
            }
            return uniqCats;
        }, []);

        // OUTPUT : ['JavaScript', 'React', ...]
        return uniqueCategories;
    }

    // Clean HTML tags by removing Class, ID and Style attributes
    sanitizeHtml(html: any) {

        html.querySelectorAll('*').forEach((node: any) => {

            if ((node.parentElement && node.parentElement.nodeName !== 'PRE') || (node.parentElement && node.parentElement.nodeName !== 'CODE')) {
                node.removeAttribute('id');
                node.removeAttribute('class');
                node.removeAttribute('style');
                node.removeAttribute('name');
            }

            if (node.nodeName === 'PRE') {
                node.classList.add('code-candy');
            }

            if (node.nodeName === 'A') {
                // When you use target="_blank" for external site link in your web page content,
                // then always include rel = "noopener" or rel = "noreferrer" attribute.
                // rel="noopener" : prevents the new page from being able to access the window.opener property and ensures it runs in a separate process.
                // rel="noreferrer" : attribute has the same effect, but also prevents the Referer header from being sent to the new page. See Link type "noreferrer".
                node.setAttribute('rel', 'noopener noreferrer nofollow');
                node.setAttribute('target', '_blank');
            }

            // Remove empty nodes
            if (node.textContent.trim() === '') {
                // node.parentElement.removeChild(node);
            }

            if (node.nodeName === 'SCRIPT' || node.nodeName === 'LINK') {
                if (node.parentElement) {
                    node.parentElement.removeChild(node);
                }
            }

        });

        return html.innerHTML;
    }

    public extractCleanCode(parent: any, content: any, type: string, selector: string = 'iframe') {
        switch (type) {
            case 'github':
                let iFrames = parent.querySelectorAll(selector); // Select all iFrame elements
                let figures = parent.querySelectorAll('figure.graf--iframe'); // Select all iFrame parent Elements

                if (parent) {
                    if (iFrames && iFrames.length > 0) {
                        // Loop through all the iFrames
                        for (let i = 0, len = iFrames.length; i < len; i++) {
                            let preNode = document.createElement('pre');
                            let codeNode = document.createElement('code');

                            let contDoc = iFrames[i].contentDocument || iFrames[i].contentWindow && iFrames[i].contentWindow.document || iFrames[i];

                            if (contDoc) {
                                let iframeContent = contDoc.querySelector('table') && contDoc.querySelector('table').innerText || contDoc.querySelector('table') && contDoc.querySelector('table').textContent || contDoc.innerText;

                                codeNode.innerText = iframeContent.replace(/</ig, '&lt;');
                                preNode.appendChild(codeNode);
                                // replace all iFrame parent nodes with the new <pre> tags
                                // iFrames[i].closest('figure').parentElement.replaceChild(preNode, figures[i]);
                                // replace all iFrame parent nodes with the new <pre> tags
                                if (iFrames[i].closest('figure')) {
                                    iFrames[i].closest('figure').parentElement.replaceChild(preNode, iFrames[i].closest('figure'));
                                } else {
                                    iFrames[i].parentElement.parentElement.replaceChild(preNode, iFrames[i].closest('.codecolorer-container'));
                                }
                            }
                        }
                    }
                    // console.log('content - github :', parent);
                    return parent;
                } else {
                    console.log('Please assign id to content wrapper.')
                }
                break;
            case 'gist':
                // let parent = content.parentElement;
                // let gists = parent.querySelectorAll('.oembed-gist') || parent.querySelectorAll('.gist');
                let gists = parent.querySelectorAll('.gist') && parent.querySelectorAll('.gist').length > 0 ? parent.querySelectorAll('.gist') : null ||
                    parent.querySelectorAll('figure iframe') && parent.querySelectorAll('figure iframe').length > 0 ? parent.querySelectorAll('figure iframe') : null;

                let scripts = parent.querySelectorAll('script');
                let styles = parent.querySelectorAll('link');

                if (parent) {
                    if (gists && gists.length > 0) {
                        // Loop through all the iFrames
                        for (let i = 0, len = gists.length; i < len; i++) {
                            let preNode = document.createElement('pre');
                            let codeNode = document.createElement('code');

                            // let gistContent = gists[i].querySelector('table').innerText || gists[i].querySelector('table').textContent;
                            let iframeDocs = gists[i].contentDocument || gists[i].contentWindow && gists[i].contentWindow.document;
                            let gistContent = iframeDocs.querySelector('table') && iframeDocs.querySelector('table').innerText || iframeDocs.querySelector('div.gist-data') && iframeDocs.querySelector('div.gist-data').innerText;

                            if (gistContent) {
                                codeNode.innerText = gistContent && gistContent.replace(/</ig, '&lt;');
                                preNode.appendChild(codeNode);

                                // replace all iFrame parent nodes with the new <pre> tags
                                // gists[i].parentElement.replaceChild(preNode, gists[i]);
                                if (gists[i].closest('figure')) {
                                    gists[i].closest('figure').parentElement.replaceChild(preNode, gists[i].closest('figure'));
                                } else {
                                    // gists[i].parentElement.parentElement.replaceChild(preNode, gists[i].closest('.codecolorer-container'));
                                }
                            }

                            /* if (scripts[i].src.indexOf('github.com') > -1) {
                                parent.removeChild(scripts[i]);
                            }
                            if (styles[i].href.indexOf('github.com') > -1) {
                                parent.removeChild(styles[i]);
                            } */
                        }

                    }
                    // console.log('content - gists :', parent);
                    return parent;
                } else {
                    console.log('Please assign id to content wrapper.')
                }
                break;
            case 'crayon-table':
                // Method 2 for Crayons highlighter
                // ============================================
                let crayonDivs = parent.querySelectorAll(selector);

                if (crayonDivs && crayonDivs.length > 0) {
                    for (let i = 0; i < crayonDivs.length; i++) {
                        let preNode = document.createElement('pre');
                        let codeNode = document.createElement('code');

                        codeNode.innerHTML = crayonDivs[i].querySelector('.crayon-code') && crayonDivs[i].querySelector('.crayon-code').innerText.replace(/</ig, '&lt;');
                        preNode.appendChild(codeNode);

                        crayonDivs[i].parentNode.insertBefore(preNode, crayonDivs[i]);

                        crayonDivs[i].parentNode.removeChild(crayonDivs[i]);

                        console.log('crayonDivs[i].querySelector innerText', crayonDivs[i].querySelector('.crayon-code') && crayonDivs[i].querySelector('.crayon-code').innerText);
                    }
                }

                return parent;
            default:
                return parent;
        }

    }

    /**
     * @function : Toggle Sidebar Panel containing list of Articles
     * @param event
     */
    public handleToggleArticleListPanel() {
        if (document.body) {
            if (!document.body.classList.contains('isArticleListPanelOpened')) {
                document.body.classList.add('isArticleListPanelOpened');
                if ('localStorage' in window && window['localStorage'] !== null) {
                    localStorage.setItem('isArticleListPanelOpened', 'true');
                }
            } else {
                document.body.classList.remove('isArticleListPanelOpened');
                if ('localStorage' in window && window['localStorage'] !== null) {
                    localStorage.setItem('isArticleListPanelOpened', 'false');
                }
            }
        }
    }

    public getUniqueTags(articles: any) {
        const uniqueTags = articles.map((article: any) => article.tags)
            .reduce((allTags: any, tags: any) => allTags.concat(tags), [])
            .reduce((uniqTags: any, tag: any) => {
                uniqTags[tag.trim()] = (uniqTags[tag.trim()] || 0) + 1;
                return uniqTags;
            }, {});

        // OUTPUT : {JavaScript: 3, ES6: 3, React: 1, Form: 1}

        return uniqueTags;
    }

    public isServerOnline() {
        let isServerUp = true;
        let url = 'http://localhost:3001/assets/images/favicon.ico';
        let img = new Image();
        img.src = url;

        img.onload = function () {
            // If the server is up, do this.
            console.log('Server is up!');
            isServerUp = true;
        };

        img.onerror = function () {
            // If the server is down, do that.
            console.log('Server is down!');
            isServerUp = false;
        };
    }

    public createDemoApp(editorData: any, template: string, previewFrameElem: any) {
        previewFrame = previewFrameElem;
        preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
        let scriptBlocks = JQUERY + BOOTSTRAP_CSS + BOOTSTRAP_JS + REQUIRE_METHOD + BABEL + BABEL_PRESET_ENV;
        console.log('CreateApp Template ===', template);
        if (template === 'SCSS') {
            /* sass.compile(editorData, (result) => {
                editorData = '<pre>' + result.text + '</pre>';
                console.log(result.text, editorData);
                this.preview.open();
                this.preview.write(editorData);
                // insertJs();
                // preview.body.innerHTML = editorData;
                this.preview.close();
                clearInterval(this.timer);
            }); */
        }

        const documentContents = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            ${scriptBlocks}
            ${template === 'Handlebars' ? HANDLEBARS : ''}
            ${template === 'React' ? REACT : ''}
            ${template === 'Vue' ? VUEJS : ''}
            ${template === 'RxJs5' ? (rxjsOutputStyle + rxjsOutputScript + RXJS_5) : ''}
            ${template === 'RxJs6' ? (rxjsOutputStyle + rxjsOutputScript + RXJS_6) : ''}
            <!-- <script type="text/babel" src="./MyExport.js"></script> -->
        </head>

        <body>
            ${template === 'React' ? APP_ROOT : ''}
            ${editorData}
        </body>

        </html>`;

        this.renderOutput(documentContents);
    }

    // Compile and Render code into iFrame
    public renderOutput(editorData: any) {

        // var output = Babel.transform(editorData, { presets: ['es2015'] }).code;

        // 1. jQuery Way
        // let myFrame = $("#preview").contents().find('body');
        // myFrame.html(editorData);

        // 2. Vanilla JavaScript way
        preview.open();
        preview.write(editorData);
        // insertJs();
        // preview.body.innerHTML = editorData;
        preview.close();
        // clearInterval(timer);
    }

}

export default Utils;

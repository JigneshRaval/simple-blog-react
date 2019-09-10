// utils.ts
// ==============================

// Utility functions

declare var $: any;

class Utils {
    scrollDuration: number = 250;
    lastScrollTop: number = 0;
    delta = 5;
    scrollTimer: any;
    timer: any;

    constructor() {
        this.init();
    }

    public init() {
        // show header if mouse reaches near to top browser border
        document.addEventListener("mousemove", function (e) {
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
        // This is necessary so you never see what is "behind" the navbar.
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
        $(".pagination-holder").jPages({
            containerID: "postList",
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
     * @function : Toggle settings dropdown in styleguide header section
     * @param event
     */
    public toggleDropdown(event: any) {
        let node = event.currentTarget.nextElementSibling;

        if (event.target.classList.contains('isActive')) {
            event.target.classList.remove('isActive');
            node.classList.remove('styleguide-dropdown-active');
        } else {
            event.target.classList.add('isActive');
            node.classList.add('styleguide-dropdown-active');
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

    public filterArticles(event: any, filterBy: string, articles: any) {
        // if (this.timer) {
        //     clearTimeout(this.timer);
        // }
        // this.timer = setTimeout(() => {
        let searchTerm = event.target.value || event.target.getAttribute('data-tag-name');
        let searchBarElem = document.querySelector('.uk-search-default');
        let searchBox = document.querySelector('.uk-search-input');

        event.target.parentElement.classList.add('active');
        if (searchBox) {
            (searchBox as HTMLInputElement).value = searchTerm;
        }

        if (searchTerm) {
            searchBarElem.classList.add('isSearching');

            // If "searchTerm" provided then, Set filtered articles in the state
            // this.setState({ filteredArticles: filteredList });

            return this.filterArticlesBy(searchTerm, filterBy, articles);
        } else {

            // Hide clear search icon
            searchBarElem.classList.remove('isSearching');

            // If "searchTerm" NOT provided then, Set default articles list into the filtered articles in the state
            // this.setState({ filteredArticles: this.state.articles });

            return articles;

        }
        // }, 1000);
    }

    /**
     * Function to filter Articles by search value and filterBy type
     * @param searchTerm : string - Provide search value
     * @param filterBy : string - provide filterBy value like filterBy tags, category, all, search
     * @param articles : Array - List of all Articles to be filtered.
     */
    public filterArticlesBy(searchTerm: string, filterBy: string, articles: any) {
        switch (filterBy) {
            // Method 1: filter articles either by tags, category or by title which is matching with search term
            case 'search':
                let articleBySearch = articles.filter(({ tags, category, title }: any) => {
                    return category.toLowerCase().includes(searchTerm.toLowerCase()) || title.toLowerCase().includes(searchTerm.toLowerCase()) || tags.some((tag: any) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                }).map((article: any) => article);

                return [...articleBySearch];

            // Method 2: filter articles by tags matching with search term
            case 'tag':
                let articleByTags = articles.filter(({ tags }: any) => {
                    return tags.some((tag: any) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                });

                return [...articleByTags];

            // Method 3: filter articles by tags matching with search term
            case 'category':
                let articlesByCategory = articles.filter(({ category }: any) => {
                    return category.toLowerCase().includes(searchTerm.toLowerCase())
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

    public formatDate(dateFormat: any, separator: string, date: any) {
        let formattedDate,
            locale = "en-us";
        let dt = new Date(date);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let day = dt.getDate();
        let month = dt.toLocaleString(locale, { month: "long" });
        let year = dt.getFullYear();

        switch (dateFormat) {
            case "dd/mm/yyyy":
                formattedDate = `${day}${separator}${month}${separator}${year}`;
            default:
                formattedDate = `${month} ${day}, ${year}`;
        }
        return formattedDate;
    }

    public getUniqueCategories = (articles: any) => {
        let uniqueCategories = articles.reduce((uniqcats: any, article: any) => {
            if (uniqcats.indexOf(article.category) === -1) {
                uniqcats.push(article.category);
            }
            return uniqcats;
        }, []);

        // OUTPUT : ["JavaScript", "React", ...]
        return uniqueCategories;
    }

    // Clean HTML tags by removing Class, ID and Style attributes
    sanitizeHtml(html: any) {
        // let wrapperDiv = document.createElement('div');
        // wrapperDiv.id = "wrapper-container";
        // wrapperDiv.innerHTML = html;

        /* html.querySelectorAll('pre').forEach((node: any) => {
            let codeContent = node.innerText || node.textContent;
            codeContent = codeContent.replace(/</ig, '&lt;');

            if (codeContent) {
                node.innerHTML = `<code>${codeContent}</code>`;
            }
        }); */

        // wrapperDiv = this.extractCleanCode(wrapperDiv, wrapperDiv.innerHTML, 'gist');

        // wrapperDiv = this.extractCleanCode(wrapperDiv, wrapperDiv.innerHTML, 'crayon-table');

        // wrapperDiv = utils.extractCleanCode(wrapperDiv, wrapperDiv.innerHTML, 'github');

        // console.log('wrapperDiv :', wrapperDiv);

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

    public extractCleanCode(parent: any, content: any, type: string) {
        switch (type) {
            case "github":
                var iFrames = parent.querySelectorAll('iframe'); // Select all iFrame elements
                var figures = parent.querySelectorAll('figure.graf--iframe'); // Select all iFrame parent Elements

                if (parent) {
                    if (iFrames && iFrames.length > 0) {
                        // Loop through all the iFrames
                        for (var i = 0, len = iFrames.length; i < len; i++) {
                            var preNode = document.createElement('pre');
                            var codeNode = document.createElement('code');

                            var contDoc = iFrames[i].contentDocument || iFrames[i].contentWindow ? iFrames[i].contentWindow.document : null;

                            if (contDoc) {
                                var iframeContent = contDoc.querySelector('table').innerText || contDoc.querySelector('table').textContent;

                                codeNode.innerText = iframeContent.replace(/</ig, '&lt;');
                                preNode.appendChild(codeNode);
                                // replace all iFrame parent nodes with the new <pre> tags
                                iFrames[i].closest('figure').parentElement.replaceChild(preNode, figures[i]);
                            }
                        }
                    }
                    // console.log('content - github :', parent);
                    return parent;
                } else {
                    console.log("Please assign id to content wrapper.")
                }
            case "gist":
                // var parent = content.parentElement;
                var gists = parent.querySelectorAll('.oembed-gist') || parent.querySelectorAll('.gist');

                if (parent) {
                    if (gists && gists.length > 0) {
                        // Loop through all the iFrames
                        for (var i = 0, len = gists.length; i < len; i++) {
                            if (gists[i].querySelector('table')) {
                                var preNode = document.createElement('pre');
                                var codeNode = document.createElement('code');

                                var gistContent = gists[i].querySelector('table').innerText || gists[i].querySelector('table').textContent;
                                codeNode.innerText = gistContent.replace(/</ig, '&lt;');
                                preNode.appendChild(codeNode);
                                // replace all iFrame parent nodes with the new <pre> tags
                                gists[i].parentElement.replaceChild(preNode, gists[i]);
                            }
                        }

                    }
                    // console.log('content - gists :', parent);
                    return parent;
                } else {
                    console.log("Please assign id to content wrapper.")
                }
            case "crayon-table":
                // Method 2 for Crayons highlighter
                //============================================
                var crayonDivs = parent.querySelectorAll('.crayon-syntax');

                if (crayonDivs && crayonDivs.length > 0) {
                    for (var i = 0; i < crayonDivs.length; i++) {
                        var preNode = document.createElement('pre');
                        var codeNode = document.createElement('code');

                        codeNode.innerHTML = crayonDivs[i].querySelector('.crayon-code').innerText.replace(/</ig, '&lt;');
                        preNode.appendChild(codeNode);

                        crayonDivs[i].parentNode.insertBefore(preNode, crayonDivs[i]);

                        crayonDivs[i].parentNode.removeChild(crayonDivs[i]);

                        console.log('crayonDivs[i].querySelector innerText', crayonDivs[i].querySelector('.crayon-code').innerText);
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
            .reduce((uniqtags: any, tag: any) => {
                uniqtags[tag.trim()] = (uniqtags[tag.trim()] || 0) + 1
                return uniqtags;
            }, {});

        // OUTPUT : {JavaScript: 3, ES6: 3, React: 1, Form: 1}

        return uniqueTags;
    }

    public isServerOnline() {
        let isServerUp = true;
        let url = "http://localhost:3001/assets/images/favicon.ico";
        let img = new Image();
        img.src = url;

        img.onload = function () {
            // If the server is up, do this.
            console.log("Server is up!");
            isServerUp = true;
        }

        img.onerror = function () {
            // If the server is down, do that.
            console.log("Server is down!");
            isServerUp = false;
        }
    }

}

export default Utils;

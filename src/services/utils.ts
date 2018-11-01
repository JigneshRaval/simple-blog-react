// utils.ts
// ==============================

// Utility functions

class Utils {
    scrollDuration: number = 250;

    constructor() { }

    public scrollToTop(element: any) {
        let elem = element || window;
        let scrollPosY = elem ? elem.scrollTop : window.scrollY;
        let scrollStep = -scrollPosY / (this.scrollDuration / 15);

        let scrollInterval = setInterval(function () {
            // TODO: Duplicated here because scrollPosY is not updating
            scrollPosY = elem ? elem.scrollTop : window.scrollY;

            if (scrollPosY !== 0) {
                elem.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 5);
    }


    /**
     * @function : Scroll to top with smooth animation using javascript only
     * @param event
     */
    public getScrollPosition(scrollElement: any, scrollParentElement: any) {
        // Show/Hide scrollToTop link at bottom-right corner of the page
        if (scrollElement) {
            if (scrollParentElement.scrollTop > 300) {
                scrollElement.classList.add('isVisible');
            } else {
                scrollElement.classList.remove('isVisible');
            }
        }

        // Shrink/Expand Header bar on scroll
        if (scrollParentElement.scrollTop > 150) {
            document.body.classList.add('shrinkHeader');
        } else {
            document.body.classList.remove('shrinkHeader');
        }
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


    public toggleTheme() {
        const bodyElem = document.querySelector('body');
        if (bodyElem) {
            if (bodyElem.classList.contains('darkTheme')) {
                // Left sidebar navigation closed
                bodyElem.classList.remove('darkTheme');
                this.updateLocalStorage('isIndexNavOpened', 'false');
            } else {
                bodyElem.classList.add('darkTheme');
                this.updateLocalStorage('isIndexNavOpened', 'false');
            }
        }
    }


    public updateLocalStorage(key: any, value: any) {
        if ('localStorage' in (<any>window) && (<any>window)['localStorage'] !== null) {
            localStorage.setItem(key, value);
        }
    }


    public switchTotheme(event: any, themeName = 'default') {

        const body = document.querySelector('body');
        document.querySelector('body').classList.remove(`theme-default`);
        document.querySelector('body').classList.remove(`theme-red`);
        document.querySelector('body').classList.remove(`theme-yellow`);

        this.updateLocalStorage('blogTheme', themeName);
        document.querySelector('body').classList.add(`theme-${themeName}`);

        if ('localStorage' in (<any>window) && (<any>window)['localStorage'] !== null) {
            if (localStorage.getItem('blogTheme')) {
                this.updateLocalStorage('blogTheme', localStorage.getItem('blogTheme'));
                document.querySelector('body').classList.add(`theme-${localStorage.getItem('blogTheme')}`);
            } else {
                this.updateLocalStorage('blogTheme', themeName);
                document.querySelector('body').classList.add(`theme-${themeName}`);
            }
        } else {
            this.updateLocalStorage('blogTheme', themeName);
            document.querySelector('body').classList.add(`theme-${themeName}`);
        }

        if (event && event.target) {
            const dropdownLinks = document.querySelectorAll('dropdown--themes li a');
            [].forEach.call(dropdownLinks, (link: any) => {
                link.classList.remove('isActive');
            });

            if (event.target.classList.contains('isActive')) {

            } else {
                event.target.classList.add('isActive');
            }
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
        if (!body.classList.contains('showVerticalGrid')) {
            body.classList.add('showVerticalGrid');
        } else {
            body.classList.remove('showVerticalGrid');
        }
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
                break;

            // Method 2: filter articles by tags matching with search term
            case 'tag':
                let articleByTags = articles.filter(({ tags }: any) => {
                    return tags.some((tag: any) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                });

                return [...articleByTags];
                break;

            // Method 3: filter articles by tags matching with search term
            case 'category':
                let articlesByCategory = articles.filter(({ category }: any) => {
                    return category.toLowerCase().includes(searchTerm.toLowerCase())
                });

                return [...articlesByCategory];
                break;

            // Method 4: reset all the filters and display all the articles.
            case 'all':
                return [...articles];
                break;

            // TODO : Remove or update if required
            default:
                return articles.map((article: any) => {
                    if (article[filterBy].indexOf(searchTerm) > -1) {
                        // filteredList.push(article);
                    }
                });
        }
    }
}

export default Utils;
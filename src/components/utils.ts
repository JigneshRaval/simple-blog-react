// utils.ts
// ==============================

// Utility functions

export class Utils {
    scrollDuration: number = 250;

    constructor() { }

    public sgScrollToTop() {
        let scrollStep = -window.scrollY / (this.scrollDuration / 15);

        let scrollInterval = setInterval(function () {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 5);
    }


    /**
     * @function : Scroll to top with smooth animation using javascript only
     * @param event
     */
    public getScrollPosition(elementId: any) {
        let scrollElement = document.getElementById(elementId);

        if (scrollElement) {
            if (window.pageYOffset > 300) {
                scrollElement.classList.add('isVisible');
            } else {
                scrollElement.classList.remove('isVisible');
            }
        }

        if (window.pageYOffset > 150) {
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
}

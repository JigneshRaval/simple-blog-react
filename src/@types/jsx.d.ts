import React, { HTMLAttributes } from "react";

declare namespace JSX {
    interface IntrinsicElements {
        "img": HTMLAttributes & {
            alt: string,
            src: string,
            loading?: 'lazy' | 'eager' | 'auto';
        }
    }
}

declare module 'react' {
    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        loading?: 'lazy' | 'eager' | 'auto';
        alt: string;
    }
}

declare module 'react' {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}

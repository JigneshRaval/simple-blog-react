import { useState } from "react";

export const useArticleHook = (initialValue: any) => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: (event: any) => {
                setValue(event.target.value);
            }
        }
    };
};

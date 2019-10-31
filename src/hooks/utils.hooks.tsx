// useFetch hook
// https://scotch.io/tutorials/create-a-custom-usefetch-react-hook
/**
 *
 * @param url string
 * @param options object
 * @usage
 * `const res = useFetch("https://dog.ceo/api/breeds/image/random", {});`
 */
const useFetch = (url: string, options: any) => {
    const [response, setResponse] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(url, options);
                const json = await res.json();
                setResponse(json);
                setIsLoading(false)
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    return { response, error, isLoading };
};

if (typeof window === "undefined") {
    // Server-side polyfill for localStorage
    // We unconditionally overwrite it to prevent Node's experimental localStorage (if present)
    // from triggering warnings like "--localstorage-file was provided without a valid path"
    // when accessed.
    const globalAny = global as any;
    globalAny.localStorage = {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
        key: () => null,
        length: 0,
    };
}

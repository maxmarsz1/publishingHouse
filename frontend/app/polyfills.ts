if (typeof window === "undefined") {
    // Server-side polyfill for localStorage
    const globalAny = global as any;
    if (typeof globalAny.localStorage === "undefined" || typeof globalAny.localStorage?.getItem !== "function") {
        globalAny.localStorage = {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
            clear: () => { },
            key: () => null,
            length: 0,
        };
    }
}

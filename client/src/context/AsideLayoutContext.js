import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const AsideLayoutContext = createContext(null);

export function AsideLayoutProvider({ children }) {
    const [asideCollapsed, setAsideCollapsed] = useState(false);

    const toggleAsideCollapsed = useCallback(() => {
        setAsideCollapsed((c) => !c);
    }, []);

    const value = useMemo(
        () => ({
            asideCollapsed,
            setAsideCollapsed,
            toggleAsideCollapsed,
        }),
        [asideCollapsed, toggleAsideCollapsed]
    );

    return <AsideLayoutContext.Provider value={value}>{children}</AsideLayoutContext.Provider>;
}

export function useAsideLayout() {
    const ctx = useContext(AsideLayoutContext);
    if (!ctx) {
        throw new Error("useAsideLayout must be used within AsideLayoutProvider");
    }
    return ctx;
}

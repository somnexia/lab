import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const PanelContext = createContext(null);

export function PanelProvider({ children }) {
    const [activePanel, setActivePanel] = useState(null);

    const openPanel = useCallback((id) => {
        setActivePanel(id);
    }, []);

    const closePanel = useCallback(() => {
        setActivePanel(null);
    }, []);

    const value = useMemo(
        () => ({
            activePanel,
            openPanel,
            closePanel,
        }),
        [activePanel, openPanel, closePanel]
    );

    return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

export function usePanel() {
    const ctx = useContext(PanelContext);
    if (!ctx) {
        throw new Error("usePanel must be used within PanelProvider");
    }
    return ctx;
}

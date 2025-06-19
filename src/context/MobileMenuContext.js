import React, { createContext, useState, useContext, useCallback } from 'react';

const MobileMenuContext = createContext();

export const MobileMenuProvider = ({ children }) => {
    const [isOpen, setOpen] = useState(false);

    // const toggleMenu = useCallback(() => {
    //     setOpen(prevIsOpen => !prevIsOpen);
    // }, []);

    const value = {
        isMobileMenuOpen: isOpen,
        setMobileMenuOpen: setOpen,
    };

    return (
        <MobileMenuContext.Provider value={value}>
            {children}
        </MobileMenuContext.Provider>
    );
};

export const useMobileMenuContext = () => useContext(MobileMenuContext);
import { useEffect } from 'react';

export const useMegaMenu = () => {
    useEffect(() => {
        const menuTriggers = document.querySelectorAll(".mega-menu-item");

        menuTriggers.forEach((menuTrigger) => {
            const handleMouseEnter = () => {
                menuTrigger.classList.add("mega-toggle-on");
            };

            const handleMouseLeave = () => {
                menuTrigger.classList.remove("mega-toggle-on");
            };

            menuTrigger.addEventListener("mouseenter", handleMouseEnter);
            menuTrigger.addEventListener("mouseleave", handleMouseLeave);

            // Lưu lại các hàm để cleanup sau
            menuTrigger._handleMouseEnter = handleMouseEnter;
            menuTrigger._handleMouseLeave = handleMouseLeave;
        });

        return () => {
            menuTriggers.forEach((menuTrigger) => {
                menuTrigger.removeEventListener("mouseenter", menuTrigger._handleMouseEnter);
                menuTrigger.removeEventListener("mouseleave", menuTrigger._handleMouseLeave);
            });
        };
    }, []);
};
import { useEffect } from 'react';

export const useMobileMenu = (isMobileMenuOpen, setMobileMenuOpen) => {
    useEffect(() => {
        const mainToggle = document.querySelector('.menu-toggle.main-header-menu-toggle');
        const mobileHeaderContent = document.querySelector('.ast-mobile-header-content');
        const mainNav = document.querySelector('#ast-mobile-site-navigation');
        const allSubMenuToggles = mainNav ? mainNav.querySelectorAll('.ast-menu-toggle') : [];

        if (!mainToggle || !mobileHeaderContent || !mainNav) {
            return;
        }

        const handleMainMenuToggle = () => {
            setMobileMenuOpen(prevState => !prevState);
        };

        const handleSubMenuToggle = (event) => {
            event.preventDefault();
            const parentMenuItem = event.currentTarget.closest('.menu-item-has-children');
            if (!parentMenuItem) return;

            const subMenu = parentMenuItem.querySelector('.sub-menu');
            if (!subMenu) return;

            const isExpanded = parentMenuItem.classList.toggle('ast-submenu-expanded');
            event.currentTarget.setAttribute('aria-expanded', isExpanded.toString());
            subMenu.style.display = isExpanded ? 'block' : 'none';
        };

        // Gắn event listeners
        mainToggle.addEventListener('click', handleMainMenuToggle);
        allSubMenuToggles.forEach(toggle => {
            toggle.addEventListener('click', handleSubMenuToggle);
        });

        // Cập nhật DOM dựa trên trạng thái menu
        updateMobileMenuDOM(isMobileMenuOpen, mainToggle, mainNav, mobileHeaderContent);

        // Cleanup
        return () => {
            mainToggle.removeEventListener('click', handleMainMenuToggle);
            allSubMenuToggles.forEach(toggle => {
                toggle.removeEventListener('click', handleSubMenuToggle);
            });
        };
    }, [isMobileMenuOpen, setMobileMenuOpen]);
};

// Helper function để cập nhật DOM
const updateMobileMenuDOM = (isOpen, mainToggle, mainNav, mobileHeaderContent) => {
    if (isOpen) {
        mainToggle.classList.add('toggled');
        mainNav.classList.add('toggled');
        mobileHeaderContent.style.display = 'block';
    } else {
        mainToggle.classList.remove('toggled');
        mainNav.classList.remove('toggled');
        mobileHeaderContent.style.display = 'none';

        // Reset sub-menus
        const openedSubMenus = mainNav.querySelectorAll('.ast-submenu-expanded');
        openedSubMenus.forEach(item => {
            item.classList.remove('ast-submenu-expanded');
            const subMenu = item.querySelector('.sub-menu');
            const toggleButton = item.querySelector('.ast-menu-toggle');
            if (subMenu) {
                subMenu.style.display = 'none';
            }
            if (toggleButton) {
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
};
// src/script-handlers/results-navigation-handler.js

export const initializeResultsNavigation = () => {
    // Kiểm tra xem các element cần thiết có tồn tại không
    const resultBtnNext = document.getElementById('results-btn-next');
    const resultBtnPrev = document.getElementById('results-btn-prev');
    
    if (!resultBtnNext || !resultBtnPrev) {
        return null; // Không có element cần thiết, skip
    }

    // Handler cho nút Next
    const handleNextClick = (e) => {
        e.preventDefault();
        
        const col = document.querySelectorAll('.box-results .col');
        col.forEach((item) => {
            if (item.classList.contains('col-1')) {
                item.style.display = 'none';
            } else if (item.classList.contains('col-2')) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.style.flex = '0 0 100%';
            }
        });
        
        console.log('Next clicked:', resultBtnPrev);
        resultBtnNext.style.display = 'none';
        resultBtnPrev.style.display = 'block';
    };

    // Handler cho nút Previous
    const handlePrevClick = (e) => {
        e.preventDefault();
        
        const col = document.querySelectorAll('.box-results .col');
        col.forEach((item) => {
            if (item.classList.contains('col-1')) {
                item.style.display = 'block';
            } else if (item.classList.contains('col-2')) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        resultBtnPrev.style.display = 'none';
        resultBtnNext.style.display = 'block';
    };

    // Gắn event listeners
    resultBtnNext.addEventListener('click', handleNextClick);
    resultBtnPrev.addEventListener('click', handlePrevClick);

    // Cleanup function để remove event listeners khi component unmount
    return () => {
        resultBtnNext.removeEventListener('click', handleNextClick);
        resultBtnPrev.removeEventListener('click', handlePrevClick);
    };
};

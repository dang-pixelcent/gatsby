/**
 * Tự động embed form vào container khi user scroll,
 * và trả về một hàm để dọn dẹp các sự kiện đó.
 * @returns {function|null} - Trả về một hàm dọn dẹp nếu tìm thấy phần tử, hoặc null nếu không.
 */
export const initializeFormEmbed = () => {
    // const formContainer = document.getElementById("sdformthree");

    // // Nếu không có container, không làm gì cả.
    // if (!formContainer) {
    //     return null;
    // }

    // let isFormLoaded = false;

    // const handleScroll = () => {
    //     if (isFormLoaded) return;

    //     isFormLoaded = true;

    //     // Tạo iframe
    //     const ghliframe = document.createElement('iframe');
    //     ghliframe.id = "pZ5us1TDI3kKin0xSGLQ";
    //     ghliframe.style.width = "100%";
    //     ghliframe.style.border = "none";
    //     ghliframe.src = "https://book.practiceflow.md/widget/survey/pZ5us1TDI3kKin0xSGLQ";
    //     ghliframe.setAttribute("nitro-exclude", "true");

    //     formContainer.appendChild(ghliframe);

    //     // Tạo script
    //     const ghlscript = document.createElement('script');
    //     ghlscript.src = "https://book.practiceflow.md/js/form_embed.js";
    //     ghlscript.setAttribute("nitro-exclude", "true");
    //     formContainer.appendChild(ghlscript);

    //     // Remove scroll listener after loading
    //     window.removeEventListener('scroll', handleScroll);
    // };

    // // Thêm scroll listener với once: true để tự động remove
    // if (window.addEventListener) {
    //     window.addEventListener('scroll', handleScroll, { once: true });
    // }

    // // Trả về hàm dọn dẹp
    // return () => {
    //     window.removeEventListener('scroll', handleScroll);
        
    //     // Clear container nếu cần
    //     if (formContainer) {
    //         const iframe = formContainer.querySelector('#pZ5us1TDI3kKin0xSGLQ');
    //         if (iframe) {
    //             iframe.remove();
    //         }
            
    //         const script = formContainer.querySelector('script[src*="form_embed.js"]');
    //         if (script) {
    //             script.remove();
    //         }
    //     }
    // };
};

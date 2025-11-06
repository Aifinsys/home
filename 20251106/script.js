document.addEventListener('DOMContentLoaded', () => {

    // --- 設定 ---
    const totalPages = 12; // 您的總頁數
    const pagePath = './html/'; // 您的網頁檔案路徑
    const pageExtension = '.html'; // 您的網頁副檔名
    // --- ---

    let currentPage = 1;

    // 獲取 DOM 元素
    const contentFrame = document.getElementById('content-frame');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    /**
     * 更新頁面內容和按鈕狀態
     */
    function updatePage() {
        // 構建新的網頁路徑
        const newUrl = `${pagePath}${currentPage}${pageExtension}`;
        
        // 更新 iframe 的 src
        contentFrame.src = newUrl;

        // 更新頁碼顯示
        pageIndicator.textContent = `第 ${currentPage} / ${totalPages} 頁`;

        // 更新按鈕的禁用狀態
        // 如果在第一頁，禁用「上一頁」按鈕
        prevButton.disabled = (currentPage === 1);
        // 如果在最後一頁，禁用「下一頁」按鈕
        nextButton.disabled = (currentPage === totalPages);
    }

    /**
     * 前往下一頁
     */
    function goToNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    }

    /**
     * 前往上一頁
     */
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    }

    // --- 事件監聽 ---

    // 點擊「下一頁」按鈕
    nextButton.addEventListener('click', goToNextPage);

    // 點擊「上一頁」按鈕
    prevButton.addEventListener('click', goToPrevPage);
    
    // 增加鍵盤左右箭頭支持
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            goToNextPage();
        } else if (event.key === 'ArrowLeft') {
            goToPrevPage();
        }
    });


    // --- 初始化頁面 ---
    updatePage();

});
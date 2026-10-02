const copy = {
  zh: {
    brandSub: 'CLIMATE INTELLIGENCE', navHome: '首頁', navNews: '最新消息', navAbout: '關於我們',
    navProducts: '產品服務', navPartners: '合作夥伴',
    navContact: '聯絡我們 <i class="fa-solid fa-arrow-up-right-from-square"></i>',
    eyebrow: 'CLIMATE RISK INTELLIGENCE · TAIWAN',
    heroTitle: '提供氣候數據<br>為<strong>金融避險</strong>',
    heroText: '全球氣候資料以 AI 科學計算，成為金融投資與避險決策。',
    explore: '探索解決方案 <i class="fa-solid fa-arrow-down"></i>',
    talk: '與我們對話 <i class="fa-solid fa-arrow-up-right-from-square"></i>',
    statRisk: '實體氣候風險因子', statEngine: '科學建模引擎', statSignal: '動態訊號監測',
    aboutTag: 'ABOUT AI FINTECH',
    aboutTitle: '氣候變遷不是背景雜訊。<br>它是<strong>每一項金融決策</strong>的變數。',
    aboutText: '中山永續金融科技整合環境及金融數據，量化氣候風險的財務影響。',
    productTag: 'PRODUCTS & SERVICES', productsTitle: '我們的服務',
    aiProductKicker: 'AI INVESTMENT PLATFORM', aiProductTitle: 'AI 投資平台',
    aiProductText: '結合市場、產業與氣候情境，將資料轉譯成投資風險與資產配置建議。',
    requestDemo: '申請產品展示 <i class="fa-solid fa-arrow-right"></i>',
    dbProductKicker: 'SUSTAINABLE FINANCE DATA', dbProductTitle: '永續金融資料庫',
    dbProductText: '將風險數據整合成可直接使用的投資策略。',
    exploreData: '探索資料能力 <i class="fa-solid fa-arrow-right"></i>',
    newsTag: 'LATEST NEWS', newsTitle: '最新消息',
    partnerTag: 'TRUSTED COLLABORATORS', partnersTitle: '與相信資料能改變未來的<br>夥伴並肩前行。',
    contactTag: 'CONTACT', contactTitle: '讓資料與決策，<br><strong>開始產生影響。</strong>',
    contactCta: '立即聯絡我們', addressLabel: '地址',
    address: '高雄市前鎮區復興四路 1 號<br>宏泰高雄新創大樓 2 樓',
    hoursLabel: '營業時間', emailLabel: '電子信箱', follow: '追蹤我們',
    formTitle: '開始一場<br>有影響力的對話。', formText: '告訴我們您的需求，我們會儘快與您聯繫。',
    formName: '您的姓名', formEmail: '電子信箱', formCompany: '公司名稱（選填）',
    formNeed: '您想了解什麼？', formMessage: '訊息',
    formSend: '送出資訊 <i class="fa-solid fa-arrow-up-right-from-square"></i>'
  },
  en: {
    brandSub: 'CLIMATE INTELLIGENCE', navHome: 'Home', navNews: 'News', navAbout: 'About',
    navProducts: 'Solutions', navPartners: 'Partners',
    navContact: 'Contact us <i class="fa-solid fa-arrow-up-right-from-square"></i>',
    eyebrow: 'CLIMATE RISK INTELLIGENCE · TAIWAN',
    heroTitle: 'Climate data<br>for <strong>financial hedging.</strong>',
    heroText: 'Global climate data, scientifically computed with AI, powers financial investment and hedging decisions.',
    explore: 'Explore solutions <i class="fa-solid fa-arrow-down"></i>',
    talk: 'Talk to our team <i class="fa-solid fa-arrow-up-right-from-square"></i>',
    statRisk: 'physical climate risk factors', statEngine: 'scientific modeling engine',
    statSignal: 'dynamic signal monitoring', aboutTag: 'ABOUT AI FINTECH',
    aboutTitle: 'Climate change is not background noise.<br>It is a variable in <strong>every financial decision.</strong>',
    aboutText: 'Ai FinTech integrates environmental and financial data to quantify the financial impact of climate risk.',
    productTag: 'PRODUCTS & SERVICES', productsTitle: 'Our services',
    aiProductKicker: 'AI INVESTMENT PLATFORM', aiProductTitle: 'AI Investment Platform',
    aiProductText: 'Combining market, industry, and climate scenarios, we translate data into investment risk and asset-allocation recommendations.',
    requestDemo: 'Request a demo <i class="fa-solid fa-arrow-right"></i>',
    dbProductKicker: 'SUSTAINABLE FINANCE DATA', dbProductTitle: 'Sustainable Finance Database',
    dbProductText: 'We integrate risk data into investment strategies ready for direct use.',
    exploreData: 'Explore data capability <i class="fa-solid fa-arrow-right"></i>',
    newsTag: 'LATEST NEWS', newsTitle: 'Latest news',
    partnerTag: 'TRUSTED COLLABORATORS',
    partnersTitle: 'Moving forward with partners<br>who believe data changes the future.',
    contactTag: 'CONTACT', contactTitle: 'Make data and decisions<br><strong>matter.</strong>',
    contactCta: 'Contact us now', addressLabel: 'Address',
    address: '2F, Hongtai Kaohsiung Startup Building<br>No. 1, Fuxing 4th Rd., Qianzhen, Kaohsiung',
    hoursLabel: 'Hours', emailLabel: 'Email', follow: 'Follow us',
    formTitle: 'Start a conversation<br>that matters.', formText: 'Tell us what you need. We will be in touch soon.',
    formName: 'Your name', formEmail: 'Email', formCompany: 'Company (optional)',
    formNeed: 'What would you like to explore?', formMessage: 'Message',
    formSend: 'Send enquiry <i class="fa-solid fa-arrow-up-right-from-square"></i>'
  }
};

let language = 'zh';
const langButton = document.querySelector('#languageToggle');
const renderLanguage = () => {
  document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en';
  langButton.textContent = language === 'zh' ? 'EN' : '中文';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = copy[language][element.dataset.i18n];
    if (!value) return;
    if (value.includes('<')) element.innerHTML = value;
    else element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const value = copy[language][element.dataset.i18nHtml];
    if (value) element.innerHTML = value;
  });
};
langButton.onclick = () => { language = language === 'zh' ? 'en' : 'zh'; renderLanguage(); };
renderLanguage();

document.querySelector('#themeToggle').onclick = event => {
  document.body.classList.toggle('dark');
  event.currentTarget.innerHTML = document.body.classList.contains('dark')
    ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
};

const dialog = document.querySelector('#contactDialog');
document.querySelectorAll('.open-contact').forEach(element => element.onclick = () => dialog.showModal());
document.querySelector('.close-dialog').onclick = () => dialog.close();
dialog.querySelector('form').onsubmit = event => {
  event.preventDefault();
  alert(language === 'zh'
    ? '謝謝！這是聯絡表單原型，送出串接完成後將由專人聯繫。'
    : 'Thank you! This contact-form prototype will be connected to your service soon.');
  dialog.close();
};
document.querySelector('.menu-button').onclick = () => {
  const nav = document.querySelector('nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
};
document.addEventListener('mousemove', event => {
  const cursor = document.querySelector('.cursor-glow');
  cursor.style.left = event.clientX + 'px';
  cursor.style.top = event.clientY + 'px';
});

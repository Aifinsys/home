document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="article-lead.css">');
const params = new URLSearchParams(location.search);
const storyKey = params.get('story') || 'etf-2025';
const story = NEWS_DATA[storyKey] || NEWS_DATA['etf-2025'];
const leadImages = {
  'etf-2025': ['assets/news/lead-etf.jpg', '2025 臺灣週 ETF 投資博覽會活動首圖。'],
  'forum-2025': ['assets/news/lead-forum.jpg', '2025 永續金融科技創新投資國際論壇活動首圖。']
};
const leadImage = leadImages[storyKey];
const esc = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

document.title = `${story.title}｜中山永續金融科技`;
document.querySelector('#articleRoot').innerHTML = `
  <article class="story">
    <header class="story-header">
      <div class="story-meta"><span>${esc(story.tag)}</span><time>${esc(story.date)}</time></div>
      <h1>${esc(story.title)}</h1>
      <p class="story-dek">${esc(story.dek)}</p>
      <div class="byline">中山永續金融科技編輯部</div>
    </header>
    ${leadImage ? `<figure class="story-hero"><img src="${leadImage[0]}" alt="${esc(leadImage[1])}"><figcaption>${esc(leadImage[1])}</figcaption></figure>` : ''}
    <div class="story-body">
      <p class="story-lead">${esc(story.lead)}</p>
      ${story.sections.map((section, index) => `<section><h2>${esc(section.heading)}</h2><p>${esc(section.text)}</p><figure><img src="${section.image}" alt="${esc(section.caption)}"><figcaption><b>0${index + 1}</b>${esc(section.caption)}</figcaption></figure></section>`).join('')}
      <aside class="official-links"><span>延伸閱讀 · OFFICIAL SOURCES</span>${story.links.map(link => `<a target="_blank" rel="noopener" href="${link[1]}">${esc(link[0])}<i>↗</i></a>`).join('')}</aside>
    </div>
  </article>`;

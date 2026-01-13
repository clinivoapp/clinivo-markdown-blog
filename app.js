const USERNAME = 'clinivoapp';
const REPO = 'clinivo-markdown-blog';
const API_URL = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/articles`;


const container = document.getElementById('view-container');

async function router() {
    const hash = window.location.hash.substring(1);
    
    if (!hash || hash === "") {
        renderHome();
    } else {
        renderPost(hash);
    }
}

// 1. Home Page: Show a list of articles as cards
async function renderHome() {
    container.innerHTML = '<h2>Recent Articles</h2><div id="post-grid">Loading...</div>';
    const grid = document.getElementById('post-grid');

    try {
        const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/articles`);
        const files = await response.json();
        
        let html = '';
        files.forEach(file => {
            if (file.name.endsWith('.md')) {
                const title = file.name.replace('.md', '').replace(/-/g, ' ');
                html += `
                    <div class="post-card">
                        <a href="#${file.name}">
                            <h3>${title}</h3>
                            <span>Read article →</span>
                        </a>
                    </div>`;
            }
        });
        grid.innerHTML = html;
    } catch (err) {
        grid.innerHTML = "Error loading articles.";
    }
}

// 2. Post Page: Show the Markdown content
async function renderPost(fileName) {
    container.innerHTML = 'Loading article...';
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${REPO}/main/articles/${fileName}`);
        const markdown = await response.text();
        container.innerHTML = `
            <a href="#" class="back-link">← Back to all posts</a>
            <div class="markdown-body">${marked.parse(markdown)}</div>
        `;
    } catch (err) {
        container.innerHTML = "Post not found.";
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
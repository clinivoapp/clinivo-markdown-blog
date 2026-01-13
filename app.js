const USERNAME = 'clinivoapp';
const REPO = 'clinivo-markdown-blog';
const API_URL = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/articles`;

const linksElement = document.getElementById('links');
const contentElement = document.getElementById('content');

// 1. Fetch the list of articles from the /articles folder
async function loadPostList() {
    try {
        const response = await fetch(API_URL);
        const files = await response.json();

        files.forEach(file => {
            if (file.name.endsWith('.md')) {
                const li = document.createElement('li');
                const cleanName = file.name.replace('.md', '').replace(/-/g, ' ');
                li.innerHTML = `<a href="#${file.name}">${cleanName}</a>`;
                linksElement.appendChild(li);
            }
        });
    } catch (err) {
        contentElement.innerHTML = "Error loading post list. Check your repo settings.";
    }
}

// 2. Fetch and render a specific Markdown file
async function loadPost() {
    const fileName = window.location.hash.substring(1);
    if (!fileName) return;

    try {
        const response = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${REPO}/main/articles/${fileName}`);
        const markdown = await response.text();
        // Use Marked.js to convert MD to HTML
        contentElement.innerHTML = marked.parse(markdown);
    } catch (err) {
        contentElement.innerHTML = "Post not found.";
    }
}

// Listen for URL hash changes (e.g., #my-post.md)
window.addEventListener('hashchange', loadPost);
window.addEventListener('load', () => {
    loadPostList();
    if (window.location.hash) loadPost();
});
import type { Article } from '../types/index.js';

export function generateEmailHTML(article: Article, subject: string): string {
    const publishDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('fr-FR') : 'Non publié';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; }
    .article-title { font-size: 22px; color: #667eea; margin-bottom: 10px; font-weight: bold; }
    .article-meta { color: #666; font-size: 14px; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 15px; }
    .article-excerpt { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; font-style: italic; }
    .article-content { background: white; padding: 20px; margin: 20px 0; line-height: 1.8; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .categories { margin: 15px 0; }
    .category-badge { display: inline-block; background: #e0e7ff; color: #667eea; padding: 5px 10px; border-radius: 20px; margin-right: 8px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📰 Nouvel Article</h1>
      <p>Une nouvelle publication vous intéresse</p>
    </div>
    
    <div class="content">
      <div class="article-title">${escapeHtml(article.title)}</div>
      
      <div class="article-meta">
        <p><strong>Auteur:</strong> ${escapeHtml(article.author)}</p>
        <p><strong>Date de publication:</strong> ${publishDate}</p>
        <p><strong>Statut:</strong> ${article.status === 'published' ? '✅ Publié' : '📝 Brouillon'}</p>
      </div>

      <div class="article-excerpt">
        "${escapeHtml(article.excerpt)}"
      </div>

      <div class="article-content">
        ${escapeHtml(article.content).replace(/\n/g, '<br>')}
      </div>

      <div class="categories">
        <strong>Catégories:</strong>
        ${article.categories.map(cat => `<span class="category-badge">${escapeHtml(cat)}</span>`).join('')}
      </div>

      <center>
        <a href="https://cms-platform.local" class="button">Lire l'article complet →</a>
      </center>
    </div>

    <div class="footer">
      <p>Vous recevez cet email car vous êtes abonné à notre plateforme de contenu éditorial.</p>
      <p>&copy; 2024 CMS Editorial Platform. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

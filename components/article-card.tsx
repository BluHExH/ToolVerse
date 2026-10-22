import Link from "next/link";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getArticleReadingMinutes, type Article } from "@/lib/blog";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="article-card">
      <span className="article-card__meta">
        <Clock size={13} aria-hidden="true" />
        {getArticleReadingMinutes(article)} min read · {formatDate(article.updated)}
      </span>
      <h3 className="article-card__title">{article.title}</h3>
      <p className="article-card__text">{article.description}</p>
    </Link>
  );
}

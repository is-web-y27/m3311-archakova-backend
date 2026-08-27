import { ArticleType } from "../entities/article-type.enum";

export class CreateArticleDto {
    title: string;
    type: ArticleType;
    summary?: string;
    content: string;
    authorId: string;
    artistId?: string;
}

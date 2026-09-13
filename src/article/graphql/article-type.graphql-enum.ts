import { registerEnumType } from "@nestjs/graphql";
import { ArticleType } from "../entities/article-type.enum";

registerEnumType(ArticleType, {name: 'ArticleType', description: 'Тип статьи'});

export {ArticleType};
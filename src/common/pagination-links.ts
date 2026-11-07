export function createPaginationLinks(
  baseUrl: string,
  page: number,
  limit: number,
  total: number,
) {
  const totalPages = Math.ceil(total / limit);

  const links: string[] = [];

  if ( page > 1 && page <= totalPages) {
    links.push(`<${baseUrl}?page=${page - 1}&limit=${limit}>; rel="prev"`);
    }

  if (page < totalPages) {links.push(`<${baseUrl}?page=${page + 1}&limit=${limit}>; rel="next"`);
    }

  return {
    totalPages,
    linkHeader: links.join(', '),
  };
}
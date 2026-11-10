import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Starlight の docs コレクション。
// コピー元の Front Matter（id、source_url、categories、tags など）は
// docsSchema にない項目だが、zod の既定の動作で無視されるため
// タイトルや本文を壊さずにそのまま使える。
export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};

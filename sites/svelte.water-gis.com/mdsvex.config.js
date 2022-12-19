import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import remarkAbbr from 'remark-abbr';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		quotes: true,
		ellipses: true,
		backticks: true,
		dashes: 'oldschool'
	},

	remarkPlugins: [remarkAbbr],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'wrap'
			}
		]
	]
});

export default config;

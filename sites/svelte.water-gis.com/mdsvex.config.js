import remarkAbbr from 'remark-abbr';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default {
	extensions: ['.svelte', '.md', '.svx'],
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
};

// import remarkGithub from 'remark-github';
// import remarkAbbr from 'remark-abbr';
// import rehypeSlug from 'rehype-slug';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default {
	extensions: ['.svelte', '.md', '.svx'],
	smartypants: {
		quotes: true,
		ellipses: true,
		backticks: true,
		dashes: 'oldschool'
	}
	// remarkPlugins: [
	// 	[
	// 		remarkGithub,
	// 		{
	// 			// Use your own repository
	// 			repository: 'https://github.com/watergis/svelte-maplibre-components.git'
	// 		}
	// 	],
	// 	remarkAbbr
	// ]
	// rehypePlugins: [
	// 	rehypeSlug,
	// 	[
	// 		rehypeAutolinkHeadings,
	// 		{
	// 			behavior: 'wrap'
	// 		}
	// 	]
	// ]
};

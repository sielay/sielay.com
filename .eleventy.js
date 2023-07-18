const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const { kebabCase } = require("lodash");
const { defaults: anchor } = require("markdown-it-anchor");
const shortcodes = require("./_content/_includes/shortcodes");
const pluginTailwindCSS = require("eleventy-plugin-tailwindcss");
anchor.permalinkSymbol = '🔗';

module.exports = function (eleventyConfig) {
  const markdownItOptions = {
    html: true,
  };
  const markdownLib = markdownIt(markdownItOptions).use(
    require("markdown-it-anchor"),
    {
      permalink: true,
    }
  );
  eleventyConfig.setLibrary("md", markdownLib);
  shortcodes(eleventyConfig);

  eleventyConfig.addPlugin(pluginTailwindCSS, {
    src: "styles.scss",
    dest: ".",
    keepFolderStructure: false,
    minify: false
    // See below for other available options
});

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPassthroughCopy("_content/**/*.jpg");
  eleventyConfig.addPassthroughCopy("_content/**/*.css");
  eleventyConfig.addPassthroughCopy("_content/**/*.png");
  eleventyConfig.addPassthroughCopy("_content/**/*.svg");
  eleventyConfig.addFilter("kebab", kebabCase);
  eleventyConfig.addFilter("keys", (input) => input && Object.keys(input));

  return {
    markdownTemplateEngine: "njk",
    writeTagsToCollections: "shags",
    dir: {
      input: "./_content"
    },
  };
};
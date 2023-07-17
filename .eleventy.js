const pluginSass = require("eleventy-plugin-sass");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const postcss = require("gulp-postcss");
const clean = require("postcss-clean");
const tailwindcss = require("tailwindcss");
const markdownIt = require("markdown-it");
const { kebabCase } = require("lodash");
const { defaults: anchor } = require("markdown-it-anchor");
const shortcodes = require("./_content/_includes/shortcodes");
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

  eleventyConfig.addPlugin(pluginSass, {
    watch: ["./*.scss", "!node_modules/**", "!_site"],
    additionalSteps: [() => postcss([tailwindcss("./tailwind.config.js"), clean()])],
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
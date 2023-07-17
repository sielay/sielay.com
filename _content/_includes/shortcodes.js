// scrapped from https://github.com/AndrewAsquith/andrewasquith-ca

const canonical = function (url) {
    return `<link rel="canonical" href="${url}" />`;
  };
  
  const metaTitle = function (title) {
    return `<title>${title}</title>`;
  };
  
  const metaDescription = function (description) {
    return `<meta name="description" content="${description}" />`;
  };
  
  const wrapper = function (content, type) {
    let ret = `
      <script type="application/ld+json">
      {
          "@context": "http://schema.org",
          "@type": "${type}"`;
    if (content.trim().length > 0) {
      ret += `,${removeTrailingComma(content)}`;
    }
    ret += `\n\t}\n\t</script>`;
    return ret;
  };
  
  const propertyWrapper = function (content, property, type) {
    let ret = `"${property}": { "@type": "${type}" `;
    if (content.trim().length > 0) {
      ret += `,${removeTrailingComma(content)}`;
    }
    ret += `},`;
    return ret;
  };
  
  const jsonDescription = function (description) {
    return kvp("description", description);
  };
  
  const sameAs = function (...args) {
    return `"sameAs": ` + jsonSingleOrArray(...args);
  };
  
  const author = function (content, name) {
    let ret = `"author": { "@type": "Person", "name": "${name}"`;
    if (!isEmpty(content)) {
      ret += `, ${removeTrailingComma(content)}`;
    }
    ret += ` },`;
    return ret;
  };
  
  const organization = function (content, name) {
    let ret = `"author": { "@type": "Organization", "name": "${name}"`;
    if (!isEmpty(content)) {
      ret += `, ${removeTrailingComma(content)}`;
    }
    ret += ` },`;
    return ret;
  };
  
  const mainEntity = function (url) {
    return `"mainEntityOfPage": { "@type": "WebPage", "@id": "${url}" },`;
  };
  
  const headline = function (headline) {
    return kvp("headline", headline);
  };
  
  const article = function (content, headlineText) {
    let newContent = `\n\t\t` + headline(headlineText) + content;
    return wrapper(newContent, "Article");
  };
  
  const blogposting = function (content, headlineText) {
    let newContent = `\n\t\t` + headline(headlineText) + content;
    return wrapper(newContent, "BlogPosting");
  };
  
  const breadcrumblist = function (content) {
    let newContent = `"itemListElement": [` + removeTrailingComma(content) + "]";
    return wrapper(newContent, "BreadcrumbList");
  };
  
  const breadcrumbitem = function (position, name, item) {
    return `{ "@type": "ListItem", "position": "${position}", "name": "${name}", "item": "${item}" },`;
  };
  
  const image = function (...args) {
    return `"image": ` + jsonSingleOrArray(...args);
  };
  
  const url = function (url) {
    return kvp("url", url);
  };
  
  const id = function (id) {
    return kvp("@id", id);
  };
  
  const type = function (type) {
    return kvp("@type", type);
  };
  
  const name = function (name) {
    return kvp("name", name);
  };
  
  const datepublished = function (datepublished) {
    return kvp("datePublished", datepublished);
  };
  
  const kvp = function (key, value) {
    return `"${key}": "${value}",`;
  };
  
  const jsonSingleOrArray = function (...args) {
    if (args.length === 1) {
      return `"${args[0]}"`;
    } else {
      return `["` + args.join(`","`) + `"],`;
    }
  };
  
  const isEmpty = function (content) {
    return content.trim().length === 0;
  };
  
  const removeTrailingComma = function (content) {
    //this is super hacky but I can't think of a better way
    //remove the trailing comma from the individual components that may have been inserted
    content = content.trimRight();
    if (content.charAt(content.length - 1) == ",") {
      content = content.slice(0, -1);
    }
    return content;
  };
  
  const required = function (title, type, url, image) {
    return `
      <meta property="og:title" content="${title}" />
      <meta property="og:type" content="${type}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:image" content="${image}" />
      `;
  };
  
  const description = function (description) {
    return `<meta property="og:description" contents="${description}" />`;
  };
  
  const sitename = function (sitename) {
    return `<meta property="og:site_name" contents="${sitename}" />`;
  };
  
  const articleAuthor = function (author) {
    return `<meta property="article:author" content"${author}" />`;
  };
  
  const articlePublished = function (date) {
    return `<meta property="article:published_time" contents="${date}" />`;
  };
  
  const articleTags = function (...args) {
    let tags = Array();
    if (args.length === 1) {
      tags = String(args[0]).split(",");
    } else {
      tags = args;
    }
    let ret = String();
    tags.forEach((tag) => {
      ret += `<meta property="article:tag" contents="${tag}" />`;
    });
    return ret;
  };
  
  const summaryCard = function (site, title, description, image, creator) {
    let ret = "";
    if (image) {
      ret += `<meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="${image}" />`;
    } else {
      ret += `<meta name="twitter:card" content="summary" />`;
    }
    ret += `
      <meta name="twitter:site" content="${site}" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />`;
    if (creator) {
      ret += `    <meta name="twitter:creator" content="${creator}" />`;
    }
  
    return ret;
  };
  
  module.exports = (config) => {
    config.addShortcode("canonical", canonical);
    config.addShortcode("metaDescription", metaDescription);
    config.addShortcode("metaTitle", metaTitle);
    config.addShortcode("twitterSummaryCard", summaryCard);
    config.addShortcode("opengraphRequired", required);
    config.addShortcode("opengraphDescription", description);
    config.addShortcode("opengraphSite", sitename);
    config.addShortcode("opengraphArticleAuthor", articleAuthor);
    config.addShortcode("opengraphArticlePublished", articlePublished);
    config.addShortcode("opengraphArticleTags", articleTags);
    config.addPairedShortcode("jsonldWrapper", wrapper);
    config.addPairedShortcode("jsonldAuthor", author);
    config.addPairedShortcode("jsonldOrganization", organization);
    config.addShortcode("jsonldDescription", jsonDescription);
    config.addShortcode("jsonldSameAs", sameAs);
    config.addShortcode("jsonldMainEntity", mainEntity);
    config.addShortcode("jsonldHeadline", headline);
    config.addPairedShortcode("jsonldArticle", article);
    config.addPairedShortcode("jsonldBlogPosting", blogposting);
    config.addShortcode("jsonldImage", image);
    config.addShortcode("jsonldUrl", url);
    config.addPairedShortcode("jsonldPropertyWrapper", propertyWrapper);
    config.addShortcode("jsonldId", id);
    config.addShortcode("jsonldType", type);
    config.addShortcode("jsonldName", name);
    config.addShortcode("jsonldDatePublished", datepublished);
    config.addShortcode("jsonldProperty", kvp);
    config.addPairedShortcode("jsonldBreadcrumblist", breadcrumblist);
    config.addShortcode("jsonldBreadcrumbitem", breadcrumbitem);
  };
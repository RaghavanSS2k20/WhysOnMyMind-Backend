const cheerio = require('cheerio');
const fs = require('fs');

// Sample HTML content
const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample paragraph.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
</body>
</html>
`;

// Load the HTML content using cheerio
const $ = cheerio.load(sampleHtml);

// Convert the HTML structure to JSON
function htmlToJson(element) {
  const node = {};
  node.tag = element.get(0).tagName.toLowerCase();

  if (element.children().length) {
    node.children = [];
    element.children().each((index, child) => {
      if (child.type === 'tag') {
        node.children.push(htmlToJson($(child)));
      }
    });
  } else {
    node.text = element.text().trim();
  }

  return node;
}

const jsonResult = htmlToJson($.root());

// Display the JSON result
console.log(JSON.stringify(jsonResult, null, 2));

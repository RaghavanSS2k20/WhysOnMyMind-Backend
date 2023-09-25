const marked = require('marked');

// Your Markdown content
const fs = require('fs'); // Import the 'fs' module to read the Markdown file



// Read Markdown content from a file
const mdownContent = fs.readFileSync('../Beriko.md', 'utf8');
const markdownContent = `

# How did We do It
Hi there! yes.. from Zero to one and from one to here!!!
![Image](http://localhost:8081/images/6510307ebb5394fd95138ba9)

## Whats our Position Now

Completed Image Handling, had a war with *useState* , *useEffect* and *useRef* 😄, and now to the main part **highlighting text!!**
pretty much a small accomplishment.. but an Important one...



`;

// Convert Markdown to HTML
const getHeadingFromContent = require('../DB/Post/utils/parse-heading')
const getClickUpImageFromContent = require('../DB/Post/utils/parse-image')
const getDescriptionFromContent = require('../DB/Post/utils/parse-description')
//console.log("img",getHeadingFromContent(markdownContent))
//console.log("imjjjhg",getClickUpImageFromContent(markdownContent))
console.log("img",getDescriptionFromContent(markdownContent))
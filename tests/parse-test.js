const marked = require('marked');

// Your Markdown content
const markdownContent = `

# Welcome to WhysOnMyMind!


## My Learning Journey

**Throughout my life**, I've dived deep into various topics and subjects,
 and I can't wait to share them with you. From programming languages to scientific theories, from artistic endeavors to philosophical ponderings, I've explored it all!

## What's in Store?

Here's a glimpse of the exciting content you can expect on WhysOnMyMind:

### SmartyPants - Elevate Your Typographic Game

Did you know that you can use ASCII punctuation characters to create "smart" typographic punctuation in HTML? It's true! For example, try using single backticks to display 
`;

// Convert Markdown to HTML
const getDescriptionFromContent = require('../DB/Post/utils/parse-description')
console.log(getDescriptionFromContent(markdownContent))
const marked = require('marked');

// Your Markdown content
const markdownContent = `

# So here we are


## My Learning Journey
![Image Alt Text](https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&psig=AOvVaw1CompZ0HyvOf_0HmwLSl-e&ust=1694665764340000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOipxJLgpoEDFQAAAAAdAAAAABAE)
**Throughout my life**, I've dived deep into various topics and subjects,
 and I can't wait to share them with you. From programming languages to scientific theories, from artistic endeavors to philosophical ponderings, I've explored it all!
 

## What's in Store?

Here's a glimpse of the exciting content you can expect on WhysOnMyMind:

### SmartyPants - Elevate Your Typographic Game

Did you know that you can use ASCII punctuation characters to create "smart" typographic punctuation in HTML? It's true! For example, try using single backticks to display 
`;

// Convert Markdown to HTML
const getDescriptionFromContent = require('../DB/Post/utils/parse-image')
console.log("img",getDescriptionFromContent(markdownContent))
# How did We do It
Hi there! yes.. from Zero to one and from one to here!!!

![Image](http://localhost:8081/images/6510307ebb5394fd95138ba9)

## Whats our Position Now

Completed Image Handling, had a war with *useState* , *useEffect* and *useRef* 😄, and now to the main part **highlighting text!!**
pretty much a small accomplishment.. but an Important one...

## What'sThe problem 😕

So we must highlight the text and preserve it.. inorder to highlight.. We must insert a **<span/>** at both the selected texts...

Example:-
```
<p>Hello world</p>

//if im highlighting  Hello from hello world, then it must be like

<p><span class="highlight">Hello</span></p>
```
how do we do it??

with the help of
> *const range = selection.getRangeAt(0);*

whats this now?? in order to understand we must understand about ***DOM*** so called ***Document Object Model***


-----------


## Document Object Model
Parses HTML to a tree like structure.. Thats a DOM.

A DOM is a Tree like representation of HTML document..
In this representation, each element, attribute, and text node in the document is represented as a node in a hierarchical tree structure. This tree structure makes it easy for developers to access, manipulate, and interact with the content and structure of the document using programming languages like JavaScript. It's a fundamental concept in web development for creating dynamic and interactive web pages.

![DOM](https://www.lambdatest.com/blog/wp-content/uploads/2023/01/image18-27.png)

So by Having a pictorical representation of DOM lets get into code explanation

> *const range = selection.getRangeAt(0);*

### Whats selection here??
The selection object represents the **current text selection** or **caret position** within a document in the DOM. It's a built-in JavaScript object that browsers provide to interact with selected text on a web page.
 
### Now Whats "getRange" 😕
Its normal to be frustated when we are bombared with JS concepts..Like are we even human if we dont??

Ill make or push myself to explain as simple as posible...
 The *getRangeAt()* method is used on the **selection object** to retrieve a *range object*. A "range" in the DOM represents *a specific portion of the document*, typically a selected text range. By passing 0 as an argument to a ***getRangeAt()***, you are requesting *The first range in the selection*.

The range variable receives the range object obtained from getRangeAt(0). This range object represents the selected text or the portion of the document where the user has made a text selection.

With the range object, you can perform various operations on the selected text or within the selected portion of the document. For example:

- You can extract the selected text using range.toString() or similar methods.
- You can modify the selected text or apply formatting to it.
- You can insert new content at the selected position.
- You can manipulate the DOM within the selected range.

This is commonly used in web applications to enable users to interact with and manipulate text on a web page, such as highlighting text, applying styles, or copying selected content. It's a powerful feature for building dynamic and user-friendly interfaces.

so We made it..., just add a span tag and thats it...! it is??

![Image](http://localhost:8081/images/651062b7bb5394fd95138bb8)
Well, Sadly this is not that simple. The above technique will only work if we have plain text enclosed in a single div. In blogs like **WhysOnMyMind**, the text is enclosed in a nested structure of DOM. So, the problem here is quite complex.

Now, moving on towards the solutions,We know that how we can get the range object. Through this object we can access the whole tree information.

We can start wrapping our selected text range and if we have any non-closed child at the end of range. We will close it first and then close our highlight wrapper. The resulting blog post will look like this:
```
<p>

<span class=”highlight”>
Lorem Ipsum <a href=”abc.com”> has been</a>
</span> the</a> 

</p>
```

Now, if we see carefully, we have a problem. We have a anchor tag ( <a> ) after span who has no parent. To solve this problem, we have to add a starting tag of the same child element present in the highlight <span> element.

Now, the correct output shall look like this:

```
<p>

<span class=”highlight”>Lorem Ipsum <a href=”abc.com”>has been</a></span><a href=”abc.com”> the</a> industry’s standard dummy text ever since the 1500s, when an unknown printer <b> took a galley </b>of type and scrambled <i>it to</i> make a type specimen book. It has survived not only <a href=”abc.com”>five centuries</a>

</p>
```
Looks like we have solved the problem. Well, thats is not quite true. Let me explain, We have highlighted the text successfully, but what about remove the highlight from the text? . Other than removing the highlight span tag ( <span class=”highlight”> ) we also have to remove all the manually altered child element tags that we added to avoid DOM destructuring. i-e (<a href=”abc.com”> )

This can become very costly task in terms of computation. This is because that other than the selected text range, we also have to extract the outer text range object to access its tree structure for manipulation.

The illustrated example is a very simple. If we think of situations where we have 10 to 12 incomplete child tags, even highlighting can be a very costly task.😕

### What we have done to solve?🎉

#### Safe Ranges?

> Safe ranges are portions of the user's selection where there are no incomplete closing child elements


To get safe ranges, we have to traverse the full ***DOM*** tree in the current selected text range. ***We have the find all the incomplete child element*** nodes and then ***split the range*** on the incomplete child nodes.
 suppoose if user selects 

>`<p> Hello world <a href="/someshit"> is the`

we would split at `<href>` tag that is unclosed, and inorder to obtain safe ranges,

>`<p<span> Hello world </span><a href="/someshit><span>is the </span>`

Guess What it worked🎉

We havent completely solved the problem but we will

##### spread ❤️,
##### WhysOnMyMind




















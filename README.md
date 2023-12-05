# 

If a function or variable holds an arrow function has a leading comment, and that comment 
contains annotation like below, we can add a few function calls in the function. 

```jsx
  // @operational("menu", "clicked")
function handleClick(e) {
  dispatch({type: "ADD_ITEM"})
}
```

will be transformed into

```jsx
function handleClick(e) {
  fireUIEvent("menu", "clicked");
  dispatch({type: "ADD_ITEM"})
}
```

so what defines an annotation:

```json
{
  "name": "operational",
  "arguments": ["menu", "clicked"],
  "type": "function",
  "function": "fireUIEvent",
  "import": {
    "package": "@abc/package",
    "default": true
  },
  "snippet": [
    {
      "position": "before"
    }
  ]
}
```

That means when an `operational` found in the comment, we will do the following things:

```js
//... add this import
import fireUIEvent from '@abc/package';

function handleClick(e) {
  fireUIEvent("menu", "clicked");
  dispatch({type: "ADD_ITEM"})
}
```

```json
{
  "name": "trace",
  "arguments": ["menu", "clicked"],
  "type": "tryCatch",
  "function": "fireUIEvent",
  "import": {
    "package": "@abc/package",
    "default": true
  },
  "snippet": [
    {
      "position": "try",
      "content": "fireUIEvent"
    },
    {
      "position": "catch",
      "content": "fireUIEvent"
    }
  ]
}
```


const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();
const todoLists = [{ title: 'Todo list', todos: [] }];

const h = (element, children) => {
  return (
    '<' +
    element +
    '>' +
    children.join('\n') +
    '</' +
    element.split().pop() +
    '>'
  );
};

const makeTodoList = (todoList, idx) => {
  const lified = todoList.todos.map((item) => {
    return h('li', [item]);
  });
  return h('div', [
    h('h1', [todoList.title]),
    h('ul', lified),
    h(
      `form action="/title?todoList=${idx}" method="POST" enctype="multipart/form-data"`,
      [
        h('label', [
          'Change todo list name',
          h('input type="text" name="title"', []),
        ]),
        h('input type="submit"', []),
      ]
    ),
    h(
      `form action="/item?todoList=${idx}" method="POST" enctype="multipart/form-data"`,
      [
        h('label', [
          'Add a todo element',
          h('input type="text" name="todo"', []),
        ]),
        h('input type="submit"', []),
      ]
    ),
    h(`form action="/clear?todoList=${idx}" method="POST"`, [
      h('input type="submit" value="Clear list"', []),
    ]),
  ]);
};

const makePage = () => {
  return h('html', [
    h('head', [h('link rel="stylesheet" href="/style.css"', [])]),
    h('body', [
      todoLists.map(makeTodoList).join(''),
      h(`form action="/add" method="POST"`, [
        h('input type="submit" value="Add list"', []),
      ]),
    ]),
  ]);
};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(makePage());
});

app.post('/title', upload.none(), (req, res) => {
  const todoList = todoLists[req.query.todoList];
  todoList.title = req.body.title;
  res.send(makePage());
});

app.post('/item', upload.none(), (req, res) => {
  const todoList = todoLists[req.query.todoList];
  const newTodo = req.body.todo;
  todoList.todos.push(newTodo);
  res.send(makePage());
});

app.post('/clear', (req, res) => {
  const todoList = todoLists[req.query.todoList];
  todoList.todos = [];
  res.send(makePage());
});

app.post('/add', (req, res) => {
  todoLists.push({ title: 'Todo list', todos: [] });
  res.send(makePage());
});

app.listen(4000, () => {
  console.log('the server has started');
});

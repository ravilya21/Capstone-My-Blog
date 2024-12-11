import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let posts = [];
// Routes
app.get('/', (req, res) => {
    console.log('Rendering Home Page. Posts:', posts);
    res.render('index', { posts: posts });
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    const newPost = {
        id: Date.now(), // Уникальный идентификатор
        title: req.body.title,
        content: req.body.content,
    };

    console.log('New Post:', newPost); // Проверяем данные нового поста
    posts.push(newPost); // Добавляем пост в массив
    console.log('Updated Posts Array:', posts); // Проверяем массив после добавления
    res.redirect('/'); // Перенаправляем на главную страницу
});

app.get('/post/:id', (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.render('post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});


app.get('/edit/:id', (req, res) => {
    const postId = Number(req.params.id); // Получаем ID из URL
    const post = posts.find(p => p.id === postId); // Находим пост по ID
    if (post) {
        res.render('edit', { post }); // Отправляем пост в шаблон edit.ejs
    } else {
        res.status(404).send('Post not found'); // Если пост не найден
    }
});

app.post('/edit/:id', (req, res) => {
    const postId = Number(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId); // Находим индекс поста
    if (postIndex !== -1) {
        posts[postIndex].title = req.body.title;
        posts[postIndex].content = req.body.content;
        res.redirect('/'); // Перенаправляем на главную страницу
    } else {
        res.status(404).send('Post not found');
    }
});

app.post('/delete/:id', (req, res) => {
    const postId = Number(req.params.id);
    posts = posts.filter(p => p.id !== postId); // Удаляем пост по ID
    res.redirect('/'); // Перенаправляем на главную страницу
});

// Start server

app.listen(port, () => {
    console.log("Server is running on port" + port);
    } );
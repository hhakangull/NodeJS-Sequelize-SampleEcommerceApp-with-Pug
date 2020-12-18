const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product')

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        title: 'Login Page',
        path: '/login'
    })
}


exports.getRegister = (req, res) => {
    res.render('auth/register', {
        title: 'Register Page',
        path: '/register',

    })
}


exports.postRegister = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("USer Name " + username);
    console.log("Password " + password);
    User.findAll({
        where: {
            username: username
        },
    }).then(result => {
        if (result.length == 0) {
            User.create({
                username: username,
                password: password,
            }).then(result => {
                console.log("Kullanıcı Oluşturuldu");
                return res.redirect('/login');
            })
        } else {
            res.render('auth/register', {
                title: 'Register Page',
                path: '/register',
                sonuc: true,
            })
        }
    }).catch(err => console.log(err));
}


exports.postLogin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        where: {
            username: username,
            password: password,
        }
    }).then(user => {
        if (user) {
            console.log("Giriş Başarılı");
            HomePage(res)
        } else {
            res.render('auth/login', {
                title: 'Login Page',
                path: '/login',
                sonuc: true,
            })

        }
    })

}


function HomePage(res) {
    Product.findAll({})
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/index', {
                        title: 'Shopping',
                        products: products,
                        categories: categories,
                        path: '/'
                    });
                }).catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        });
}
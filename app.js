const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const userRoutes = require('./routes/user');
const sequelize = require('./utility/database');

const errorController = require('./controllers/errors');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
// middleware
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => next(err));
})


// routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(userRoutes);

app.use(errorController.get404Page);



const Category = require('./models/category');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
// Product.hasOne(Category) alttaki belongsTo ile aynı şeyi ifade etmektedir.
// optionsları gireresen aynı oluyor

Product.belongsTo(Category, {
    foreignKey: {
        allowNull: false
    }
});
Category.hasMany(Product);

Product.belongsTo(User);
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);


Cart.belongsToMany(Product, {
    through: CartItem
});

Product.belongsToMany(Cart, {
    through: CartItem
})

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, {
    through: OrderItem
});

Product.belongsToMany(Order, {
    through: OrderItem
});




let _user;
// sequelize.sync({force: true}) // tüm tabloları silip tekrar oluşturma yapıyor.
sequelize.sync()
    .then(() => {
        User.findByPk(1)
            .then(user => {
                if (!user) {
                    User.create({
                        username: "hakangul",
                        password: "123456",
                    })
                }
                return user;
            }).then((user) => {
                _user = user;
                return user.getCart();

            }).then(cart => {
                if (!cart) {
                    return _user.createCart();
                }
                return cart;
            }).then(
                Category.count()
                .then((count) => {
                    if (count == 0) {
                        Category.bulkCreate(
                            [{
                                name: 'Telefon',
                                description: 'Telefon kategorisi'
                            }, {
                                name: 'Bilgisayar',
                                description: 'Bilgisayar kategorisi'
                            }, {
                                name: 'Elektronik',
                                description: 'Elektronik kategorisi'
                            }, ]
                        )
                    }
                })
            )
        console.log("Tablo oluşumları başarılı oldu")
    })
    .catch((err) => console.log(err));


app.listen(5000, () => {
    console.log('listening on port 3000');
});
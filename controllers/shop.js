const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res) => {

    Product.findAll({

        })
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

exports.getProducts = (req, res) => {

    Product.findAll({
            attributes: ['id', 'name', 'price', 'imageUrl']
        })
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
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

exports.getProductsByCategoryId = (req, res) => {
    const categoryid = req.params.categoryid;
    const model = [];
    Category.findAll()
        .then(categories => {
            model.categories = categories;
            const category = categories.find(i => i.id == categoryid)
            return category.getProducts();
        }).then(products => {
            res.render('shop/products', {
                title: 'Products',
                products: products,
                categories: model.categories,
                selectedCategory: categoryid,
                path: '/products'
            });
        }).catch(err => console.log(err));
}




exports.getProduct = (req, res) => {
    Product.findOne({
            attributes: ['id', 'name', 'price', 'imageUrl', 'description', 'createdAt'],
            where: {
                id: req.params.productid
            }
        }).then((product) => {
            console.log("***");
            console.log(product.createdAt.getMonth() + 1);
            console.log(product.createdAt.toISOString().split('T')[0]);
            res.render('shop/product-detail', {
                title: product.name,
                product: product,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
}


exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {

            return cart.getProducts()
                .then(products => {
                    console.log(products);

                    res.render('shop/cart', {
                        title: 'Cart',
                        path: '/cart',
                        products: products
                    });
                })
                .catch(err => {
                    console.log(err);
                })

        }).catch(err => {
            console.log(err);
        });
}

exports.postCart = (req, res, next) => {

    const productId = req.body.productId;
    let quantity = 1;
    let userCart;
    console.log(productId);
    console.log(req.user);

    req.user
        .getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts({
                where: {
                    id: productId
                }
            });

        })
        .then(products => {
            let product;

            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                quantity += product.cartItem.quantity;
                return product;
            }
            return Product.findByPk(productId);

        })
        .then(product => {
            userCart.addProduct(product, {
                through: {
                    quantity: quantity
                }
            })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}


exports.postCartItemDelete = (req, res) => {
    const productid = req.body.productid;

    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    id: productid
                }
            });
        })
        .then(products => {
            const product = products[0];
            console.log("********************************");
            console.log(product.cartItem);
            console.log(product.cartItem.quantity);
            console.log("********************************");
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        }).catch((err) => {
            console.log(err);
        });
}

exports.decreaseCountProductItemQuantity = (req, res) => {
    const productid = req.params.productid;
    let quantity = 0;
    let userCart;
    console.log(productid);
    console.log(req.user);

    req.user
        .getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts({
                where: {
                    id: productid
                }
            });

        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product.cartItem.quantity == 1) {
                return product.cartItem.destroy();
            }
            if (product) {
                quantity = product.cartItem.quantity;
                quantity = quantity - 1;
                return product;
            }

            return Product.findByPk(productid);
        })
        .then(product => {
            if (product.cartItem) {
                userCart.addProduct(product, {
                    through: {
                        quantity: quantity
                    }
                })
            }
        })
        .then(() => {
            res.redirect('/cart');

        })
        .catch(err => {
            console.log(err);
        });
}

exports.increaseCountProductItemQuantity = (req, res) => {
    const productid = req.params.productid;
    let quantity = 0;
    let userCart;
    console.log(productid);
    console.log(req.user);

    req.user
        .getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts({
                where: {
                    id: productid
                }
            });

        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                quantity = product.cartItem.quantity
                quantity += 1;
                return product;
            }
            return Product.findByPk(productid);
        })
        .then(product => {
            userCart.addProduct(product, {
                through: {
                    quantity: quantity
                }
            })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getOrders = (req, res) => {
    req.user
    .getOrders({ include: ['Products'] })
    .then(orders => {
        console.log(orders);

        res.render('shop/orders', {
            title: 'Orders',
            path: '/orders',
            orders: orders
        });

    })
    .catch(err => console.log(err));

}


exports.postOrder = (req, res) => {
    let userCart;
    req.user
        .getCart()
        .then((cart) => {
            userCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            req.user.createOrder()
                .then((order) => {
                    order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity,
                            price: product.price
                        }
                        return product;
                    }));
                })
                .catch((err) => console.log(err));

        })
        .then(() => {
            userCart.setProducts(null)
        }).then(() => {
            res.redirect('/orders');
        })
        .catch((err) => {
            console.log(err);
        });


    
}
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');

exports.getProducts = (req, res) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                title: 'Admin Products',
                products: products,
                path: '/admin/products',
                action: req.query.action
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getAddProduct = (req, res) => {
    Category.findAll()
        .then((categories) => {
            // console.log(categories);
            res.render('admin/add-product', {
                title: 'New Product',
                path: '/admin/add-product',
                categories: categories
            });
        }).catch(err => console.log(err));
}

exports.postAddProduct = (req, res) => {

    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryid = req.body.categoryid;
    const user = req.user;

    // user.getProducts user ile ilgili ilişkilendirilmiş productsları getirmektedir.
    user.createProduct({ // burada ise user üzerinden bir ekleme işlemi yapıyoruz.
        // sebebi app.js de belongsTo ilişkisi sayesinde yapabilmekteyiz.
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            CategoryId: categoryid
        }).then((result) => {
            console.log(result)
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

}

exports.getEditProduct = (req, res) => {

    Product.findByPk(req.params.productid)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            Category.findAll()
                .then((categories) => {
                    console.log(categories);
                    res.render('admin/edit-product', {
                        title: 'Edit Product',
                        path: '/admin/products',
                        product: product,
                        categories: categories
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.postEditProduct = (req, res) => {


    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryid = req.body.categoryid;
    Product.findByPk(id)
        .then((product) => {
            product.name = name;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            product.categoryId = categoryid;
            return product.save();
        }).then(() => {
            console.log("Updated")
            res.redirect('/admin/products?action=edit');
        })
        .catch((err) => console.log(err));

}

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productid;

    Product.findByPk(id)
        .then((product) => {
            if (product) {
                return product.destroy();
            } else {
                return redirect('/admin/products');
            }
        }).then(() => {
            console.log("Product Has been deleted")
            res.redirect('/admin/products?action=delete');

        })
        .catch((err) => console.log(err));
    /* Product.destroy({
         where : {id : id}
     }).then(() => {
         res.redirect('/admin/products?action=delete');

     })  //=> ikinci bir silme işlemi
     .catch((err) => console.log(err));  */
}
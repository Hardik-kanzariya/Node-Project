const Category = require("../models/category.model");
const ExtraCategory = require("../models/extraCategory.model");
const SubCategory = require("../models/subCategory.model");
const Product = require("../models/product.model");

exports.addProductPage = async (req, res) => {
  try {
    let categories = await Category.find();
    let subCategories = await SubCategory.find();
    let extraCategories = await ExtraCategory.find();
    return res.render("product/add_product", {
      categories,
      subCategories,
      extraCategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Wrong!!!");
    return res.redirect("back");
  }
};

exports.addNewProduct = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    req.body.productImage = imagePath;

    await Product.create(req.body);
    req.flash("success", "New Product Added.");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Wrong!!!");
    return res.redirect("back");
  }
};

exports.getAllProducts = async (req, res) => {
  const { category, search } = req.query;

    let filter = {};

    if (category) {
        filter['category'] = category;
    }

    if (search) {
        // Case-insensitive regex search on title or description
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { desc: { $regex: search, $options: 'i' } }
        ];
    }
  try {
    let categories = await Category.find();
    let allProducts = await Product.find(filter)
    .populate("category")
    .populate("subcategory")
    .populate("extracategory");
    // console.log(allProducts);
      return res.render("product/view_product", {allProducts, categories});
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Wrong!!!");
    return res.redirect("back");
  }
};

exports.getProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)
    .populate("category")
    .populate("subcategory")
    .populate("extracategory");

      return res.render("product/single_product", {product});
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Wrong!!!");
    return res.redirect("back");
  }
};

exports.editProductPage = async (req, res) => {
  const id = req.params.id;
  try {
      const product = await Product.findById(id);
      const categories = await Category.find();
      const subCategories = await SubCategory.find();
      const extraCategories = await ExtraCategory.find();

      res.render('product/edit_product', {
          product,
          categories,
          subCategories,
          extraCategories,
      });
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Wrong!!!");
    return res.redirect("back");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("Product ID:", product);
    console.log("Request Body:", req.body);
    if (product) {
      if (req.file) {
        imagePath = "";
        if (product.productImage !== "") {
          imagePath = path.join(__dirname, "..", "uploads", product.productImage);
          try {
            await fs.unlinkSync(imagePath);
          } catch (error) {
            console.log("Image Not Found...");
          }
        }

        // Update image path in request body
        imagePath = `/uploads/${req.file.filename}`;
        req.body.productImage = imagePath;
      }

      let updateProduct = await Product.findByIdAndUpdate(product._id, req.body, { new: true });

      if (updateProduct) {
        req.flash("success", "Product updated successfully!");
        return res.redirect(`/product/view-product`);
      } else {
        req.flash("error", "Failed to update product!");
        return res.redirect("back");
      }
    } else {
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Update Error:", error);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};


exports.deleteProduct = async (req, res) => {
  try {
      const { id } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        req.flash('error', "Something went wrong!");
        return res.redirect('/product/view-product');
      }
      req.flash('success', 'Product deleted successfully');
      res.redirect('/product/view-product'); 
  } catch (error) {
    console.error('Error deleting product:', error);
    req.flash('error', 'Server error. Please try again later.');
    res.redirect('/product/view-product');
  }
};

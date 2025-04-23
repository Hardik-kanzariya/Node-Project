const Category = require("../models/category.model");
const Favorite = require("../models/favorite.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");


exports.userPage = async (req, res) => {
  const { category, search, page = 1 } = req.query;
  const limit = 6; // Products per page
  const skip = (page - 1) * limit;
  let filter = {};

  if (category) {
    filter['category'] = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { desc: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const categories = await Category.find();
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const allProducts = await Product.find(filter)
      .populate("category")
      .populate("subcategory")
      .populate("extracategory")
      .skip(skip)
      .limit(limit);

    return res.render("index", {
      categories,
      allProducts,
      currentPage: parseInt(page),
      totalPages,
      selectedCategory: category || "",
      searchQuery: search || "",
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};



exports.singleProduct = async (req, res) =>{
    try {
        let product = await Product.findById(req.params.id)
        .populate("category")
        .populate("subcategory")
        .populate("extracategory");
    
          return res.render("get_product", {product});
      } catch (error) {
        console.log(error);
        req.flash("error", "Something Wrong!!!");
        return res.redirect("back");
      }
}

exports.RegisterUserPage = async (req, res) => {
  try {
    return res.render('user/user-register');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
  }
};


exports.userLoginPage = async (req, res) => {
  try {
    return res.render('user/user-login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
  }
};

  exports.loginUser = async (req, res) => {
    try {
    return res.redirect("/user")     
    } catch (error) {
    return res.redirect("back");
    }
  }

  exports.registerUser = async (req, res) => {
    try {
      let imagePath = "";
      if(req.file){
        imagePath = `/uploads/${req.file.filename}`;
      }

      req.body.userImage = imagePath;
  
      const newUser = await User.create(req.body);
      if (!newUser) {
        req.flash('error', 'Registration failed!');
        return res.redirect('back');
      }
      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/user/user-login');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong!');
      return res.redirect('back');
    }
  }

exports.userLogout = async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error(err);
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
      }
      req.flash('success', 'Logout successfully!');
      return res.redirect('/user/user-login');
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
    return res.redirect('back');
  }
}


exports.addFavoriteProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    await Favorite.create({ userId: userId, productId: productId });
    req.flash('success', 'Product added to favorites!');
    return res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
    return res.redirect('back');
  }
}


exports.getFavouriteList = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await Favorite.find({ userId: userId })
      .populate("productId")
      .populate("userId");
    const categories = await Category.find();
    return res.render("user/favourite_list", { favorites, categories });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
    return res.redirect('back');
  }
}

exports.removeFavoriteProduct = async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    req.flash('success', 'Removed from favorites!');
    return res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Could not remove favorite.');
    return res.redirect('back');
  }
};


exports.addCartProduct = async (req, res) => {
  try {
    if (!req.user) {
      req.flash('error', 'Please log in to add products to your cart.');
      return res.redirect('/user/user-login');
    }

    const userId = req.user._id;
    const productId = req.params.id;

    // Check if product already in cart
    const existing = await Cart.findOne({ userId, productId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      req.flash('info', 'Product quantity updated in cart.');
    } else {
      await Cart.create({ userId, productId, quantity: 1 });
      req.flash('success', 'Product added to cart!');
    }

    return res.redirect('back');
  } catch (error) {
    console.error('[Cart Error]', error);
    req.flash('error', 'Could not add to cart.');
    return res.redirect('back');
  }
};


exports.getCartList = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      req.flash('error', 'User not authenticated.');
      return res.redirect('back');
    }

    // Fetch cart items and populate product details
    const cartItems = await Cart.find({ userId }).populate('productId');

    // Fetch all categories
    const categories = await Category.find();

    // Calculate total price of items in cart
    const totalPrice = cartItems.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0);

    // Render the cart list page
    return res.render("user/cart_list", {
      cartItems,
      categories,
      totalPrice
    });

  } catch (error) {
    console.error('[Cart List Error]', error.message || error);
    req.flash('error', 'Could not fetch cart.');
    return res.redirect('back');
  }
};



// Controller: Update Cart Quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const action = req.query.action;

    const cartItem = await Cart.findById(cartItemId).populate('productId');

    if (!cartItem) {
      req.flash('error', 'Cart item not found.');
      return res.redirect('back');
    }

    if (action === 'plus') {
      cartItem.quantity += 1;
    } else if (action === 'minus') {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        req.flash('info', 'Minimum quantity is 1.');
      }
    } else {
      req.flash('error', 'Invalid action.');
      return res.redirect('back');
    }

    await cartItem.save();
    req.flash('success', 'Cart updated successfully.');
    return res.redirect('back');
  } catch (error) {
    console.error('[Update Cart Quantity Error]', error);
    req.flash('error', 'Failed to update cart quantity.');
    return res.redirect('back');
  }
};



// Controller: Remove From Cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    const deletedItem = await Cart.findByIdAndDelete(cartItemId);

    if (!deletedItem) {
      req.flash('error', 'Item not found or already removed.');
      return res.redirect('back');
    }

    req.flash('success', 'Item removed from cart.');
    return res.redirect('back');
  } catch (error) {
    console.error('[Remove Cart Item Error]', error);
    req.flash('error', 'Failed to remove item from cart.');
    return res.redirect('back');
  }
};

exports.userProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user.id); // Or wherever you get the user

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.render('user/user-profile', { user });
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Server error');
  }
};

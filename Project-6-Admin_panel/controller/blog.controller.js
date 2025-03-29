const Blog = require("../model/blog-model");
const Admin = require("../model/admin.model");
const path = require("path");
const fs = require("fs");

exports.addBlogPage = async (req, res) => {
  if (
    req.cookies == null ||
    req.cookies.admin == undefined ||
    req.cookies.admin._id == undefined
  ) {
    return res.redirect("/");
  } else {
    let admin = await Admin.findById(req.cookies.admin._id);
    return res.render("add-blog", { admin }); 
  }
};

exports.viewAllBlogPage = async (req, res) => {
  if (
    req.cookies == null ||
    req.cookies.admin == undefined ||
    req.cookies.admin._id == undefined
  ) {
    return res.redirect("/");
  } else {
    let loginAdmin = await Admin.findById(req.cookies.admin._id);
    let blogs = await Blog.find(); 
    return res.render("view-blog", { blogs, admin: loginAdmin }); 
  }
};

exports.addNewBlog = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      req.body.image = imagePath; 
    }

    let blog = await Blog.create(req.body); 
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

exports.editBlogPage = async (req, res) => {
  try {
    
    let loginAdmin = await Admin.findById(req.cookies.admin._id);
    let blog = await Blog.findById(req.params.id);
    if (blog) {
      return res.render("edit-blog", { blog , admin: loginAdmin }); 
    }
  } catch (error) {
    console.log(error);
  }
};

exports.singleBlogPage = async (req, res) => {
  try {
    let loginAdmin = await Admin.findById(req.cookies.admin._id);
    let blog = await Blog.findById(req.params.id);
    if (blog) {
      return res.render("single-blog", { blog, admin: loginAdmin }); 
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) return res.redirect("back");

    if (blog.image) {
      let imagePath = path.join(__dirname, "..", "public", blog.image);
      try {
        fs.unlinkSync(imagePath); 
      } catch (error) {
        console.log("Image Not Found...");
      }
    }

    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect("/blog/view-blog"); 
  } catch (error) {
    console.error(error);
    return res.redirect("back");
  }
};

exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (blog) {
      if (req.file) {
        let imagePath = "";
        if (blog.image !== "") {
          imagePath = path.join(__dirname, "..", blog.image);
          try {
            await fs.unlinkSync(imagePath); 
          } catch (error) {
            console.log("Image Not Found...");
          }
        }
        imagePath = `/uploads/${req.file.filename}`;
        req.body.image = imagePath; 
      }

      let updatedBlog = await Blog.findByIdAndUpdate(blog._id, req.body, {
        new: true,
      });
      if (updatedBlog) {
        return res.redirect("/blog/view-blog");
      } else {
        return res.redirect("back");
      }
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
  }
};
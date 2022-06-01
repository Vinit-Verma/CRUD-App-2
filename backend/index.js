const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const categoryModel = require("./models/Category");
const productModel = require("./models/Product");
const userModel = require("./models/User");

let productSchema = require("./models/Product");
const verifyJWT = require("./verify/verifyJWT");

app.use(express.json());
app.use(cors());
// app.use(verifyJWT());

mongoose
  .connect("mongodb://localhost:27017/crudDb2", {})
  .then(() => {
    console.log("Connection established.");
  })
  .catch(() => {
    console.log("Connection not established.");
  });

//fetch catagories
app.get("/readCategory", async (req, res) => {
  categoryModel.find({}, (error, result) => {
    if (error) {
      res.send(error);
    }
    res.send(result);
  });
});
app.get("/", async (req, res) => {
  res.send("Data Inserted");
});

//Post / Insert categories.
app.post("/insertCategory", async (req, res) => {
  const categoryName = req.body.category;
  const category = new categoryModel({ category: categoryName });
  try {
    await category.save();
    res.send("Data Inserted");
  } catch (error) {
    console.log(error);
  }
});

//Post / Insert products.
app.post("/insertProduct", async (req, res) => {
  const cate = req.body.category;
  const product_Name = req.body.product;
  const status = req.body.status;
  const user_id = req.body.user_id;
  // console.log("user id is", req.body);
  const product = new productModel({
    user: user_id,
    cat_id: cate,
    productName: product_Name,
    status: status,
  });
  // console.log("product", product);
  try {
    await product.save();
    res.send("Data Inserted");
  } catch (error) {
    console.log(error);
  }
});

//Populating main table using populate().
app.get("/mainTable", verifyJWT, (req, res) => {
  const user_id = req.headers.user_id;
  productSchema
    .find({ user: user_id })
    .populate("cat_id", "category")
    .exec()
    .then((data) => {
      res.json(data);
    });
});

// app.get("/mainTable", async (req, res) => {
//   productModel.find({}, (error, result) => {
//     if (error) {
//       res.send(error);
//     }
//     res.send(result);
//   });
// });

//Delete an item fron main table.
app.delete("/delete/:id", async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  await productModel.findByIdAndDelete(id).exec();
  res.send("Item deleted");
});

//Edit || Update an item from the main table.
app.put("/update", async (req, res) => {
  const newProductName = req.body.newProductName;
  const newCategory = req.body.newCategory;
  const newStock = req.body.newStock;
  const id = req.body.id;
  // console.log("request ", req.body);
  try {
    await productModel.findById(id, (error, updateItem) => {
      // console.log("to be updated", updateItem);
      updateItem.productName = newProductName;
      updateItem.cat_id = newCategory;
      updateItem.status = newStock;
      updateItem.save();
      res.send("Data Updated");
    });
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});

//SignUp a user.
app.post("/signUp", async (req, res) => {
  const fullName = req.body.fullName;
  const userName = req.body.userName;
  const gender = req.body.gender;
  const password = req.body.password;
  const checked = req.body.checked;

  const takenUserName = await userModel.findOne({ userName: userName });
  if (takenUserName !== null) {
    res.send("userName is unavailable!");
  } else {
    const user = new userModel({
      fullName: fullName,
      userName: userName,
      gender: gender,
      password: password,
      checked: checked,
    });
    try {
      await user.save();
      res.send("User added");
    } catch (error) {
      console.log(error);
    }
  }
});

//Login
app.post("/login", (req, res) => {
  const userLoggingIn = req.body;
  // console.log(userLoggingIn);
  userModel
    .findOne({ userName: userLoggingIn.send_userName })
    .then((dbUser) => {
      // console.log("db user : ", dbUser);
      if (!dbUser) {
        return res.send("Invalid username or password!");
      }
      bcrypt
        .compare(userLoggingIn.send_password, dbUser.password)
        .then((isCorrect) => {
          if (isCorrect) {
            const payload = {
              id: dbUser._id,
              userName: dbUser.userName,
            };
            jwt.sign(
              payload,
              "secret_key",
              { expiresIn: 86400 },
              (err, token) => {
                if (err) return console.log(err);
                return res.send({
                  message: "Success",
                  token: token,
                  user_id: dbUser._id,
                });
              }
            );
          } else {
            return res.send("Invalid username or password");
          }
        });
    });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001...");
});

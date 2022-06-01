const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

// userSchema.method.comparePassword = function (password, cb) {
//   bcrypt.compare(password, this.password, (err, isMatch) => {
//     if (err) return cb(err);
//     else {
//       if (!isMatch) {
//         return cb(null, ismatch);
//       }
//       return cb(null, this);
//     }
//   });
// };

const User = mongoose.model("User", userSchema);
module.exports = User;

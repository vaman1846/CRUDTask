const userModel = require("../models/userModel");
const profileModel = require("../models/profileModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async function (req, res) {
  try {
    let data = req.body;
    let { name, phone, email, password } = data;
    if (await userModel.findOne({ phone: phone })) {
      return res.status(400).send({ message: "Phone Already Exists" });
    }
    if (await userModel.findOne({ email: email }))
      return res.status(400).send({ message: "Email already exist" });

    const encryptedPassword = bcrypt.hashSync(password, 12);
    req.body["password"] = encryptedPassword;

    const savedData = await userModel.create(data);
    res.status(201).send({ status: true, data: savedData });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

exports.login = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "Email Already Exists" });
    }

    const compared = await bcrypt.compare(password, user.password);
    if (!compared) {
      return res.status(400).send({ status: false, message: "Wrong Password" });
    }

    const check = await profileModel.findOne({ email: email });
    const type = check ? "Yes" : "No";
    user.user_datails_submit = type;

    const userId = req.params;
    console.log(userId);

    let token = jwt.sign(
      {
        userId: user._id,
      },
      "project"
    );

    return res.status(200).send({
      status: true,
      message: "User login successfully",
      data: {
        userId: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        password: user.password,
        user_datails_submit: user.user_datails_submit,
        questions: user.questionns,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

exports.createProfile = async function (req, res) {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Some Details" });
    }
    const savedData = await profileModel.create(data);
    res.status(200).send({
      status: true,
      message: "Profile Details Created",
      data: savedData,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};


exports.updateUser = async function (request, response) {
  try {
    const email = request.body.email;

    let update = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { email: email } },
      { new: true }
    );
    if (!update) {
      response.status(404).json({ message: "User not found" });
    } else {
      return response.status(200).send({
        message: "Data updated",
        data: update,
      });
    }
  } catch (error) {
    response.status(500).send({ message: "Internal Server Error" });
  }
};


exports.updateProfile = async function (request, response) {
  try {
    const data = request.body;
    const { book_title, author, category, price } = data;
    let update = await profileModel.findOneAndUpdate(
      {
        book_title: book_title,
        author: author,
        category: category,
        price: price,
      },
      {
        $set: {
          book_title: book_title,
          author: author,
          category: category,
          price: price,
        },
      },
      { new: true }
    );
    if (!update) {
      response.status(404).json({ message: "User not found" });
    } else {
      return response.status(200).send({
        message: "Data Updated",
        data: update,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.deleteProfile = async function (request,response){
  try {
    const data = req.body
    const {book_title,author,category,price} = data
    const user = await profileModel.findOneAndDelete(
      {
        book_title: book_title,
        author: author,
        category: category,
        price: price,
      },
      { new: true }
    );
    if (!user) {
      response.status(404).json({ message: "User not found" });
    } else {
      return response.status(200).send({
        message: "Data Deleted",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}
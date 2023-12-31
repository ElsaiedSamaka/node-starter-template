const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      // virtual attribute that will not be stored in the database but will be returned in the response
      username: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstname} ${this.lastname}`;
        },
      },
      phonenumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          notNull: false,
          isInt: true,
        },
      },
      countrycode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 20,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      user_img: {
        type: DataTypes.TEXT,
      },
      cloudinary_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your password",
          },
          notEmpty: {
            msg: "Please provide your password",
          },
        },
      },
      passwordConfirmation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      indexes: [{ fields: ["email"] }],
      validate: {
        passwordMatch() {
          if (this.password !== this.passwordConfirmation) {
            throw new Error("password and passwordConfirmation must match");
          } else {
            this.password = bcrypt.hashSync(this.password, 10);
            this.passwordConfirmation = this.password;
          }
        },
      },
      hooks: {
        beforeUpdate: (record, options) => {
          console.log("record updated xxxxxxxxxxxxxxxxxxx");
        },
        afterDestroy: async (user, options) => {
          await db.reviews.destroy({
            where: { userId: user.id },
            transaction: options.transaction,
          });
        },
      },
    }
  );
  return User;
};

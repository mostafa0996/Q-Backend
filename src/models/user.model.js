const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate_users } = require('./plugins');
const { roles, authEnum } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      default: '',
    },
    last_name: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value !== '' && value !== null && !validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    login_with: {
      type: String,
      enum: authEnum,
      default: authEnum[0],
    },
    fcm: {
      type: [String],
      default: [],
    },
    active: {
      type: Number,
      default: 0,
    },
    guest: {
      type: Number,
      default: 0,
    },
    trade_licence: {
      type: String,
      default: '',
    },
    company_name: {
      type: String,
      default: '',
    },
    area: {
      type: String,
      default: '',
    },
    profile: {
      type: String,
      default: '',
    },
    lat: {
      type: String,
      default: '',
    },
    lng: {
      type: String,
      default: '',
    },
    loc: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [30.564058, 76.44762696] },
    },
    locationText: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    date_issue_licences: {
      type: Date,
      default: null,
    },
    date_expired_licences: {
      type: Date,
      default: null,
    },
    permissions: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'permissions',
      required: false
    }],
    categories: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Categories',
      required: false
    }],
    categoryWithVechiles: [{
      category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Categories',
        required: false
      },
      countOfVechiles: {
        type: Number,
        default: 0,
      }
    }],
    city: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'City',
    },
    company: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: false
    },

    createdAt: {
      default: Date.now,
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate_users);
userSchema.index({ loc: "2dsphere" })





/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  console.log(phone, excludeUserId)
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  console.log(user)
  return !!user;
};

userSchema.statics.Phone = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return user;
};




/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */


userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;

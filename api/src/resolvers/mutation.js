const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const gravatar = require('../gravatar');

const { AuthenticationError, ForbiddenError } = require('apollo-server-express')

module.exports = {
    addBook: async (parent, args, { models, user }) => {
        if (!user) {
            throw new AuthenticationError("You must login to create a new book")
        }

        // check if book already exist
        const book = await models.Book.findOne({ title: args.title });

        // if book already exist
        if (book) {
            throw new AuthenticationError('Book already exist.');
        }

        return await models.Book.create({
            title: args.title,
            author: mongoose.Types.ObjectId(user.id)
        });
    },
    updateBook: async (parent, { id, title, author }, { models, user }) => {
        if (!user) {
            throw new AuthenticationError('You must sign in to update a book.');
        };

        // get the book by id
        const book = await models.Book.findById(id);

        // check book author and current user are not the same raise forbidden error
        if (book && String(book.author) !== user.id) {
            throw new AuthenticationError("You don't have permission to modify the book.");
        }

        return models.Book.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: { 
                    title
                }
            },
            {
                new: true
            }
        )
    },
    deleteBook: async (parent, { id }, { models, user }) => {
        if (!user) {
            throw new AuthenticationError('You must sign in to delete a book.');
        }

        const book = await models.Book.findById(id);

        if (book && String(book.author) !== user.id) {
            throw new Error("You don't have permission to delete a book.");
        }

        try {
            await book.remove();
            return true;
        } catch (error) {
            return false;
        }
    },
    signUp: async (parent, { username, email, password }, { models }) => {
        // normalize email address
        email = email.trim().toLowerCase();

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        // create the gravatar
        const avatar = gravatar(email);

        try {
            // create user
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });

            // create and return json web token
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch (error) {
            console.error(error);
            throw new Error("Error creating account");
        }
    },
    signIn: async (parent, { username, email, password }, { models }) => {
        if (email) {
            email = email.trim().toLowerCase();
        }

        const user = await models.User.findOne({
            $or: [{ username }, { email }]
        });

        // if there is no user throw new authentication error
        if (!user) {
            throw new AuthenticationError("Error signing in");
        }

        // if the password doesn't match, throw new authentication error
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new AuthenticationError("Error signing in");
        }

        // create and return the json web token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },
    toggleFavorite: async (parent, { id }, { models, user }) => {
        if (!user) {
            throw new Error("You must log in.");
        }

        // check user already made favorite the book
        let bookCheck = await models.Book.findById(id);
        const hasUser = bookCheck.favoritedBy.indexOf(user.id);

        // if the user exist in the list 
        // pull them from the list and reduce the favoriteCount by 1
        if (hasUser >= 0) {
            return await models.Book.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    // set new to true to return the updated doc
                    new: true
                }
            )
        } else {
            // if user doesn't exist in the list
            // add them to the list and increment the favoriteCount by 1

            return await models.Book.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new: true
                }
            )
        }
    }
}
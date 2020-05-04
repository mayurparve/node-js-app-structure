'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('user',
        {
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                isAlphaNumeric: true,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: {
                        msg: "Name is required"
                    },
                    len: {
                        args: [5, 15],
                        msg: "Name must be between 5 to 15 characters"
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                isAlphaNumeric: true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                isAlphaNumeric: true,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM('Admin', 'User'),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Role is required"
                    }
                }
            }
        },
        {
            engine: 'InnoDB',
            charset: 'utf8mb4',
            underscored: true,
            paranoid: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        });

    // hooks (crete hash password)
    model.beforeCreate(async (user, options) => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
    });

    // instance methods (crete jwt token)
    model.prototype.getSignedJwtToken = (userId) => {
        return jwt.sign({
            id: userId
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        })
    }

    // instance methods (match password)
    model.prototype.matchPassword = async (enteredPassword, password) => {
        console.log(this.password);
        return bcrypt.compareSync(enteredPassword, password);
    }

    return model;
}
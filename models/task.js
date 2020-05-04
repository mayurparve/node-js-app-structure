'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('task',
        {
            task_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            task_name: {
                type: DataTypes.STRING,
                isAlphaNumeric: true,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: {
                        msg: "Task name is required"
                    },
                    len: {
                        args: [5, 10],
                        msg: "Task name must be between 5 to 10 characters"
                    }
                }
            },
            task_description: {
                type: DataTypes.STRING(1000),
                isAlphaNumeric: true,
                allowNull: true
            },
            task_priority: {
                type: DataTypes.ENUM('Low', 'Medium', 'High'),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Priority is required"
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
        })
}
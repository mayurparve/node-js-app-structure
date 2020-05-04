'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Associations

//permissions
//db.config_matrix.hasMany(db.master_customer_group);
//db.config_matrix.hasMany(db.master_customers);
//db.master_customer_group.hasMany(db.master_customers);
//db.master_customers.hasMany(db.master_customer_contracts);

//users
//db.master_customer_group.belongsTo(db.config_matrix);
//db.master_customers.belongsTo(db.config_matrix);
//db.master_customers.belongsTo(db.master_customer_group);
//db.master_customer_contracts.belongsTo(db.master_customers);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

import { db } from "../config/Database.js";

const { DataTypes } = db.Sequelize;

const Users = db.define('employees', {
  emp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  access: {
    type: DataTypes.STRING, 
    allowNull: false,
    get() {
      
      const accessStr = this.getDataValue('access');
      return accessStr ? accessStr.split(',') : [];
    },
    set(access) {
      if (Array.isArray(access)) {
          this.setDataValue('access', access.join(','));
      } else {
          this.setDataValue('access', access);
      }
  }
  },
  role: {
    type: DataTypes.ENUM('user', 'manager', 'admin'), 
    allowNull: false,
  },
  ownership: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'employees',
  timestamps: false,
  freezeTableName: true,
});

export default Users;
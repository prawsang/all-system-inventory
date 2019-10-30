const Branch = require("./Branch");
const Bulk = require("./Bulk");
const Customer = require("./Customer");
const Department = require("./Department");
const Item = require("./Item");
const Model = require("./Model");
const ProductType = require("./ProductType");
const Return = require("./Return");
const Staff = require("./Staff");
const Supplier = require("./Supplier");
const Withdrawal = require("./Withdrawal");

Branch.belongsTo(Customer, {
	foreignKey: "owner_customer_code",
	as: "customer"
});
Customer.hasMany(Branch, {
	foreignKey: "owner_customer_code",
	as: "branches"
});
Bulk.belongsTo(Model, {
    foreignKey: "of_model_code",
	as: "model"
});
Model.hasMany(Bulk, {
	foreignKey: "of_model_code",
	as: "bulks"
});
Item.belongsTo(Branch, {
	foreignKey: "reserved_branch_code",
	as: "reserve_branch"
});
Item.belongsTo(Bulk, {
	foreignKey: "from_bulk_code",
	as: "bulk"
});
Bulk.hasMany(Item, {
	foreignKey: "from_bulk_code"
})
Item.hasMany(Return, {

	foreignKey: "serial_no",
	as: "returns"
});
Model.belongsTo(ProductType, {
	foreignKey: "is_product_type_name",
	as: "product_type"
});
Model.belongsTo(Supplier, {
	foreignKey: "from_supplier_code",
	as: "supplier"
});
Supplier.hasMany(Model, {
	foreignKey: "from_supplier_code",
	as: "models"
});
Staff.belongsTo(Department, {
	foreignKey: "works_for_dep_code",
	as: "department"
});
Department.hasMany(Staff, {
	foreignKey: "works_for_dep_code",
	as: "staffs"
});
Withdrawal.belongsTo(Branch, {
	foreignKey: "for_branch_code",
	as: "branch"
});
Branch.hasMany(Withdrawal, {
	foreignKey: "for_branch_code",
	as: "withdrawals"
});

Withdrawal.belongsTo(Department, {
	foreignKey: "for_department_code",
	as: "department"
});
Department.hasMany(Withdrawal, {
	foreignKey: "for_department_code",
	as: "withdrawals"
});

Withdrawal.belongsTo(Staff, {
	foreignKey: "created_by_staff_code",
	as: "staff"
});
Staff.hasMany(Withdrawal, {
	foreignKey: "created_by_staff_code",
	as: "withdrawals"
});

Withdrawal.belongsToMany(Item, {
	through: "withdrawal_has_item",
	foreignKey: "withdrawal_id",
	otherKey: "serial_no",
	as: "items"
});
Item.belongsToMany(Withdrawal, {
	through: "withdrawal_has_item",
	foreignKey: "serial_no",
	otherKey: "withdrawal_id",
	as: "withdrawals"
});

const models = {
    Branch,
    Bulk,
    Customer,
    Department,
    Item,
    Model,
    ProductType,
    Return,
    Staff,
    Supplier,
    Withdrawal,
}

module.exports = models;
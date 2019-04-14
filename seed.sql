DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT(11) NOT NULL auto_increment,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) null,
  stock_quantity INT(8) NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE sales (
    sale_id INT (16) NOT NULL auto_increment, 
	item_id INT(11) NOT NULL,
    sold_quantity INT(9) NULL,
    primary key (sale_id)
    );
  
DROP DATABASE IF EXISTS top_songsDB;
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
	item_id INT(11) NOT NULL,
    sold_quantity INT(9) NULL,
    primary key (item_id)
    );
  
//packages
var inquirer = require("inquirer")
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    else {
        console.log("connected");
        bamazonVendorOptions();
    }
});

function bamazonVendorOptions() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "Thank you for being a Bamazon(TM) vendor! How can we help you today?",
        choices: ["checkItemStatus", "newItem", "updateQuantity", "checkLowStock", "Exit"]
    }
        //user selection call appropriate function
    ).then(function (ans) {
        if (ans.menu == "checkItemStatus") {
            //calls function for user to see all items
            bamazonDisplayItems()
        }
        else if (ans.menu == "newItem") {
            bamazonAddItem()
        }
        else if (ans.menu == "updateQuantity") {
            bamazonUpdateItem()
        }
        else if (ans.menu == "checkLowStock") {
            bamazonCheckLowStock()
        }
        else {
            //ends the connection when user selects exit
            connection.end()
        }
    })
}

function bamazonDisplayItems() {
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " " + res[i].product_name + " $" + res[i].price + " Stock: " + res[i].stock_quantity + " Department: " + res[i].department_name)
            }
            bamazonVendorOptions()
        })
}

function bamazonAddItem() {
    inquirer.prompt([
        {
            name: "itemName",
            type: "input",
            message: "What is the name of the item you are adding?"
        },
        {
            name: "departmentName",
            type: "input",
            message: "What is the name of the department this item is in?"
        },
        {
            name: "price",
            type: "number",
            message: "What is the price of a unit of this item?"
        },
        {
            name: "stock",
            type: "number",
            message: "How many units of this item are for sale?"
        }

    ]).then(function (ans) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: ans.itemName,
                department_name: ans.departmentName,
                price: ans.price,
                stock_quantity: ans.stock
            },
            function (err) {
                if (err) throw err
                console.log("New item added")
                bamazonDisplayItems()
            }

        )
    })
}

function bamazonUpdateItem() {
    inquirer.prompt([
        {
            name: "itemToUpdate",
            type: "number",
            message: "Enter the id of the item you want to update."
        },
        {
            name: "itemQuantity",
            type: "number",
            message: "Enter the new quantity of the item."
        }
    ]).then(function (ans) {
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: ans.itemQuantity
                },
                {
                    item_id: ans.itemToUpdate
                }
            ],
            function (err) {
                if (err) throw err
                console.log("Item Updated")
                bamazonDisplayItems()
            }
        )
    }

    )
}

function bamazonCheckLowStock() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity <= 5",
        function (err, res) {
            if (err) throw err
            for (var i = 0; i < res.length; i++){
                    console.log(res[i].item_id + " " + res[i].product_name + " $" + res[i].price + " Stock: " + res[i].stock_quantity + " Department: " + res[i].department_name)
                }
            bamazonVendorOptions()
        })
}
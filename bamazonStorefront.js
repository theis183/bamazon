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
        bamazonBuy();
    }
});

/* //launch the store, brings up to buy, sell or exit
function launchStore() {
    inquirer.prompt({
        name: "buyOrSell",
        type: "list",
        message: "Would you like to buy or sell on Bamazon(TM)? ",
        choices: ["Buy", "Sell", "Exit"]
    }
        //user selection call appropriate function
    ).then(function (ans) {
        if (ans.buyOrSell == "Buy") {
            //calls function for user to buy one of the items
            bamazonBuy()
        }
        else if (ans.buyOrSell == "Sell") {
            bamazonSell()
        }
        else {
            //ends the connection when user selects exit
            connection.end()
        }
    })
} */

function bamazonBuy() {
    console.log("made it to the buy section")
    //query the entire table to display to the user
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " " + res[i].product_name + " $" + res[i].price)
            }
            //prompts user for which item and how many
            inquirer.prompt([
                {
                    type: "number",
                    name: "itemPurchased",
                    message: "Please enter the id of the item you would like to buy.",
                },
                {
                    type: "number",
                    name: "numberPurchased",
                    message: "Please enter the quantity you would like to purchase.",
                    default: 1
                }
            ]).then(function (ans) {
                //query for the user sellected item
                connection.query(
                    "SELECT * FROM products WHERE ?",
                    { item_id: ans.itemPurchased },
                    function (err, res) {
                        if (err) throw err
                        //check if the user asked for more than the stock
                        if (ans.numberPurchased > res[0].stock_quantity) {
                            console.log("We're sorry, only " + res[0].stock_quantity + " " + res[0].product_name + "are available.")
                            //return to the original screen
                            bamazonBuy()
                        }
                        //if there is enough stock
                        else {
                            //updates the product table changing quantity based on how many the user requested
                            connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [{
                                    stock_quantity: res[0].stock_quantity - ans.numberPurchased
                                },
                                {
                                    item_id: res[0].item_id
                                }],
                                function (err) {
                                    if (err) throw err
                                    //displays the final invoice to the user
                                    console.log("Successfully purchased " + ans.numberPurchased + " " + res[0].product_name + " for $" + ans.numberPurchased * res[0].price)
                                    //insert the sale into the sales table
                                    connection.query(
                                        "INSERT INTO sales SET ?",
                                        {
                                            item_id: res[0].item_id,
                                            sold_quantity: ans.numberPurchased
                                        },
                                        function (err) {
                                            if (err) throw err
                                            bamazonBuy()
                                        }

                                    )

                                }
                            )
                        }
                    }

                )
            })

        }
    )
}

/* function bamazonSell() {
    console.log("made it to the sell section")
} */
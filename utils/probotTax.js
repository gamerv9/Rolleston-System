function tax(amount) {
    if(!amount){
        return console.log("you should specify amount")
    }
    if (amount.toString().endsWith("m")) amount = Number(amount.replace(/m/gi, "")) * 1000000;
    else if (amount.toString().endsWith("k")) amount = Number(amount.replace(/k/gi, "")) * 1000;
    if (isNaN(amount)) {
        return console.log("Amount should be number")
    }

    amount = String(amount)
    let tax = Math.floor(Number(amount) * 20 / 19 + 1)
    return tax;
}

module.exports = tax;
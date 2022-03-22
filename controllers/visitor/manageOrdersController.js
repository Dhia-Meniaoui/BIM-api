const Order = require('../../models/order-model');

// Order moovobrain { order body => none }
const addMoovobrainOrder = async function(req,res){
    const order = new Order(req.body);
    try{
        await order.save();
        res.status(200).send();
    }catch (error) {
        console.log(error);
        res.status(400).send();
    }
}

module.exports = {addMoovobrainOrder};

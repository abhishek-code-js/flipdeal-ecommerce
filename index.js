const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
app.use(cors());

const port = 3010;

app.use(express.static('static'));

//SERVER SIDE VALUES
let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

function totalCartPrice(newItemPrice, cartTotal) {
  return (newItemPrice + cartTotal).toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(totalCartPrice(newItemPrice, cartTotal));
});

function membershipDiscount(cartTotal, isMember) {
  let discountedPrice = cartTotal - (discountPercentage / 100) * cartTotal;
  if (isMember) {
    return discountedPrice.toString();
  } else {
    return cartTotal.toString();
  }
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(membershipDiscount(cartTotal, isMember));
});

function calculateTax(cartTotal) {
  let tax = (taxRate / 100) * cartTotal;
  return tax.toString();
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal));
});

function estimateDelivery(distance, shippingMethod) {
  let noOfDeliveryDays;
  if (shippingMethod.toLowerCase() == 'standard') {
    noOfDeliveryDays = distance / 50;
  } else if (shippingMethod.toLowerCase() == 'express') {
    noOfDeliveryDays = distance / 100;
  }
  return noOfDeliveryDays.toString();
}

app.get('/estimate-delivery', (req, res) => {
  let distance = parseFloat(req.query.distance);
  let shippingMethod = req.query.shippingMethod;
  res.send(estimateDelivery(distance, shippingMethod));
});

function shippingCost(distance, weight) {
  return (weight * distance * 0.1).toString();
}

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(shippingCost(distance, weight));
});

function loyaltyPoints(purchaseAmount) {
  return (purchaseAmount * loyaltyRate).toString();
}

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(loyaltyPoints(purchaseAmount));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const express = require("express");
const app = express();
const cors = require("cors");
const registration = require("./routes/registration");
const authentication = require('./routes/authentication');
const managersettings = require('./routes/managersettings');
const order = require('./routes/order');
const admin = require('./routes/admin');
const mobile = require('./routes/mobile');


const authenticateToken = require('./routes/jwtverification');
require('dotenv').config();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'authorization']
}));

app.use(express.json());

app.get("/test", async (req, res) => {
    res.json("OK")
});

app.post("/registration/signup", (req, res) => registration.initialSignUp(req, res));
app.post("/registration/checkregistration", (req, res) => registration.checkRegistration(req, res));
app.post("/registration/resetregistration", (req, res) => registration.resetRegistration(req, res));
app.post("/registration/resetpassword", (req, res) => registration.updatePassword(req, res));
app.post("/registration/forgotpassword", (req, res) => registration.forgotPassword(req, res));

app.post("/authentication/login", (req, res) => authentication.login(req, res));

app.post("/managersettings/addgroup", authenticateToken, (req, res) => managersettings.addGroup(req, res));
app.post("/managersettings/getgroupsbyyear", authenticateToken, (req, res) => managersettings.getGroupsByYear(req, res));
app.post("/managersettings/updategroup", authenticateToken, (req, res) => managersettings.updateGroup(req, res));
app.post("/managersettings/deletegroup", authenticateToken, (req, res) => managersettings.deleteGroup(req, res));
app.post("/managersettings/deletegroup", authenticateToken, (req, res) => managersettings.deleteGroup(req, res));
app.get("/managersettings/getlogs", authenticateToken, (req, res) => managersettings.getLogs(req, res));
app.get("/managersettings/getitems", authenticateToken, (req, res) => managersettings.getItems(req, res));
app.post("/managersettings/updateitem", authenticateToken, (req, res) => managersettings.updateItem(req, res));
app.post("/managersettings/deleteitems", authenticateToken, (req, res) => managersettings.deleteItem(req, res));
app.post("/managersettings/addadmin", (req, res) => managersettings.addAdmin(req, res));


app.post("/order/checkterms", authenticateToken, (req, res) => order.checkTerms(req, res));
app.post("/order/updateterms", authenticateToken, (req, res) => order.updateTerms(req, res));
app.post("/order/createorder", authenticateToken, (req, res) => order.createOrder(req, res));
app.post("/order/updateorder", authenticateToken, (req, res) => order.updateOrder(req, res));
app.post("/order/deleteorder", authenticateToken, (req, res) => order.deleteOrder(req, res));
app.post("/order/deleteitem", authenticateToken, (req, res) => order.deleteItem(req, res));
app.post("/order/getorders", authenticateToken, (req, res) => order.getOrders(req, res));
app.post("/order/getorderitemsandtotals", authenticateToken, (req, res) => order.getOrderItemsAndTotals(req, res));
app.post("/order/getgrouptotals", authenticateToken, (req, res) => order.getGroupTotals(req, res));
app.post("/order/downloadlabels", authenticateToken, (req, res) => order.downloadLabels(req, res));
app.post("/order/getorderitemswithquantity", authenticateToken, (req, res) => order.getOrderItemsWithQuantity(req, res));

app.post("/admin/getitemtotals", authenticateToken, (req, res) => admin.getItemTotals(req, res));
app.post("/admin/getstudents", authenticateToken, (req, res) => admin.getUsers(req, res));
app.post("/admin/getorders", authenticateToken, (req, res) => admin.getOrders(req, res));
app.post("/admin/getitems", authenticateToken, (req, res) => admin.getItems(req, res));
app.post("/admin/updatebalance", authenticateToken, (req, res) => admin.updateBalance(req, res));
app.get("/admin/getadmins", authenticateToken, (req, res) => admin.getAdmins(req, res));

app.post("/mobile/scanin", authenticateToken, (req, res) => mobile.scanIn(req, res));
app.post("/mobile/getorderbybarcode", authenticateToken, (req, res) => mobile.getOrderByBarcode(req, res));













app.listen(3000, () => {
    console.log("App listening on port: 3000");
});
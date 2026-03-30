import React from "react";
import { Route } from "react-router-dom";

export default (
  <Route>
    <Route path="/" />
    <Route path="/login" />
    <Route path="/register" />
    <Route path="/forgot-password" />
    <Route path="/reset-password/:token" />
    <Route path="/verify" />
    <Route path="/products" />
    <Route path="/admin" />
    <Route path="/offers" />
    <Route path="/orders" />
    <Route path="/order-history" />
    <Route path="/wishlist" />
    <Route path="/search" />
  </Route>
);

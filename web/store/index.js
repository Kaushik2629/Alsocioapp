import React, { Component } from 'react';
import showCart from '../reducers/showCart'
import {createStore} from 'redux';

const store = createStore(showCart)

export default store;

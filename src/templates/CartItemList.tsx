import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CartTable from '../components/CartTable'
import OrderForm from '../components/OrderForm'
import { setCart_action, setItems_action, setToppings_action } from '../redux/products/operations'
import { CartItem, InitialState, Item, ItemInfo, Topping } from '../redux/store/initialState'

const itemsSelector = (state: InitialState) => state.products.items
const toppingsSelector = (state: InitialState) => state.products.toppings
const userSelector = (state: InitialState) => state.user
const cartSelector = (state: InitialState) => state.products.cart
const ordersSelector = (state: InitialState) => state.products.orders


const CartItemList = () => {
  const dispatch = useDispatch();
  const getItems = useSelector(itemsSelector);
  const getToppings = useSelector(toppingsSelector);
  const getUser = useSelector(userSelector);
  const getCart = useSelector(cartSelector);
  const getOrders = useSelector(ordersSelector);
  console.log(getOrders)

  useEffect(() => {
    dispatch(setItems_action());
    dispatch(setToppings_action());
  }, [])

  useEffect(() => {
    if(getUser){
      dispatch(setCart_action(getUser))
    }
  }, [getUser])

  // 注文に進む際のトリガー処理
  const [show, setShow] = useState<boolean>(false)
  return (
    <div>
      <p>ショッピングカート</p>
      <CartTable getCart={getCart} getItems={getItems} getToppings={getToppings}/>
      <Button onClick={() => setShow(!show)}>注文に進む</Button>
      {show ? 
      <OrderForm/>
      :
      <></>
      }
    </div>
  )
}

export default CartItemList
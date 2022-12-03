import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem/CartItem";
import Checkout from "./Checkout";
// import axios from "axios";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const ctxCart = useContext(CartContext);

  const totalAmount = `₹${ctxCart.totalAmount.toFixed(2)}`;

  const hasItems = ctxCart.items.length > 0;

  const cartItemAddHanlder = (item) => {
    ctxCart.addItem({ ...item, amount: 1 });
  };

  const cartItemRemoveHandler = (id) => {
    ctxCart.removeItem(id);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const orderSubmitHandler = (userData) => {
    const firebaseapi = "https://react-http-75e6f-default-rtdb.firebaseio.com/orders.json"
    setIsSubmitting(true);
    fetch(firebaseapi, {
      method: "POST",
      body: JSON.stringify({
        user: userData,
        orderedItems: ctxCart.items,
      }),
    });
    // axios.post('https://peddadameals.herokuapp.com/addorder', {
    //   user: userData,
    //   orderedItems: ctxCart.items
    // })
    setIsSubmitting(false);
    setDidSubmit(true);
    ctxCart.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {ctxCart.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onAdd={cartItemAddHanlder.bind(null, item)}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onHideCart}>
        {" "}
        Close{" "}
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          {" "}
          Order{" "}
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span> Total Amount </span>
        <span> {totalAmount} </span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={orderSubmitHandler} onCancel={props.onHideCart} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p> Submitting order data... </p>;
  const didSubmitModalContent = (
    <React.Fragment>
      <p> Succesfully sent the order </p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onHideCart}>
        {" "}
        Close{" "}
      </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onHideCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;






// fetch("http://localhost:8080/addorder", {
//       method: "POST",
//       body: JSON.stringify({
//         user: userData,
//         orderedItems: ctxCart.items,
//       }),
//     });
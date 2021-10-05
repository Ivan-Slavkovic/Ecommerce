import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "./UserContext";
import Order from "./Order";
import { OrdersService, ProductsService } from "./Service";
//get previous orders
// let getPreviousOrderds = (orders) => {
//   return orders.filter((ord) => ord.isPaymentCompleted === true);
// };

// //get Cart
// let getCart = (orders) => {
//   return orders.filter((ord) => ord.isPaymentCompleted === false);
// };

let Dashboard = (props) => {
  let [orders, setOrders] = useState([]);
  //get context
  let userContext = useContext(UserContext);

  //executes only once - on initial render = componentDidMount
  useEffect(() => {
    document.title = "Dashboard - eCommerce";

    //load data from database
    (async () => {
      let ordersResponse = await fetch(
        `http://localhost:5000/orders?userid=${userContext.user.currentUserId}`,
        { method: "GET" }
      );

      if (ordersResponse.ok) {
        let ordersResponseBody = await ordersResponse.json();

        //get all data from products
        let productsResponse = await ProductsService.fetchProducts();
        let productsResponseBody = await productsResponse.json();

        //read all orders data
        ordersResponseBody.forEach((order) => {
          order.product = ProductsService.getProductByProductId(
            productsResponseBody,
            order.productId
          );
        });

        // console.log(ordersResponseBody);
        setOrders(ordersResponseBody);
      }
    })();
  }, [userContext.user.currentUserId]);

  return (
    <div className="row">
      <div className="col-12 py-3 header">
        <h4>
          <i className="fa fa-dashboard"></i> Dashboard
        </h4>
      </div>
      <div className="col-12">
        <div className="row">
          {/*previous order starts*/}
          <div className="col-lg-6">
            <h4 className="py-4 my-2 text-info border-bottom">
              <i className="fa fa-history"></i>Previous Orders{" "}
              <span className="badge badge-info">
                {OrdersService.getPreviousOrderds(orders).length}
              </span>
            </h4>
            {OrdersService.getPreviousOrderds(orders).length === 0 ? (
              <div className="text-danger">No Orderds</div>
            ) : (
              ""
            )}

            {OrdersService.getPreviousOrderds(orders).map((ord) => {
              return (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  userId={ord.userId}
                  isPaymentCompleted={ord.isPaymentCompleted}
                  quantity={ord.quantity}
                  productName={ord.product.productName}
                  price={ord.product.price}
                />
              );
            })}
          </div>
          {/*previous order ends*/}

          {/*cart starts*/}
          <div className="col-lg-6">
            <h4 className="py-4 my-2 text-primary border-bottom">
              <i className="fa fa-shopping-cart"></i>Cart{" "}
              <span className="badge badge-primary">
                {OrdersService.getCart(orders).length}
              </span>
            </h4>

            {OrdersService.getCart(orders).length === 0 ? (
              <div className="text-danger">No products in your cart</div>
            ) : (
              ""
            )}
            {OrdersService.getCart(orders).map((ord) => {
              return (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  userId={ord.userId}
                  isPaymentCompleted={ord.isPaymentCompleted}
                  quantity={ord.quantity}
                  productName={ord.product.productName}
                  price={ord.product.price}
                />
              );
            })}
          </div>
          {/*cart ends*/}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

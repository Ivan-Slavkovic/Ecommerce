import React, { useEffect, useContext, useState, useCallback } from "react";
import { UserContext } from "./UserContext";
import Order from "./Order";
import { OrdersService, ProductsService } from "./Service";

let Dashboard = (props) => {
  let [orders, setOrders] = useState([]);
  let [showOrderDeletedAlert, setShowOrderDeletedAlert] = useState(false);
  let [showOrderPlaceedAlert, setShowOrderPlacedAlert] = useState(false);
  //get context
  let userContext = useContext(UserContext);

  //loadDataFromDatabase function that fetches data from 'orders' array from json file
  let loadDataFromDatabase = useCallback(async () => {
    //load data from database
    let ordersResponse = await fetch(
      `http://localhost:5000/orders?userid=${userContext.user.currentUserId}`,
      { method: "GET" }
    );

    if (ordersResponse.ok) {
      //status code is 200
      let ordersResponseBody = await ordersResponse.json();

      //get all data from products
      let productsResponse = await ProductsService.fetchProducts();
      if (productsResponse.ok) {
        let productsResponseBody = await productsResponse.json();

        //read all orders data
        ordersResponseBody.forEach((order) => {
          order.product = ProductsService.getProductByProductId(
            productsResponseBody,
            order.productId
          );
        });

        console.log(ordersResponseBody);

        setOrders(ordersResponseBody);
      }
    }
  }, [userContext.user.currentUserId]);

  //executes only once - on initial render =  componentDidMount
  useEffect(() => {
    document.title = "Dashboard - eCommerce";

    loadDataFromDatabase();
  }, [userContext.user.currentUserId, loadDataFromDatabase]);
  //When the user click on Buy Now
  let onBuyNowClick = useCallback(
    async (orderId, userId, productId, quantity) => {
      if (window.confirm("Do you want to place order for this product?")) {
        let updateOrder = {
          id: orderId,
          productId: productId,
          userId: userId,
          quantity: quantity,
          isPaymentCompleted: true,
        };
        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          {
            method: "PUT",
            body: JSON.stringify(updateOrder),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        let orderResponseBody = await orderResponse.json();
        if (orderResponse.ok) {
          console.log(orderResponseBody);
          loadDataFromDatabase();
          setShowOrderPlacedAlert(true);
        }
      }
    },
    [loadDataFromDatabase]
  );

  //When the user clicks on Delete button
  let onDeleteClick = useCallback(
    async (orderId) => {
      if (window.confirm("Do you want to place order for this product?")) {
        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          { method: "DELETE" }
        );
        if (orderResponse.ok) {
          let orderResponseBody = await orderResponse.json();
          console.log(orderResponseBody);
          loadDataFromDatabase();
          setShowOrderDeletedAlert(true);
        }
      }
    },
    [loadDataFromDatabase]
  );

  return (
    <div className="row">
      <div className="col-12 py-3 header">
        <h4>
          <i className="fa fa-dashboard"></i> Dashboard{" "}
          <button
            className="btn btn-sm btn-info"
            onClick={loadDataFromDatabase}
          >
            <i className="fa fa-refresh"></i>Refresh
          </button>
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
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
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

            {showOrderPlaceedAlert ? (
              <div className="col-12">
                <div
                  className="alert alert-success alert-dismissible fade show mt-1"
                  role="alert"
                >
                  Your order has been placed
                  <button className="close" type="button" data-dismiss="alert">
                    <span>&times</span>
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}

            {showOrderDeletedAlert ? (
              <div className="col-12">
                <div
                  className="alert alert-danger alert-dismissible fade show mt-1"
                  role="alert"
                >
                  Your item has been removed from the cart
                  <button className="close" type="button" data-dismiss="alert">
                    <span>&times</span>
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}

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
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
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

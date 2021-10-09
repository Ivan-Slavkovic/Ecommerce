import react from "react";
import React, { useState, useEffect, useCallback } from "react";
import { CategoriesService, BrandsService, SortService } from "./Service";
function ProductsList(props) {
  //state
  let [search, setSearch] = useState("");
  let [products, setProducts] = useState([]);
  let [sortBy, setSortBy] = useState("productName");
  let [sortOrder, setSortOrder] = useState("ASC"); //ASC or DESC aka Ascending and Descending
  let [originalProducts, setOriginalProducts] = useState([]);

  //useEffect - execute a callback function when the compoent is rendered for the first time
  useEffect(() => {
    (async () => {
      //request to brands table
      let brandsResponse = await BrandsService.fetchBrands();
      let brandsResponseBody = await brandsResponse.json();

      //request to categories table
      let categoriesResponse = await CategoriesService.fetchCategories();
      let categoriesResponseBody = await categoriesResponse.json();

      //request to products table
      let productsResponse = await fetch(
        `http://localhost:5000/products?productName_like=${search}&_sort=productName&_order=ASC`,
        { method: "GET" }
      );
      let productsResponseBody = await productsResponse.json();

      //setCategory property into each product
      productsResponseBody.forEach((product) => {
        product.category = CategoriesService.getCategoryByCategoryId(
          categoriesResponseBody,
          product.categoryId
        );
        product.brand = BrandsService.getBrandByBrandId(
          brandsResponseBody,
          product.brandId
        );
      });

      setProducts(productsResponseBody);
      setOriginalProducts(productsResponseBody);
    })();
  }, [search]);

  //when the user click on a column name to sort
  let onSortColumnNameClick = (event, columnName) => {
    event.preventDefault(); //avoid refresh
    setSortBy(columnName);
    let negatedSortOrder = sortOrder === "ASC" ? "DESC" : "ASC";
    setSortOrder(negatedSortOrder);
    setProducts(
      SortService.getSortedArray(originalProducts, columnName, negatedSortOrder)
    );
  };

  let getColumnHeader = (columnName, displayName) => {
    return (
      <React.Fragment>
        <a
          href="/#"
          onClick={(event) => {
            onSortColumnNameClick(event, columnName);
          }}
        >
          {displayName}
        </a>{" "}
        {sortBy === columnName && sortOrder === "ASC" ? (
          <i className="fa fa-sort-up"></i>
        ) : (
          ""
        )}
        {sortBy === columnName && sortOrder === "DESC" ? (
          <i className="fa fa-sort-down"></i>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  };
  return (
    <div className="row">
      <div className="col-12">
        <div className="row p-3 header">
          <div className="col-lg-3">
            <h4>
              <i className="fa fa-suitcase"></i>
              &nbsp; Products &nbsp;
              <span className="badge badge-secondary">{products.length}</span>
            </h4>
          </div>
        </div>

        <div className="col-lg-9">
          <input
            type="search"
            placeholder="Search"
            className="form-control"
            autoFocus="autofocus"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          ></input>
        </div>
      </div>

      <div className="col-lg-10 mx-auto mb-2">
        <div className="card my-2 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>{getColumnHeader("productName", "Product Name")}</th>
                  <th>{getColumnHeader("price", "Price")}</th>
                  <th>{getColumnHeader("brand", "Brand")}</th>
                  <th>{getColumnHeader("category", "Category")}</th>
                  <th>{getColumnHeader("rating", "Rating")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{product.brand.brandName}</td>
                      <td>{product.category.categoryName}</td>
                      <td>
                        {[...Array(product.rating).keys()].map((n) => (
                          <i className="fa fa-star text-warning" key={n}></i>
                        ))}
                        {[...Array(5 - product.rating).keys()].map((n) => (
                          <i className="fa fa-star-o text-warning" key={n}></i>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsList;

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import store from "../store";
import { removeFromCartAction } from "../actions";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect, forwardRef } from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Cart(props) {
  let [currentItem, setCurrentItem] = useState({});
  let [open, setOpen] = useState(false);

  let [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    severity: "",
    text: "",
  });

  let [totalPrice, setTotalPrice] = useState(0);

  const setPrice = () => {
    let sum = 0;
    store.getState().map((item) => {
      sum += item.price * item.qty;
    });
    setTotalPrice(sum);
  };

  useEffect(() => {
    setPrice();
  });

  const handleAddProductClick = () => {
    setOpenSnackbar({
      open: true,
      severity: "success",
      text: "Item added successfully",
    });
  };

  const handleRemoveProductClick = () => {
    setOpenSnackbar({
      open: true,
      severity: "warning",
      text: "Item removed successfully",
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const handleRemove = () => {
    setOpen(true);
  };

  const handleCloseRemoveDialog = (evt) => {
    if (evt.target.innerHTML === "Delete") {
      store.dispatch(removeFromCartAction(currentItem));
    }
    setOpen(false);
  };

  return (
    <div className="container">
      <div className="title">
        <h1 className="display-5">Cart Items</h1>
      </div>

      {store.getState().length === 0 && <p> Cart Is Empty </p>}

      {store.getState().length > 0 &&
        store.getState().map((item) => (
          <div key={item.id}>
            <div className="itemInCart">
              <img src={item.image} alt="" />
              <div className="desc">
                <p>{item.description}</p>
              </div>
              <div className="price">
                <p>
                  <strong>Price:</strong> {item.price * item.qty}$
                </p>
              </div>
              <div className="quantity">
                <p>
                  <strong>quantity:</strong> {item.qty}
                </p>
                <ButtonGroup>
                  <Button
                    onClick={() => {
                      if (item.qty === 1) {
                        item.qty = 1;
                      } else {
                        item.qty -= 1;
                        handleRemoveProductClick();
                      }
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Button
                    onClick={() => {
                      item.qty += 1;
                      handleAddProductClick();
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </ButtonGroup>

                <div>
                  <button
                    className="btn btn-danger"
                    onClick={(evt) => {
                      setCurrentItem(item);
                      handleRemove(evt);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      <div>
          Total price:<strong> {totalPrice}$</strong><br />
        
        <Link to={"/checkout"}>
          <button className="btn btn-success">Checkout</button>
        </Link>
      </div>

      <Dialog
        open={open}
        onClose={handleCloseRemoveDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog}>Cancel</Button>
          <Button onClick={handleCloseRemoveDialog} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar.open}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          open={openSnackbar.open}
          severity={openSnackbar.severity}
          sx={{ width: "100%" }}
        >
          {openSnackbar.text}
        </Alert>
      </Snackbar>
    </div>
  );
}

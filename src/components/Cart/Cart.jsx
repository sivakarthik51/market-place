import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Empty } from 'antd';
import CartItem from './CartItem/CartItem';
import { Link } from 'react-router-dom';
import useStyles from './styles.js';


const Cart = ({ cart , handleUpdateCartQuantity, handleRemoveFromCart, handleEmptyCart }) => {
    const isEmpty = !cart?.line_items?.length;
    const classes = useStyles();
    const EmptyCart = () => (
        <Empty description={
            <span>
              There are no items in the Cart. <Link className={classes.link} to="/">Start adding some!</Link>
            </span>
          }>
          </Empty>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} onUpdateCartQuantity={handleUpdateCartQuantity} onRemoveFromCart={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: {cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Checkout</Button>
                </div>
            </div>
        </>
    )

    return (
        <Container>
            <div className={classes.toolbar} />

            {!isEmpty?<Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>:<div className={classes.title}></div>}
            {isEmpty ? <EmptyCart /> : <FilledCart />}
            
        </Container>
    )
}

export default Cart

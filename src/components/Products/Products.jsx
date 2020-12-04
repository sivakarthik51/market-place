import React from 'react'
import {Grid} from '@material-ui/core';
import Product from './Product/Product';
import { Carousel } from 'antd';
import useStyles from './styles';

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    marginLeft:'2%',
    marginRight:'2%',
    marginBottom:'2%'
  };

const Products = ({ products, onAddToCart }) => {
    const classes = useStyles();
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Carousel autoplay>
                <div>
                    <h3 style={contentStyle}>Fresh</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>Safe</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>Trusted</h3>
                </div>
            </Carousel>
            <Grid container justify="center" spacing={4}>
                {products.map((product) => (
                    <Grid  key={product.id} item xs={12} sm={6} md={4} lg={3}>
                        <Product product={product} onAddToCart={onAddToCart}/>
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}

export default Products

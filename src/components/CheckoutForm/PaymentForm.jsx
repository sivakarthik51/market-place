import React from 'react';
import {Form , Button, Divider } from 'antd';
import {Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js'; 

import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken , backStep , onCaptureCheckout , shippingData, nextStep }) => {

    const handleSubmit = async (event,elements,stripe) => {
        event.preventDefault();

        if(!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const { error , paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

        if(error) {
            console.log(error);
        }
        else{
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: { firstname: shippingData.firstName, lastname:shippingData.lastName, email: shippingData.email },
                shipping: {name:'Primary', 
                    street:shippingData.address,town_city:shippingData.city,
                    county_state:shippingData.subdivision,
                    postal_zip_code:shippingData.zip,
                    country:shippingData.country
                },
                fulfillment: {shipping_method: shippingData.shippingOption},
                payment: {
                    gateway: 'stripe',
                    stripe:{
                      payment_method_id: paymentMethod.id  
                    }
                }
            };
            onCaptureCheckout(checkoutToken.id,orderData);
            nextStep();


        }
    }
    return (
        <>
            <Review checkoutToken={checkoutToken}/>
            <Divider orientation="left">Payment Method</Divider>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <form onSubmit={(e)=> handleSubmit(e,elements,stripe)}>
                            <CardElement />
                            <br /> <br />
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <Button danger onClick={backStep}>Back</Button>
                                <Form.Item>
                                <Button htmlType="submit" disabled={!stripe}>
                                    Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                                </Button>
                                </Form.Item>
                            </div>
                        </form>
                    )}
                </ElementsConsumer>
            </Elements>
            
        </>
    )
}

export default PaymentForm

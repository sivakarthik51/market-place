import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Button } from '@material-ui/core';
import { Typography as TypoAntD } from 'antd';
import { Result } from 'antd';
import { useHistory } from 'react-router-dom';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles.js';
import { commerce } from '../../../lib/commerce';
const steps = ['Shipping Address', 'Payment Details'];

const { Paragraph, Text } = TypoAntD;

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();
    const history = useHistory();

    const Form = () => activeStep === 0 ? <AddressForm next={next} checkoutToken={checkoutToken} /> : <PaymentForm checkoutToken={checkoutToken} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} />;

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                setCheckoutToken(token);
            } catch (error) {
                if (activeStep !== steps.length) history.push('/');
            }
        }

        generateToken();
    }, [cart]);

    const nextStep = () => setActiveStep((previousActiveStep) => previousActiveStep + 1);

    const backStep = () => setActiveStep((previousActiveStep) => previousActiveStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();

    }

    let Confirmation = () => order.customer ? (
        <Result
            status="success"
            title="Successfully Purchased"
            subTitle={`Thank you for Shopping with us, ${order.customer.firstname} ${order.customer.lastname}. Your Reference number is: ${order.customer_reference}`}
            extra={[
                <Button type="primary" href="/" key="buy">Buy Again</Button>
            ]}
        />
    ) : (
            <div className={classes.spinner}>
                <CircularProgress />
            </div>
        );

    if (error) {
        Confirmation = () => (
            <>
                <Result
                    status="error"
                    title="Payment Failed"
                    subTitle="Please check and modify the following information before resubmitting."
                    extra={[
                        <Button type="primary" key="cart" href="/cart">Go to Cart</Button>,
                        <Button key="buy" href="/">Buy Again</Button>,
                    ]}
                >
                    <div className="desc">
                        <Paragraph>
                            <Text
                                strong
                                style={{
                                    fontSize: 16,
                                }}>
                                The content you submitted has the following error:
                            </Text>
                        </Paragraph>
                        <Paragraph>
                            {error}
                        </Paragraph>
                    </div>
                </Result>
            </>
        );
    }

    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h5" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>

        </>
    )
}

export default Checkout

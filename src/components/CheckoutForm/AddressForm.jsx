import React, {useState,useEffect} from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import {commerce} from '../../lib/commerce';
//import { useForm, FormProvider } from 'react-hook-form';

const { TextArea } = Input;
const { Option } = Select;

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry,setshippingCountry] = useState('');
    const [shippingSubdivisions, setshippingSubdivisions] = useState([]);
    const [shippingSubdivision, setshippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);    

    const onCountryChange = (countryCode) => {
        setshippingCountry(countryCode);
        fetchSubdivisions(countryCode);
        //console.log(shippingSubdivisions);
    }
    const onSubdivisionChange = (subdivison) => {
        setshippingSubdivision(subdivison);
        fetchShippingOptions(checkoutToken.id,shippingCountry,shippingSubdivision)
    }

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        setShippingCountries(countries);
    }
    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
        setshippingSubdivisions(subdivisions);
        console.log(subdivisions);
    }

    const fetchShippingOptions = async (checkoutTokenId,country,region=null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId,{country, region });
        console.log(options);
        setShippingOptions(options);
        
    }
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    })
    const onFinish = values => {
        console.log('Received values of form: ', values);
        next(values);

    };
    return (
        <>

            <Form
                name="address"
                onFinish={onFinish}

            >
                <Form.Item>
                    <Input.Group size="large">
                        <Row>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="firstName"
                                    rules={[{ required: true, message: 'Please enter your First Name!' }]}
                                >
                                    <Input placeholder="First Name" />
                                </Form.Item>
                            </Col>

                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="lastName"
                                    rules={[{ required: true, message: 'Please enter your Last Name!' }]}
                                >
                                    <Input placeholder="Last Name" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>
                <Form.Item name="address">
                    <TextArea placeholder="Address" showCount maxLength={100} />
                </Form.Item>
                <Form.Item>
                    <Input.Group size="large">
                        <Row>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="city"

                                    rules={[
                                        { required: true, message: 'Please enter your City Name!' }
                                    ]}
                                >
                                    <Input placeholder="City" />
                                </Form.Item>
                            </Col>

                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="zip"
                                    rules={[{ required: true, message: 'Please enter your Zip Code!' }]}
                                >
                                    <Input placeholder="Zip Code" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>
                <Form.Item>
                    <Input.Group size="large">
                        <Row>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="country"
                                    
                                    rules={[
                                        { required: true, message: 'Please select your Country of shipping!' },

                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: '100%' }}
                                        onChange={onCountryChange}
                                        placeholder="Select Shipping Country"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {Object.entries(shippingCountries).map(([code,country]) => (
                                            <Option key={code} value={code}>{country}</Option>
                                        ))
                                            }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="subdivision"

                                    rules={[
                                        { required: true, message: 'Please select your Sub-Division!' },

                                    ]}
                                >
                                    <Select
                                        showSearch
                                        onChange={onSubdivisionChange}
                                        disabled={!Object.keys(shippingSubdivisions).length}
                                        style={{ width: '100%' }}
                                        placeholder="Select a Sub Division"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                       {Object.entries(shippingSubdivisions).map(([code,subdivision]) => (
                                            <Option key={code} value={code}>{subdivision}</Option>
                                        ))
                                            }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>
                <Form.Item
                    name="shippingOption"

                    rules={[
                        { required: true, message: 'Please select your Shipping Options!' },

                    ]}
                >
                    <Select
                        showSearch
                        disabled={!shippingOptions.length}
                        style={{ width: '100%' }}
                        placeholder="Select Shipping Options"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {shippingOptions.map(({id,description,price}) => (
                                            <Option key={id} value={id}>
                                                <span>{description}</span>
                                                <span style={{float:'right'}}>{price.formatted_with_symbol}</span>
                                            </Option>
                                        ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="email"

                    rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please enter your Email Address!' },

                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item>
                    <Button danger href="/cart" style={{ width: '49%' }}>
                        Back To Cart
                    </Button>
                    &nbsp;
                    <Button type="primary" htmlType="submit" style={{ width: '49%' }}>
                        Next
                    </Button>
                </Form.Item>
            </Form>

        </>
    )
}

export default AddressForm

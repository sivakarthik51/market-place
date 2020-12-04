import React from 'react';
import { List, Avatar , Statistic ,Divider} from 'antd';

const Review = ({checkoutToken}) => {
    const list = checkoutToken.live.line_items;
    console.log(list);
    return (
        <>
            <Divider orientation="left">Order Summary</Divider>
            <List
                itemLayout="horizontal"
                dataSource={list}
                renderItem={item => (
                    <List.Item>                 
                        <List.Item.Meta
                            avatar={
                                <Avatar src={item.media.source} />
                            }
                            title={item.name}
                            description={"Quantity:"+item.quantity}
                        />
                        <div>{item.price.formatted_with_symbol}</div>
                        
                    </List.Item>
                )}
            />
            <Statistic  title="Total" value={checkoutToken.live.subtotal.formatted_with_symbol} precision={2} />

        </>
    )
};

export default Review;
;
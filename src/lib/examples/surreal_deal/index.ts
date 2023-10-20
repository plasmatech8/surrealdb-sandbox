import surrealDeal from '$lib/examples/surreal_deal/surreal_deal_v1.surql?raw';

const starterCode = `
select
    *,
     ->order.* as orders,
     ->order->product.* as orders.products,
    (select *, product.* from review where person = $parent.id) as reviews
from person
limit 1;
`;

export const history = [surrealDeal];
export const editors = [starterCode];

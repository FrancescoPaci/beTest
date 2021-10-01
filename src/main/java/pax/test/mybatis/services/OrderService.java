package pax.test.mybatis.services;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pax.test.mybatis.custom.OrdersCustomMapper;
import pax.test.mybatis.mapper.OrdersDetailsMapper;
import pax.test.mybatis.mapper.OrdersMapper;
import pax.test.mybatis.mapper.ProductsMapper;
import pax.test.mybatis.mapper.ShippersMapper;
import pax.test.mybatis.model.*;
import pax.test.springJdbc.model.OrderDto;
import pax.test.springJdbc.model.OrderFilters;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrdersMapper ordersMapper;
    @Autowired
    private OrdersDetailsMapper ordersDetailsMapper;
    @Autowired
    private ProductsMapper productsMapper;
    @Autowired
    private ShippersMapper shippersMapper;
    @Autowired
    private OrdersCustomMapper ordersCustomMapper;

    public Long findCountOrders(OrderFilters filter){
        return ordersMapper.countByExample(createOrderExampleByFilter(filter));
    }

    public List<OrderDto> findOrdersByRange(OrderFilters filter) {
        List<Orders> orders = ordersMapper.selectByExampleWithRowbounds(createOrderExampleByFilter(filter), new RowBounds(filter.getStart(),10));
        List<OrderDto> ordersList = new ArrayList<>();
        for (Orders order: orders) {
            OrderDto orderDto = new OrderDto();
            orderDto.setOrder(order);

            orderDto.setShipper(shippersMapper.selectByPrimaryKey(order.getShipperId()));

            OrdersDetailsExample odExample = new OrdersDetailsExample();
            odExample.createCriteria().andOrderIdEqualTo(order.getId());
            List<OrdersDetails> odList = ordersDetailsMapper.selectByExample(odExample);

            for (OrdersDetails od: odList) {
                ProductsExample prodExample = new ProductsExample();
                prodExample.createCriteria().andIdEqualTo(od.getProductId());
                orderDto.setProducts(productsMapper.selectByExample(prodExample));
            }
            ordersList.add(orderDto);
        }
        return ordersList;
    }

    private OrdersExample createOrderExampleByFilter(OrderFilters filter){
        OrdersExample ordersExample = new OrdersExample();
        if(filter != null) {
            if (filter.getOrderDate() != null) {
                ordersExample.createCriteria().andOrderDateEqualTo(filter.getOrderDate());
            }
            if (filter.getShipCity() != null && filter.getShipCity().length() > 0) {
                ordersExample.createCriteria().andShipCityLike("%" + filter.getShipCity() + "%");
            }
            if (filter.getShipCountry() != null && filter.getShipCountry().length() > 0) {
                ordersExample.createCriteria().andShipCountryLike("%" + filter.getShipCountry() + "%");
            }
            if (filter.getShipAddress() != null && filter.getShipAddress().length() > 0) {
                ordersExample.createCriteria().andShipAddressLike("%" + filter.getShipAddress() + "%");
            }
            if (filter.getShipPostalCode() != null && filter.getShipPostalCode().length() > 0) {
                ordersExample.createCriteria().andShipPostalCodeLike("%" + filter.getShipPostalCode() + "%");
            }
        }
        return ordersExample;
    }

    public Orders getSingleOrder(int orderId) {
        return ordersMapper.selectByPrimaryKey(orderId);
    }

    public List<Products> getProductByOrder(Orders order) {
        OrdersDetailsExample odExample = new OrdersDetailsExample();
        odExample.createCriteria().andOrderIdEqualTo(order.getId());
        List<OrdersDetails> odList = ordersDetailsMapper.selectByExample(odExample);
        for (OrdersDetails od: odList) {
            ProductsExample prodExample = new ProductsExample();
            prodExample.createCriteria().andIdEqualTo(od.getProductId());
            return productsMapper.selectByExample(prodExample);
        }
        return null;
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateOrderAndProducts(OrderDto order){
        ordersMapper.updateByPrimaryKeySelective(order.getOrder());
        for (Products product: order.getProducts()) {
            productsMapper.updateByPrimaryKeySelective(product);
        }
    }

    public List<Shippers> getShippers(){
        return shippersMapper.selectByExample(null);
    }

    public List<String> selectColumnById() {
        return ordersCustomMapper.selectColumnById("ship_city", 1);
    }

    public List<String> selectDistinctByColumnFromXml() {
        return ordersCustomMapper.selectDistinctByColumnFromXml("ship_country");
    }

}

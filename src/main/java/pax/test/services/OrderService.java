package pax.test.services;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pax.test.model.Shippers;
import pax.test.model.*;
import pax.test.mybatis.mapper.OrdersDetailsMapper;
import pax.test.mybatis.mapper.OrdersMapper;
import pax.test.mybatis.mapper.ProductsMapper;
import pax.test.mybatis.mapper.ShippersMapper;
import pax.test.mybatis.model.*;
import pax.test.rowMapper.OrderRowMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private OrdersMapper ordersMapper;
    @Autowired
    private OrdersDetailsMapper ordersDetailsMapper;
    @Autowired
    private ProductsMapper productsMapper;
    @Autowired
    private ShippersMapper shippersMapper;

    public Long findCountOrders(){
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Orders", Long.class);
    }

    public Long findCountOrdersBe(OrderFilters filter){
        return ordersMapper.countByExample(createOrderExampleByFilter(filter));
    }

    public List<OrderDto> findOrdersByRangeBE(OrderFilters filter) {
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
        if(filter.getOrderDate() != null){
            ordersExample.createCriteria().andOrderDateEqualTo(filter.getOrderDate());
        }
        if(filter.getShipCity() != null && filter.getShipCity().length() > 0){
            ordersExample.createCriteria().andShipCityLike("%" + filter.getShipCity() + "%");
        }
        if(filter.getShipCountry() != null && filter.getShipCountry().length() > 0){
            ordersExample.createCriteria().andShipCountryLike("%" +filter.getShipCountry() + "%");
        }
        if(filter.getShipAddress() != null && filter.getShipAddress().length() > 0){
            ordersExample.createCriteria().andShipAddressLike(filter.getShipAddress() + "%");
        }
        if(filter.getShipPostalCode() != null && filter.getShipPostalCode().length() > 0){
            ordersExample.createCriteria().andShipPostalCodeLike(filter.getShipPostalCode() + "%");
        }
        if(filter.getShipper() != null && filter.getShipper().length() > 0){
            //ordersExample.or().andShipper(filter.getShipper());
            //whereClause += "\nAND shipperName LIKE '%"+filter.getShipper()+"%'";
        }
        return ordersExample;
    }

    public List<Order> findOrdersByRange(Integer start, Integer end) {
        return jdbcTemplate.query("SELECT * FROM (\n" +
                "SELECT o.id as OrderID, o.OrderDate, o.ShipCity, o.ShipCountry, o.ShipAddress, o.ShipPostalCode,\n" +
                "c.Name as CustomerName,s.name as shipperName,s.phone,s.id as ShipperID,\n" +
                "ROW_NUMBER() OVER (ORDER BY o.id) AS 'RowNumber'\n" +
                "FROM Orders o\n" +
                "INNER JOIN Customers c on o.CustomerID = c.id\n" +
                "INNER JOIN Shippers s on o.ShipperID = s.id\n" +
                ") as x WHERE RowNumber BETWEEN "+start+" AND " + end, new OrderRowMapper());
    }

    public List<Order> findOrdersByRangeByFilter(OrderFilters filter) {
        return jdbcTemplate.query("SELECT * FROM (\n" +
                        "SELECT o.id as OrderID, o.OrderDate, o.ShipCity, o.ShipCountry, o.ShipAddress, o.ShipPostalCode,\n" +
                        "c.Name as CustomerName,s.name as shipperName,s.phone,s.id as ShipperID,\n" +
                        "ROW_NUMBER() OVER (ORDER BY o.id) AS 'RowNumber'\n" +
                        "FROM Orders o\n" +
                        "INNER JOIN Customers c on o.CustomerID = c.id\n" +
                        "INNER JOIN Shippers s on o.ShipperID = s.id\n" +
                        ") as x WHERE RowNumber BETWEEN " + filter.getStart() + " AND " + filter.getEnd() + createWhere(filter),
                new OrderRowMapper());
    }

    private String createWhere(OrderFilters filter){
        String whereClause = "";
        if(filter.getOrderDate() != null){
            whereClause += "\nAND OrderDate = '"+ new java.sql.Date(filter.getOrderDate().getTime())+"'";
        }
        if(filter.getShipCity() != null && filter.getShipCity().length() > 0){
            whereClause += "\nAND ShipCity LIKE '%"+filter.getShipCity()+"%'";
        }
        if(filter.getShipCountry() != null && filter.getShipCountry().length() > 0){
            whereClause += "\nAND ShipCountry LIKE '%"+filter.getShipCountry()+"%'";
        }
        if(filter.getShipAddress() != null && filter.getShipAddress().length() > 0){
            whereClause += "\nAND ShipAddress LIKE '%"+filter.getShipAddress()+"%'";
        }
        if(filter.getShipPostalCode() != null && filter.getShipPostalCode().length() > 0){
            whereClause += "\nAND ShipPostalCode LIKE '%"+filter.getShipPostalCode()+"%'";
        }
        if(filter.getShipper() != null && filter.getShipper().length() > 0){
            whereClause += "\nAND shipperName LIKE '%"+filter.getShipper()+"%'";
        }
        return whereClause;
    }

    public Order getSingleOrder(long orderId) {
        return jdbcTemplate.queryForObject("SELECT o.id as OrderID, o.OrderDate, o. ShipCity, o.ShipCountry,\n" +
                "o.ShipAddress, o.ShipPostalCode, c.Name as CustomerName,s.name as shipperName, s.Phone, s.id as ShipperID,\n" +
                "ROW_NUMBER() OVER (ORDER BY o.id) AS 'RowNumber'\n" +
                "FROM Orders o\n" +
                "INNER JOIN Customers c on o.CustomerID = c.id\n" +
                "INNER JOIN Shippers s on o.ShipperId = s.id\n" +
                "WHERE o.id = " + orderId, new OrderRowMapper());
    }

    public List<Product> getProducts(long orderId){
        return jdbcTemplate.query("SELECT p.id, p.name, od.Quantity\n" +
                "FROM Orders_Details od\n" +
                "INNER JOIN Products p on od.ProductID = p.id\n" +
                "WHERE od.OrderID =" + orderId, (rs, rowNum) ->
                new Product(rs.getLong("id"),
                        rs.getString("name"),
                        rs.getInt("Quantity")));
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateOrderAndProducts(Order order) {
        updateOrder(order);
        updateProduct(order);
    }

    public void updateOrder(Order order){
        Object[] args = new Object[] {order.getOrderDate(), order.getShipCity(), order.getShipAddress(),
                order.getShipPostalCode(), order.getShipCountry(), order.getShipper().getId(), order.getId()};
        String query = "UPDATE Orders SET OrderDate = ?,ShipCity = ?,ShipAddress = ?,ShipPostalCode = ?,\n" +
                "ShipCountry = ?,ShipperId = ? WHERE id = ?";
        jdbcTemplate.update(query, args);
    }

    public void updateProduct(Order order){
        for (Product product: order.getProducts()) {
            Object[] args = new Object[] {product.getQuantity(), order.getId(), product.getId()};
            String query = "UPDATE Orders_Details SET Quantity = ?\n" +
                    "WHERE OrderID = ? AND ProductID = ?";
            jdbcTemplate.update(query, args);
            args = new Object[] {product.getName(), product.getId()};
            query = "UPDATE Products SET name = ? WHERE id = ?";
            jdbcTemplate.update(query, args);
        }
    }

    public List<Shippers> getShippers(){
        return jdbcTemplate.query("SELECT id, name, phone FROM Shippers", (rs, rowNum) ->
                new Shippers(rs.getLong("id"),
                        rs.getString("name"),
                        rs.getString("phone")));
    }

}

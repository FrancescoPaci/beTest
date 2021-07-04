package bedigitech.test.repository;

import bedigitech.test.model.Order;
import bedigitech.test.model.OrderFilters;
import bedigitech.test.model.Product;
import bedigitech.test.model.Shippers;
import bedigitech.test.rowMapper.OrderRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class OrderRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Long findCountOrders(){
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Orders", Long.class);
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
        if(filter.getCustomerName() != null && filter.getCustomerName().length() > 0){
            whereClause += "\nAND CustomerName LIKE '%"+filter.getCustomerName()+"%'";
        }
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

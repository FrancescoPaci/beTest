package bedigitech.test.repository;

import bedigitech.test.model.Order;
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
                "SELECT OrderID,OrderDate,ShipCity,ShipCountry,ShipAddress,ShipPostalCode,\n" +
                "e.LastName,e.FirstName,c.ContactName,s.CompanyName,s.Phone,s.ShipperID,\n" +
                "ROW_NUMBER() OVER (ORDER BY OrderID) AS 'RowNumber'\n" +
                "FROM Orders o\n" +
                "INNER JOIN Customers c on o.CustomerID = c.CustomerID\n" +
                "INNER JOIN Employees e on o.EmployeeID = e.EmployeeID\n" +
                "INNER JOIN Shippers s on o.ShipVia = s.ShipperID\n" +
                ") as x WHERE RowNumber BETWEEN "+start+" AND " + end, new OrderRowMapper());
    }

    public Order getSingleOrder(long orderId) {
        return jdbcTemplate.queryForObject("SELECT OrderID,OrderDate,ShipCity,ShipCountry,ShipAddress,ShipPostalCode,\n" +
                "e.LastName,e.FirstName,c.ContactName,s.CompanyName,s.Phone,s.ShipperID,\n" +
                "ROW_NUMBER() OVER (ORDER BY OrderID) AS 'RowNumber'\n" +
                "FROM Orders o\n" +
                "INNER JOIN Customers c on o.CustomerID = c.CustomerID\n" +
                "INNER JOIN Employees e on o.EmployeeID = e.EmployeeID\n" +
                "INNER JOIN Shippers s on o.ShipVia = s.ShipperID\n" +
                "WHERE OrderID = " + orderId, new OrderRowMapper());
    }

    public List<Product> getProducts(long orderId){
        return jdbcTemplate.query("SELECT p.ProductID,p.ProductName,od.Quantity\n" +
                "FROM [Order Details] od\n" +
                "INNER JOIN [Products] p on od.ProductID = p.ProductID\n" +
                "WHERE od.[OrderID] =" + orderId, (rs, rowNum) ->
                new Product(rs.getLong("ProductID"),
                        rs.getString("ProductName"),
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
                "ShipCountry = ?,ShipVia = ? WHERE OrderID = ?";
        jdbcTemplate.update(query, args);
    }

    public void updateProduct(Order order){
        for (Product product: order.getProducts()) {
            Object[] args = new Object[] {product.getQuantity(), order.getId(), product.getId()};
            String query = "UPDATE [Order Details] SET Quantity = ?\n" +
                    "WHERE OrderID = ? AND ProductID = ?";
            jdbcTemplate.update(query, args);
        }
    }

    public List<Shippers> getShippers(){
        return jdbcTemplate.query("SELECT ShipperID,CompanyName,Phone FROM Shippers", (rs, rowNum) ->
                new Shippers(rs.getLong("ShipperID"),
                        rs.getString("CompanyName"),
                        rs.getString("Phone")));
    }

}

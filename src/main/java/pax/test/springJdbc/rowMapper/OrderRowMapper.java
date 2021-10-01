package pax.test.springJdbc.rowMapper;

import org.springframework.jdbc.core.RowMapper;
import pax.test.springJdbc.model.Order;
import pax.test.springJdbc.model.Shippers;

import java.sql.ResultSet;
import java.sql.SQLException;

public class OrderRowMapper implements RowMapper<Order> {

    @Override
    public Order mapRow(ResultSet rs, int rowNum) throws SQLException {
        Order order = new Order();
        order.setId(rs.getLong("OrderID"));
        order.setCustomerName(rs.getString("CustomerName"));
        order.setOrderDate(rs.getDate("OrderDate"));
        order.setShipCity(rs.getString("ShipCity"));
        order.setShipCountry(rs.getString("ShipCountry"));
        order.setShipAddress(rs.getString("ShipAddress"));
        order.setShipPostalCode(rs.getString("ShipPostalCode"));
        Shippers shipper = new Shippers();
        shipper.setId(rs.getLong("ShipperID"));
        shipper.setName(rs.getString("shipperName"));
        shipper.setPhone(rs.getString("phone"));
        order.setShipper(shipper);
        return order;
    }
}

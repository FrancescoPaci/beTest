package bedigitech.test.rowMapper;

import bedigitech.test.model.Order;
import bedigitech.test.model.Shippers;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class OrderRowMapper implements RowMapper<Order> {

    @Override
    public Order mapRow(ResultSet rs, int rowNum) throws SQLException {
        Order order = new Order();
        order.setId(rs.getLong("OrderID"));
        order.setCustomerName(rs.getString("ContactName"));
        order.setEmployName(rs.getString("FirstName") + " " + rs.getString("LastName"));
        order.setOrderDate(rs.getDate("OrderDate"));
        order.setShipCity(rs.getString("ShipCity"));
        order.setShipCountry(rs.getString("ShipCountry"));
        order.setShipAddress(rs.getString("ShipAddress"));
        order.setShipPostalCode(rs.getString("ShipPostalCode"));
        Shippers shipper = new Shippers();
        shipper.setId(rs.getLong("ShipperID"));
        shipper.setCompanyName(rs.getString("CompanyName"));
        shipper.setPhone(rs.getString("Phone"));
        order.setShipper(shipper);
        return order;
    }
}

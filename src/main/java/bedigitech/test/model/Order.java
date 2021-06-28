package bedigitech.test.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    private long id;
    private String customerName;
    private Date orderDate;
    private String shipCity;
    private String shipCountry;
    private String shipAddress;
    private String shipPostalCode;
    private Shippers shipper;
    private List<Product> products;

}

package pax.test.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderFilters extends Pagination {

    private Date orderDate;
    private String shipCity;
    private String shipAddress;
    private String shipPostalCode;
    private String shipCountry;
    private String shipper;
}

package pax.test.springJdbc.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pax.test.mybatis.model.Orders;
import pax.test.mybatis.model.Products;
import pax.test.mybatis.model.Shippers;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private Orders order;
    private Shippers shipper;
    private List<Products> products;

}
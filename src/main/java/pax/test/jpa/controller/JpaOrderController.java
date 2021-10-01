package pax.test.jpa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import pax.test.jpa.model.JpaOrder;
import pax.test.jpa.model.JpaOrdersDetails;
import pax.test.jpa.model.JpaShipper;
import pax.test.jpa.services.JpaOrderService;
import pax.test.springJdbc.model.OrderFilters;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/jpa")
public class JpaOrderController {

    @Autowired
    JpaOrderService JpaOrderService;

    @PostMapping("/ordersByRange")
    public List<JpaOrder> findOrdersByRange(@RequestBody OrderFilters filter) {
        return JpaOrderService.findOrdersByRange(filter);
    }

    @PostMapping("/ordersCount")
    public Long findCountOrders(@RequestBody OrderFilters filter) {
        return JpaOrderService.findCountOrders(filter);
    }

    @GetMapping("/getShippers")
    public List<JpaShipper> getShippers() {
        return JpaOrderService.getShippers();
    }

    @PostMapping("/updateOrder")
    public void updateOrder(@RequestBody JpaOrder order) {
        JpaOrderService.updateOrderAndProducts(order);
    }


}

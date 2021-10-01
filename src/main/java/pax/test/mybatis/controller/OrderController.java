package pax.test.mybatis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pax.test.mybatis.model.Shippers;
import pax.test.mybatis.services.OrderService;
import pax.test.springJdbc.model.OrderDto;
import pax.test.springJdbc.model.OrderFilters;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/mybatis")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/ordersByRange")
    public List<OrderDto> findOrdersByRange(@RequestBody OrderFilters filter) {
        return orderService.findOrdersByRange(filter);
    }

    @PostMapping("/ordersCount")
    public Long findCountOrders(@RequestBody OrderFilters filter) {
        return orderService.findCountOrders(filter);
    }

    @GetMapping("/getShippers")
    public List<Shippers> getShippers() {
        return orderService.getShippers();
    }

    @PostMapping("/updateOrder")
    public void updateOrder(@RequestBody OrderDto orderDto) {
        orderService.updateOrderAndProducts(orderDto);
    }

    @GetMapping("/selectDistinct")
    public List<String> selectDistinct() {
        return orderService.selectDistinctByColumnFromXml();
    }

}

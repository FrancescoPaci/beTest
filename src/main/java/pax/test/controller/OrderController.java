package pax.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pax.test.model.OrderDto;
import pax.test.model.OrderFilters;
import pax.test.mybatis.model.Shippers;
import pax.test.services.OrderService;

import java.util.List;

@RestController
public class OrderController implements BasicController {

    @Autowired
    OrderService orderService;

    @PostMapping("/ordersByRangeBE")
    public List<OrderDto> findOrdersByRange(@RequestBody OrderFilters filter) {
        return orderService.findOrdersByRange(filter);
    }

    @PostMapping("/ordersCountBE")
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

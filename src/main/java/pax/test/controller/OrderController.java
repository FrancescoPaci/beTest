package pax.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pax.test.model.Order;
import pax.test.model.OrderDto;
import pax.test.model.OrderFilters;
import pax.test.model.Shippers;
import pax.test.services.OrderService;

import java.util.List;

@RestController
public class OrderController implements BasicController {

    @Autowired
    OrderService orderService;

    @GetMapping("/ordersByRange")
    public List<Order> findOrdersByRange(@RequestParam(value = "start") Integer start,
                                         @RequestParam(value = "end") Integer end) {
        List<Order> orders = orderService.findOrdersByRange(start, end);
        for (Order order: orders) {
            order.setProducts(orderService.getProducts(order.getId()));
        }
        return orders;
    }

    @PostMapping("/ordersByRangeBE")
    public List<OrderDto> findOrdersByRangeBE(@RequestBody OrderFilters filter) {
        return orderService.findOrdersByRangeBE(filter.getStart());
    }

    @PostMapping("/ordersByRangeByFilter")
    public List<Order> ordersByRangeByFilter(@RequestBody OrderFilters filter) {
        List<Order> orders = orderService.findOrdersByRangeByFilter(filter);
        for (Order order: orders) {
            order.setProducts(orderService.getProducts(order.getId()));
        }
        return orders;
    }

    @GetMapping("/ordersCount")
    public Long findCountOrders() {
        return orderService.findCountOrders();
    }

    @GetMapping("/getShippers")
    public List<Shippers> getShippers() {
        return orderService.getShippers();
    }

    @PostMapping("/updateOrder")
    public Order updateOrder(@RequestBody Order order) {
        orderService.updateOrderAndProducts(order);
        Order outputOrder = orderService.getSingleOrder(order.getId());
        outputOrder.setProducts(orderService.getProducts(order.getId()));
        return outputOrder;
    }

}

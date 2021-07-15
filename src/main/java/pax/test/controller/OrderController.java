package pax.test.controller;

import pax.test.model.Order;
import pax.test.model.OrderFilters;
import pax.test.model.Shippers;
import pax.test.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController implements BasicController {

    @Autowired
    OrderRepository orderRepository;

    @GetMapping("/ordersByRange")
    public List<Order> findOrdersByRange(@RequestParam(value = "start") Integer start,
                                         @RequestParam(value = "end") Integer end) {
        List<Order> orders = orderRepository.findOrdersByRange(start, end);
        for (Order order: orders) {
            order.setProducts(orderRepository.getProducts(order.getId()));
        }
        return orders;
    }

    @PostMapping("/ordersByRangeByFilter")
    public List<Order> ordersByRangeByFilter(@RequestBody OrderFilters filter) {
        List<Order> orders = orderRepository.findOrdersByRangeByFilter(filter);
        for (Order order: orders) {
            order.setProducts(orderRepository.getProducts(order.getId()));
        }
        return orders;
    }

    @GetMapping("/ordersCount")
    public Long findCountOrders() {
        return orderRepository.findCountOrders();
    }

    @GetMapping("/getShippers")
    public List<Shippers> getShippers() {
        return orderRepository.getShippers();
    }

    @PostMapping("/updateOrder")
    public Order updateOrder(@RequestBody Order order) {
        orderRepository.updateOrderAndProducts(order);
        Order outputOrder = orderRepository.getSingleOrder(order.getId());
        outputOrder.setProducts(orderRepository.getProducts(order.getId()));
        return outputOrder;
    }

}

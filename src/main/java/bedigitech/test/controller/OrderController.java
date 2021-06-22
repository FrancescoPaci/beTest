package bedigitech.test.controller;

import bedigitech.test.model.Order;
import bedigitech.test.model.Shippers;
import bedigitech.test.repository.OrderRepository;
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

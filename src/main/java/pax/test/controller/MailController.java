package pax.test.controller;

import pax.test.utils.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MailController implements BasicController {

    @Autowired
    private MailService mailService;

    @GetMapping("/sendMail")
    public void findOrdersByRange() {
        mailService.sendEmail();
    }
}

package bedigitech.test.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail() {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("f.paci82@gmail.com");
        msg.setSubject("Testing from Spring Boot");
        msg.setText("Hello World\nSpring Boot Email from Francesco PAci test APP");
        javaMailSender.send(msg);

    }
}

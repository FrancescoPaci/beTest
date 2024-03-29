package pax.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pax.test.springJdbc.repository.UserRepository;

import java.util.Collection;

@RestController
public class UserController implements BasicController  {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/login")
    public Collection<? extends GrantedAuthority> login(Authentication authentication) {
        return authentication.getAuthorities();
    }

    @GetMapping("/createAccount")
    public void insertUser(@RequestParam(value = "username") String user,
                           @RequestParam(value = "psw") String psw) {
        userRepository.insertUser(user, psw);
    }

}
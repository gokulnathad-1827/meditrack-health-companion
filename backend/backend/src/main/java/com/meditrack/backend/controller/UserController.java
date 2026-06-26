package com.meditrack.backend.controller;

import com.meditrack.backend.entity.User;
import com.meditrack.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return userService.registerUser(user);

    }

    @PostMapping("/login")
    public User login(@RequestBody java.util.Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return userService.loginUser(email, password);
    }

}
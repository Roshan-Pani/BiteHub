package com.bitehub.controller;

import com.bitehub.dto.UserResolveRequest;
import com.bitehub.dto.UserResponse;
import com.bitehub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getUserList());
    }

    @PostMapping("/resolve")
    public ResponseEntity<UserResponse> resolveUser(@Valid @RequestBody UserResolveRequest request) {
        return ResponseEntity.ok(userService.resolveUserIdentity(request));
    }
}

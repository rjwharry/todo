package com.practice.kotlin.controllers

import com.practice.kotlin.services.TodoService
import com.practice.kotlin.repositories.Todo
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/v1/todos")
class TodoController(private val todoService: TodoService) {
    @GetMapping("")
    fun getAllTodos(): List<Todo> {
        return todoService.getAllTodos()
    }

    @GetMapping("/{id}")
    fun getTodoById(@PathVariable(value = "id", required = true) id: Long): Todo {
        return todoService.getTodoById(id)
    }

    @PostMapping("")
    fun createTodo(@RequestBody body: Todo): Todo {
        return todoService.createTodo(body)
    }

    @PutMapping("/{id}")
    fun updateTodo(@PathVariable(name = "id", required = true) id: Long, @RequestBody body: Todo): Todo {
        return todoService.updateTodo(id, body)
    }

    @DeleteMapping("/{id}")
    fun deleteTodo(@PathVariable(name = "id", required = true) id: Long): Todo {
        return todoService.deleteTodo(id)
    }
}
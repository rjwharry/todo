package com.practice.kotlin.services

import com.practice.kotlin.repositories.Todo
import com.practice.kotlin.repositories.TodoRepository
import org.springframework.stereotype.Service

@Service
class TodoService(private val todoRepository: TodoRepository) {
    fun getAllTodos(): List<Todo> {
        return todoRepository.findAll()
    }

    fun getTodoById(id: Long): Todo {
        return todoRepository.findById(id).get()
    }

    fun createTodo(todo: Todo): Todo {
        return todoRepository.save(todo)
    }

    fun updateTodo(id: Long, updatedTodo: Todo): Todo {
        val todo = getTodoById(id)
        todo.name = updatedTodo.name
        todo.contents = updatedTodo.contents
        todo.status = updatedTodo.status
        return createTodo(todo)
    }

    fun deleteTodo(id: Long): Todo {
        val todo = getTodoById(id)
        todoRepository.deleteById(id)
        return todo
    }

}
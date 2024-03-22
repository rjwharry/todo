package com.practice.kotlin.services

import com.practice.kotlin.dto.TodoDto
import com.practice.kotlin.repositories.STATUS
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
		val lastTodo = getLastTodoByStatus(todo.status)
		val newTodo = todoRepository.save(todo)
		newTodo.prev = lastTodo?.id
		newTodo.next = null
		todoRepository.save(newTodo)
		lastTodo?.let {
			lastTodo.next = newTodo.id
			todoRepository.save(lastTodo)
		}
		return newTodo
	}

	fun updateTodo(id: Long, body: TodoDto): Todo {
		val todo = deleteFromLinkedList(id)
		val updatedTodo = insertToLinkedList(todo, body.prev, body.next)
		updatedTodo.name = body.todo.name
		updatedTodo.contents = body.todo.contents
		updatedTodo.status = body.todo.status
		return todoRepository.save(updatedTodo)
	}

	fun insertToLinkedList(todo: Todo, prev: Long?, next: Long?): Todo {
		if (prev == -1L || next == -1L) return todo
		val prevTodo = if (prev != null) getTodoById(prev) else null
		val nextTodo = if (next != null) getTodoById(next) else null
		todo.prev = prev
		todo.next = next
		prevTodo?.let {
			it.next = todo.id
			todoRepository.save(it)
		}
		nextTodo?.let {
			it.prev = todo.id
			todoRepository.save(it)
		}
		return todo
	}

	fun deleteTodo(id: Long): Todo {
		val todo = deleteFromLinkedList(id)
		todoRepository.deleteById(id)
		return todo
	}

	fun deleteFromLinkedList(id: Long): Todo {
		val todo = getTodoById(id)
		val prevTodo = if (todo.prev != null) getTodoById(todo.prev!!) else null
		val nextTodo = if (todo.next != null) getTodoById(todo.next!!) else null
		prevTodo?.let {
			it.next = nextTodo?.id
			todoRepository.save(it)
		}
		nextTodo?.let {
			it.prev = prevTodo?.id
			todoRepository.save(it)
		}
		return todo
	}

	fun getLastTodoByStatus(status: STATUS): Todo? {
		return todoRepository.findByStatusAndNextIsNull(status)
	}
}
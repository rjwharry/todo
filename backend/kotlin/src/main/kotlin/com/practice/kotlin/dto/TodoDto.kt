package com.practice.kotlin.dto

import com.practice.kotlin.repositories.Todo

data class TodoDto (
	val todo: Todo,
	val prev: Long?,
	val next: Long?,
)
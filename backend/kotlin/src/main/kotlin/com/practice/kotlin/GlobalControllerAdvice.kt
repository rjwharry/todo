package com.practice.kotlin

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

class ExceptionDto(
    var status: Int? = null,
    var message: String? = null
)

@RestControllerAdvice
class GlobalControllerAdvice {

    @ExceptionHandler
    fun handleNoSuchElementException(ex: NoSuchElementException): ResponseEntity<ExceptionDto> {
        val errorDto = ExceptionDto(
            HttpStatus.NOT_FOUND.value(),
            ex.message
        )
        return ResponseEntity(errorDto, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler
    fun handleRuntimeException(ex: RuntimeException): ResponseEntity<ExceptionDto> {
        val errorDto = ExceptionDto(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            ex.message
        )
        return ResponseEntity(errorDto, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
package com.practice.kotlin.repositories

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime


enum class STATUS {
    TODO, DOING, DONE
}
@Entity
class Todo(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    @Column(unique = true, nullable = false)
    var name: String,
    @Column(nullable = true)
    var contents: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: STATUS = STATUS.TODO,
    @Column(nullable = false)
//    @CreationTimestamp
    var createdAt: LocalDateTime = LocalDateTime.now(),
)
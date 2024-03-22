# Todo Backend
Todo Application 서버 프로젝트입니다.
# Tech
- Spring Boot
- Kotlin
- Spring Data JPA
- Mysql
# API
| Name          | PATH               | Method | Body                | Response | Description |
|---------------|--------------------|--------|---------------------|------|-------------|
| Get All Todos | /api/v1/todos      | GET    |                     | List\<Todo> | 모든 Todo 가져오기 |
| Get Todo      | /api/v1/todos/{id} | GET    |                     | Todo | 특정 Todo 가져오기 |
| Create Todo   | /api/v1/todos      | POST   | [Todo](#todo)       | Todo | Todo 생성하기   |
| Modify Todo   | /api/v1/todos      | PUT    | [TodoDto](#tododto) | Todo | Todo 수정하기   |
| Delete Todo   | /api/v1/todos/{id} | DELETE |                     | Todo | Todo 삭제하기   |

# Data
## Todo
- [ERD Cloud](https://www.erdcloud.com/d/PRiJgq4EaaJqqe7kF)   

| Name      | Type          | Description |
|-----------|---------------|-------------|
| id        | Long          | todo id     |
| name      | String        | todo 이름     |
| contents  | String        | todo 내용     |
| status    | String        | todo 상태     |
| prev      | Long          | 이전 todo id  |
| next      | Long          | 다음 todo id  |
| createdAt | LocalDateTime | todo 생성일자   |

## TodoDto
| Name      | Type          | Description |
|-----------|---------------|-------------|
| todo      | [Todo](#todo) | 업데이트된 todo  |
| prev      | Long          | 이전 todo id  |
| next      | Long          | 다음 todo id  |

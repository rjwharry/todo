# Todo Backend
Todo Application 서버 프로젝트입니다.
# Tech
- Spring Boot
- Kotlin
- JPA
- Mysql
# API
| Name          | PATH               | Method | Body | Response | Description |
|---------------|--------------------|--------|------|------|-------------|
| Get All Todos | /api/v1/todos      | GET    |      | List\<Todo> | 모든 Todo 가져오기 |
| Get Todo      | /api/v1/todos/{id} | GET    |      | Todo | 특정 Todo 가져오기 |
| Create Todo   | /api/v1/todos      | POST   | Todo | Todo | Todo 생성하기   |
| Modify Todo   | /api/v1/todos      | PUT    | Todo | Todo | Todo 수정하기   |
| Delete Todo   | /api/v1/todos/{id} | DELETE | | Todo | Todo 삭제하기   |

# Data
## [Todo](https://www.erdcloud.com/d/PRiJgq4EaaJqqe7kF)   

| Name | Type | Description |
| --- | --- | --- |
| id | Long | todo id|
| name | String | todo 이름|
| contents | String | todo 내용 |
| status | String | todo 상태 |
| createdAt | LocalDateTime | todo 생성일자|
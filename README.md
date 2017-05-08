# API Design

## Operations

| CRUD   | HTTP METHOD | MONGODB |
| :---:  | :---:       | :---:   |
| CREATE | POST        | INSERT  |
| READ   | GET         | FIND    |
| UPDATE | PUT         | UPDATE  |
| DELETE | DELETE      | DELETE  |

## Objects and Routes

### User

* register a user (create) `POST /register`
* log in `POST /log in`
* log out `GET /logout`
* forget password
* view a user's profile (read) `GET /profile`
* update a user's profile
* delete a user's account

### Question
* create, read, update, delete

### Quiz
* create, read, update, delete

### Score
* answer a question (create)
* update
* delete

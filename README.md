# Node.js Server API Documentation

<img src="/images/node-js.png" height="100" width="125">

## User Routes

#### POST `/login`

Validate a user's credentials.

**Request**

| parameter   | type     |
| :---:       | :---:    |
| `email`     | _string_ |
| `password`  | _string_ |

**Response**

`200 OK` Valid credentials:

```javascript
{
  "message": "Login successful.",
  "user": {
    id: _number_,
    email: _string_,
    username: _string_
  }
}
```

`401 Unauthorized` Invalid credentials.

---

#### POST `/register`

Register a new user.

**Request**

| parameter   | type     | required    |  unique |
| :---:       | :---:    | :---:       | :---:   |
| `email`     | _string_ | `true`      | `true`  |
| `password`  | _string_ | `true`      | `false` |
| `username`  | _string_ | `true`      | `true`  |
| `firstName` | _string_ | `false`     | `false` |
| `lastName`  | _string_ | `false`     | `false` |
| `avatarUrl` | _string_ | `false`     | `false` |

**Response**

`200 OK` Valid credentials:

```javascript
{
  "message": "User successfully created.",
  "user": {
    id: _number_,
    email: _string_,
    username: _string_,
    firstName: _string_,
    lastName: _string_,
    avatarUrl: _string_,
    createdAt: _date_
  }
}
```
`400 Bad Request` Missing required fields.

---

#### GET `/profile`

View a user's profile.

**Request**

No parameters

**Response**

`200 OK` Valid credentials:

| parameter   | type     |
| :---:       | :---:    |
| `email`     | _string_ |
| `username`  | _string_ |
| `firstName` | _string_ |
| `lastName`  | _string_ |
| `avatarUrl` | _string_ |

`401 Unauthorized` You must be logged in to view this content.

---

#### GET `/logout`

Log out a user.

**Response**

`200 OK` Logout successful:

```javascript
{
  "message": "Logout successful."
}
```

---

## TODO
* forget password
* update a user's profile
* delete a user's account

### Question
* read

### Quiz
* read

### Score
* answer a question (create)
* update
* delete

## Operations

| CRUD   | HTTP METHOD | MONGODB |
| :---:  | :---:       | :---:   |
| CREATE | POST        | INSERT  |
| READ   | GET         | FIND    |
| UPDATE | PUT         | UPDATE  |
| DELETE | DELETE      | REMOVE  |


## Test User
```javascript
{
  "email": "charlantfr@gmail.com",
  "password": "Soshag29"
}
```

# User Routes

[Home](../README.md)

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

```javascript
{
  "user": {
    email: _string_,
    username: _string_,
    firstName: _string_,
    lastName: _string_,
    avatarUrl: _string_
  }
}
```
`401 Unauthorized` You must be logged in to view this content.

---

#### PUT `/profile`

Update a user's profile.

**Request**
```javascript
{
  email: _string_,
  password: _string_,
  username: _string_,
  firstName: _string_,
  lastName: _string_,
  avatarUrl: _string_
}
```

**Response**

`200 OK`:

```javascript
{
  "message": "User sucessfully updated.",
  "user": {
    email: _string_,
    username: _string_,
    firstName: _string_,
    lastName: _string_,
    avatarUrl: _string_,
  }
}
```
`401 Unauthorized` Invalid credentials.

---

#### DELETE `/profile`

Delete a user's account.

**Response**

`200 OK`:

```javascript
{
  "message": "User sucessfully deleted.",
  "result": {
    "n": 1,
    "ok": 1
  }
}
```
`401 Unauthorized` Invalid credentials.

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
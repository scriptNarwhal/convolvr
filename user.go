package convolvr

import (
	"net/http"
	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
	"github.com/asdine/storm/q"
)

type User struct {
	ID       int    `storm:"id,increment" json:"id"`
	Name     string `storm:"index,unique" json:"name"`
	Password string `json:"Password"`
	Email    string `storm:"unique" json:"email"`
	Data     string `json:"data"`
}

func NewUser(id int, name string, password string, email string, data string) *User {
	return &User{id, name, password, email, data}
}

func getUsers(c echo.Context) error {
	var users []User
	err := db.All(&users)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, &users)
}

func postUsers(c echo.Context) (err error) {
	var (
		user *User
		foundUser User
		authUsersFound []User
	)
	user = new(User)
	if err := c.Bind(user); err != nil {
    return err
  }
	dbErr := db.One("Name", user.Name, &foundUser)
  if dbErr != nil { // if user doesn't exist
    log.Println(dbErr)
		dbErr := db.Save(user)
		if dbErr != nil {
			log.Println(dbErr)
			return dbErr
		}
		return c.JSON(http.StatusOK, &user)
	} else {
		lookupErr := db.Select(q.And(
			q.Eq("Name", user.Name),
			q.Eq("Password", user.Password),
		)).Find(&authUsersFound)
		if lookupErr != nil {
			log.Println(lookupErr)
		}
		if len(authUsersFound) == 0 {
			return c.JSON(http.StatusOK, nil)
		} else {
			return c.JSON(http.StatusOK, &authUsersFound[0]) // valid login
		}
	}
}

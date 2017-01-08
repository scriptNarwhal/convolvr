package convolvr

type User struct {
	ID       int    `storm:"id,increment" json:"id"`
	Name     string `storm:"index" json:"name"`
	Password string `json:"Password"`
	Email    string `storm:"unique" json:"email"`
	Data     string `json:"data"`
}

func NewUser(id int, name string, password string, email string, data string) *User {
	return &User{id, name, password, email, data}
}

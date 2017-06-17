package convolvr

import (
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type Component struct {
	ID         int                    `storm:"id,increment" json:"id"`
	Name       string                 `json:"name"`
	Position   []float64              `json:"position"`
	Quaternion []float64              `json:"quaternion",omitempty`
	Props      map[string]interface{} `json:"props"`
	State      map[string]interface{} `json:"state"`
	Components []*Component           `json:"components"`
	Tags       []string               `json:"tags",omitempty`
}

func NewComponent(name string, pos []float64, quat []float64, props map[string]interface{}, state map[string]interface{}, components []*Component, tags []string) *Component {
	return &Component{Name: name, Position: pos, Quaternion: quat, Props: props, State: state, Components: components, Tags: tags}
}

func getComponents(c echo.Context) error { // component types
	var components []Component
	err := db.All(&components)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, components)
}

func postComponents(c echo.Context) error {
	var (
		component *Component
	)
	component = new(Component)
	if err := c.Bind(&component); err != nil {
		return err
	}
	dbErr := db.Save(&component)
	if dbErr != nil {
		log.Println(dbErr)
		return dbErr
	}
	return c.JSON(http.StatusOK, nil)
}

package convolvr

import (
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type Component struct {
	ID         int                    `storm:"id,increment" json:"id"`
	Name       string                 `json:"name"`
	Shape      string                 `json:"shape"`
	Material   string                 `json:"material"`
	Color      int                    `json:"color"`
	Size       []float64              `json:"size"`
	Position   []float64              `json:"position"`
	Quaternion []float64              `json:"quaternion"`
	Props      map[string]interface{} `json:"props"`
}

func NewComponent(name string, shape string, mat string, color int, size []float64, pos []float64, quat []float64, props map[string]interface{}) *Component {
	return &Component{Name: name, Shape: shape, Material: mat, Color: color, Size: size, Position: pos, Quaternion: quat, Props: props}
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

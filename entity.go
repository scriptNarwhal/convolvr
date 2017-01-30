package convolvr

import (
	"net/http"
	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type Entity struct {
	ID         int          `storm:"id,increment" json:"id"`
	Name       string       `storm:"index" json:"name"`
	World      string       `json:"world"`
	Components []*Component `storm:"inline" json:"components"`
	Aspects    []string     `json:"aspects"`
	Position   []float64    `json:"position"`
	Quaternion []float64    `json:"quaternion"`
	TranslateZ float64      `json:"translateZ"`
}

func NewEntity(id int, name string, world string, components []*Component, aspects []string, pos []float64, quat []float64, z float64) *Entity {
	return &Entity{id, name, world, components, aspects, pos, quat, z}
}

func getEntities(c echo.Context) error { // entity types
	var entities []Entity
	err := db.All(&entities)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, entities)
}

func postEntities(c echo.Context) error {
	var (
		entity *Entity
	)
	entity = new(Entity)
	if err := c.Bind(&entity); err != nil {
		return err
	}
	dbErr := db.Save(&entity)
	if dbErr != nil {
		log.Println(dbErr)
		return dbErr
	}
	return c.JSON(http.StatusOK, nil)
}

func getEntitiesByUser(c echo.Context) error { // custom entities
	return c.JSON(http.StatusOK, nil)
}

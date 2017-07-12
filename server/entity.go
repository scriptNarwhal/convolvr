package convolvr

import (
	"net/http"
	"strings"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type Entity struct {
	ID             int          `storm:"id,increment" json:"id"`
	Name           string       `storm:"index" json:"name"`
	World          string       `json:"world"`
	Components     []*Component `storm:"inline" json:"components"`
	Position       []float64    `json:"position"`
	Quaternion     []float64    `json:"quaternion",omitempty`
	BoundingRadius float64      `json:"boundingRadius",omitempty`
	Tags           []string     `json:"tags",omitempty`
}

func NewEntity(id int, name string, world string, components []*Component, pos []float64, quat []float64, boundingRadius float64, tags []string) *Entity {

	if id == -1 {

		return &Entity{Name: name, World: world, Components: components, Position: pos, Quaternion: quat, BoundingRadius: boundingRadius, Tags: tags}

	} else {

		return &Entity{ID: id, Name: name, World: world, Components: components, Position: pos, Quaternion: quat, BoundingRadius: boundingRadius, Tags: tags}

	}

}

func getEntities(c echo.Context) error { // entities from and for everyone
	var entities []Entity
	err := db.All(&entities)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, entities)
}

func postEntities(c echo.Context) error { // save entity publicly / server-wide
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

func getEntitiesByUser(c echo.Context) error { // entities from someone, for everyone
	return c.JSON(http.StatusOK, nil)
}

func importAsEntityToWorld(c echo.Context) error {
	var (
		entity *Entity
	)
	coordStr := c.Param("coords")
	world := c.Param("worldName")
	coords := strings.Split(coordStr, "x")
	voxels := db.From("World_" + world)
	voxel := voxels.From("X_" + coords[0]).From("Y_" + coords[1]).From("Z_" + coords[2])
	voxelEntities := voxel.From("entities")

	entity = new(Entity)
	if err := c.Bind(&entity); err != nil {
		return err
	}
	dbErr := voxelEntities.Save(&entity)
	if dbErr != nil {
		log.Println(dbErr)
		return dbErr
	}
	return c.JSON(http.StatusOK, nil)
}

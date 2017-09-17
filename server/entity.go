package convolvr

import (
	"net/http"
	"strings"
	core "github.com/Convolvr/core"
	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

func getEntities(c echo.Context) error { // entities from and for everyone
	var entities []core.Entity
	err := db.All(&entities)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, entities)
}

func postEntities(c echo.Context) error { // save entity publicly / server-wide
	var (
		entity *core.Entity
	)
	entity = new(core.Entity)
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
		entity *core.Entity
	)
	coordStr := c.Param("coords")
	world := c.Param("worldName")
	coords := strings.Split(coordStr, "x")
	voxels := db.From("World_" + world)
	voxel := voxels.From("X_" + coords[0]).From("Y_" + coords[1]).From("Z_" + coords[2])
	voxelEntities := voxel.From("entities")

	entity = new(core.Entity)
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

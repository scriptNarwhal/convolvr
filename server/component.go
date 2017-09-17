package convolvr

import (
	"net/http"
	"github.com/Convolvr/core"
	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

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

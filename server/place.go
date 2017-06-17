package convolvr

import (
	"net/http"
	"strconv"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type Place struct {
	ID       int                    `storm:"id,increment" json:"id"`
	UserID   int                    `storm:"id,index" json:"userId"`
	UserName string                 `storm:"id,index" json:"userName"`
	Name     string                 `storm:"index" json:"name"`
	World    string                 `storm:"id" json:"world`
	Config   map[string]interface{} `json:"config"`
	X        int                    `json:"x"`
	Y        int                    `json:"y"`
	Z        int                    `json:"z"`
	Tags     []string               `json:"tags",omitempty`
}

func NewPlace(id int, userId int, userName string, name string, world string, config map[string]interface{}, x int, y int, z int, tags []string) *Place {
	return &Place{id, userId, userName, name, world, config, x, y, z, tags}
}

func getPlaces(c echo.Context) error {
	var Places []Place
	err := db.All(&Places)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, &Places)
}

func getUserPlaces(c echo.Context) error {
	var Places []Place
	userId, _ := strconv.Atoi(c.Param("userId"))
	err := db.Find("UserID", userId, &Places)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, &Places)
}

func postPlaces(c echo.Context) error {
	var (
		place *Place
	)
	place = new(Place)
	if err := c.Bind(place); err != nil {
		return err
	}
	err := db.Save(place)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, nil)
}

func getPlace(c echo.Context) error { // load specific Place

	return c.JSON(http.StatusOK, nil)
}

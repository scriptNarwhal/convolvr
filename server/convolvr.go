package convolvr

import (
	"fmt"
	"html/template"
	"io"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/asdine/storm"
	"github.com/ds0nt/nexus"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/spf13/viper"
)

var (
	hub *nexus.Nexus
	db  *storm.DB
)

// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	// Add global methods if data is a map
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	return t.templates.ExecuteTemplate(w, name, data)
}

func Start(configName string) {
	viper.SetConfigName(configName)        // name of config file (without extension)
	viper.AddConfigPath("$HOME/.convolvr") // call multiple times to add many search paths
	viper.AddConfigPath(".")               // optionally look for config in the working directory
	err := viper.ReadInConfig()            // Find and read the config file
	if err != nil {                        // Handle errors reading the config file
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}
	port := fmt.Sprintf(":%d", viper.GetInt("host.port"))

	e := echo.New()
	e.Use(middleware.CORS())
	hub = nexus.NewNexus()
	db, err = storm.Open(viper.GetString("datastore.spark.db"))
	defer db.Close()
	if err != nil {
		log.Fatal(err)
	}
	userErr := db.Init(&User{})
	worldErr := db.Init(&World{})
	placeErr := db.Init(&Place{})
	chunkErr := db.Init(&Voxel{})
	componentErr := db.Init(&Component{})
	entityErr := db.Init(&Entity{})
	chatHistory := db.From("chathistory")
	historyErr := chatHistory.Init(&ChatMessage{})
	// indexErr := db.ReIndex(&World{})
	// if indexErr != nil {
	// log.Fatal(indexErr)
	// }
	if userErr != nil {
		log.Fatal(userErr)
	}
	if worldErr != nil {
		log.Fatal(worldErr)
	}
	if worldErr != nil {
		log.Fatal(placeErr)
	}
	if chunkErr != nil {
		log.Fatal(chunkErr)
	}
	if componentErr != nil {
		log.Fatal(componentErr)
	}
	if entityErr != nil {
		log.Fatal(entityErr)
	}
	if historyErr != nil {
		log.Fatal(historyErr)
	}

	api := e.Group("/api")
	api.GET("/users", getUsers)
	api.POST("/users", postUsers)
	api.GET("/users/:userId/inventories", listAllInventories)
	api.GET("/users/:userId/inventory/:inventoryId", getUserInventory)
	api.POST("/users/:userId/inventory/:inventoryId", saveItemToInventory)
	api.POST("/users/:userId/inventory/:inventoryId", removeItemFromInventory)
	api.POST("/import-as-entity/:userName/:worldName/:coords", importAsEntityToWorld)
	api.GET("/chat-history/:skip", getChatHistory)
	api.GET("/worlds", getWorlds)
	api.GET("/worlds/user/:userId", getUserWorlds)
	api.GET("/worlds/name/:name", getWorld)
	api.GET("/chunks/:worldId/:chunks", getWorldChunks)
	api.POST("/worlds", postWorlds)
	api.GET("/universe-settings", getUniverseSettings)
	api.POST("/universe-settings", postUniverseSettings)
	api.GET("/entities", getEntities)
	api.POST("/entities", postEntities)
	api.GET("/entities/:userId", getEntitiesByUser)
	api.GET("/components", getComponents)
	api.POST("/components", postComponents)
	api.GET("/files/list/:username", listFiles)
	api.GET("/files/list/:username", listFiles)
	api.GET("/files/download/:username/:filename", getFiles)
	api.POST("/files/upload/:username", postFiles)
	api.POST("/files/upload-multiple/:username", postMultipleFiles)
	api.GET("/directories/list/:username", getDirectories)
	api.POST("/directories/:username", postDirectories)
	api.GET("/documents/:username/:filename", getText)
	api.POST("/documents/:username/:filename", postText)

	e.Static("/data", "../web")
	e.File("/", "../web/index.html")

	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("*.html")),
	}
	e.Renderer = renderer

	// Named route "foobar"
	var handleWorld = func(c echo.Context) error {
		var (
			world       World
			name        string
			description string
			icon        string
			themeColor  string
		)
		description = "Auto Generated World"
		icon = "/data/images/convolvr2.png"
		themeColor = "#151515"
		name = c.Param("worldName")
		err := db.One("Name", name, &world)
		if err == nil {
			description = world.Description

		}
		return c.Render(http.StatusOK, "world.html", map[string]interface{}{
			"name":        name,
			"description": description,
			"icon":        icon,
			"themeColor":  themeColor,
		})
	}
	e.GET("/:userName/:worldName", handleWorld).Name = "user-world"             // fairly simple, readable url structure
	e.GET("/:userName/:worldName/at/:coords", handleWorld).Name = "world-voxel" // linking to individual voxels
	e.GET("/:userName/:worldName/:placeName", handleWorld).Name = "world-place" // linking to named places
	// e.File("/:userName/:worldName", "../web/index.html")
	// e.File("/:userName/:worldName/at/:coords", "../web/index.html")
	// e.File("/:userName/:worldName/:placeName", "../web/index.html")

	e.File("/network", "../web/index.html") // client should generate a meta-world out of (portals to) networked convolvr (or other webvr) sites
	e.File("/worlds", "../web/index.html")  // this one also needs its 2d ui replaced with something nicer
	e.File("/places", "../web/index.html")
	e.File("/new-world", "../web/index.html")
	e.File("/chat", "../web/index.html")
	e.File("/files", "../web/index.html")
	e.File("/login", "../web/index.html")
	e.File("/settings", "../web/index.html")

	hub.Handle("chat message", chatMessage)
	hub.Handle("update", update)
	hub.Handle("tool action", toolAction)
	e.Any("/connect", echo.WrapHandler(http.HandlerFunc(hub.Handler)))
	e.Logger.Fatal(e.Start(port))
}

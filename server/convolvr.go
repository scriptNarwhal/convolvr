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
	hub        *nexus.Nexus
	db         *storm.DB
	logActions bool
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
	logActions = viper.GetBool("logging.actions")

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

	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("*.html")),
	}
	e.Renderer = renderer

	e.GET("/:settings", handleWorld).Name = "settings"
	e.GET("/:network", handleWorld).Name = "settings"
	e.GET("/:worlds", handleWorld).Name = "settings"
	e.GET("/:places", handleWorld).Name = "settings"
	e.GET("/:new-world", handleWorld).Name = "settings"
	e.GET("/:chat", handleWorld).Name = "settings"
	e.GET("/:files", handleWorld).Name = "settings"
	e.GET("/:login", handleWorld).Name = "settings"
	e.GET("/:import", handleWorld).Name = "settings"
	e.GET("/:settings", handleWorld).Name = "settings"

	e.GET("/:userName/:worldName", handleWorld).Name = "user-world"             // fairly simple, readable url structure
	e.GET("/:userName/:worldName/at/:coords", handleWorld).Name = "world-voxel" // linking to individual voxels
	e.GET("/:userName/:worldName/:placeName", handleWorld).Name = "world-place" // linking to named places

	hub.Handle("chat message", chatMessage)
	hub.Handle("update", update)
	hub.Handle("tool action", toolAction)
	e.Any("/connect", echo.WrapHandler(http.HandlerFunc(hub.Handler)))
	e.GET("/", handleWorld).Name = "default-world"

	e.Logger.Fatal(e.Start(port))

}

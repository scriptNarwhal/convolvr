package convolvr

import (
	"net/http"
	"strconv"
	"time"

	log "github.com/Sirupsen/logrus"
	"github.com/asdine/storm"
	"github.com/ds0nt/nexus"
	"github.com/labstack/echo"
)

type ChatMessage struct {
	ID      int    `storm:"id,increment" json:"id"`
	Date    string `json:"date"`
	World   string `json:"world"`
	Message string `json:"message"`
}

func chatMessage(c *nexus.Client, p *nexus.Packet) {
	log.Printf(`chat message "%s"`, p.Data)
	hub.All().Broadcast(p)
	t := time.Now()
	record := ChatMessage{Date: t.Format(time.RFC3339), Message: p.Data, World: ""}
	history := db.From("chathistory")
	saveErr := history.Save(&record)
	if saveErr != nil {
		log.Println(saveErr)
	}
}

func getChatHistory(c echo.Context) error { // load specific world
	var chatMessages []ChatMessage
	history := db.From("chathistory")
	skip, skipErr := strconv.Atoi(c.Param("skip"))
	if skipErr != nil {
		log.Println(skipErr)
	}
	err := history.All(&chatMessages, storm.Limit(64), storm.Skip(skip))
	if err != nil {
		log.Fatal(err)
	}
	return c.JSON(http.StatusOK, &chatMessages)
}

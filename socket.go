package convolvr

import (
	"encoding/json"
  log "github.com/Sirupsen/logrus"
  "github.com/asdine/storm/q"
	"github.com/ds0nt/nexus"
)

func chatMessage(c *nexus.Client, p *nexus.Packet) {
	log.Printf(`chat message "%s"`, p.Data)
	hub.All().Broadcast(p)
}
func update(c *nexus.Client, p *nexus.Packet) {
	// log.Printf(`broadcasting update "%s"`, p.Data)./
	hub.All().Broadcast(p)
}
func toolAction(c *nexus.Client, p *nexus.Packet) {
	var (
		action ToolAction
		chunkData []Chunk
		entities []*Entity
		entity Entity
	)
	if err := json.Unmarshal([]byte(p.Data), &action); err != nil {
			 panic(err)
	}
	getChunkErr := db.Select(q.And(
		q.Eq("X", action.Coords[0]),
		q.Eq("Y", action.Coords[1]),
		q.Eq("Z", action.Coords[2]),
		q.Eq("World", action.World),
	)).Find(&chunkData)
	if getChunkErr != nil {
		log.Println(getChunkErr)
	}
	nChunks := len(chunkData)
	if (nChunks > 0) {
		if action.Tool == "Entity Tool" || action.Tool == "Structure Tool" {
					if action.Tool == "Entity Tool" {
						entities = chunkData[0].Entities
						if (len(entities) < 48) {
							entity = *NewEntity("", action.World, action.Entity.Components, action.Entity.Aspects, action.Position, action.Quaternion, action.Entity.TranslateZ)
							//entity = Entity{Name: "", World: action.World, Components: action.Entity.Components, Position: action.Position, Quaternion: action.Quaternion, TranslateZ: action.Entity.TranslateZ }
							entities = append(entities, &entity)
							chunkData[0].Entities = entities
							saveErr := db.Update(&chunkData[0])
							if saveErr != nil {
								log.Println(saveErr)
							}
						} else {
							log.Println("Too Many Entities:")
							log.Printf(`world: "%s"`, action.World)
							log.Printf(`x: "%s"`, action.Coords[0])
							log.Printf(`z: "%s"`, action.Coords[2])
						}
					} else { // structure tool
						// implement adding structure
					}
					log.Printf(`tool action: "%s"`, action.Tool)    // modify chunk where this tool was used...
			}
		if action.Tool == "Component Tool" || action.Tool == "Voxel Tool" {
					if action.Tool == "Component Tool" {
						entities = chunkData[0].Entities
							newComps := []*Component{}
							for _, v := range action.Components {
								newComp := *NewComponent(v.Name, v.Shape, v.Material, v.Color, v.Size, v.Position, v.Quaternion, v.ComponentType)
								newComps = append(newComps, &newComp)
							}
							for _, v := range entities {
								if v.ID == action.EntityId {
									v.Components = append(v.Components, newComps...)
								}
							}
							chunkData[0].Entities = entities
							saveErr := db.Update(&chunkData[0])
							if saveErr != nil {
								log.Println(saveErr)
							}
					} else { // voxel tool
						// implement adding voxel
					}
					log.Printf(`tool action: "%s"`, action.Tool)    // modify chunk where this tool was used...
			}
	}
	hub.All().Broadcast(p)
}

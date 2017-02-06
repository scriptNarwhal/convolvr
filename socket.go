package convolvr

import (
	"strconv"
	"encoding/json"
  log "github.com/Sirupsen/logrus"
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
		//chunkData []Chunk
		entity Entity
	)
	if err := json.Unmarshal([]byte(p.Data), &action); err != nil {
			 panic(err)
	}
	x := strconv.Itoa(action.Coords[0])
	y := strconv.Itoa(action.Coords[1])
	z := strconv.Itoa(action.Coords[2])
	voxel := db.From("World_"+action.World).From("X_"+x).From("Y_"+y).From("Z_"+z)
	voxelEntities := voxel.From("entities")
	if action.Tool == "Entity Tool" || action.Tool == "Structure Tool" {
			if action.Tool == "Entity Tool" {
					entity = *NewEntity("", action.World, action.Entity.Components, action.Entity.Aspects, action.Position, action.Quaternion, action.Entity.TranslateZ)
					saveErr := voxelEntities.Save(&entity)
					if saveErr != nil {
						log.Println(saveErr)
					}
			} else { // structure tool
				// implement adding structure
			}
			log.Printf(`tool action: "%s"`, action.Tool)    // modify chunk where this tool was used...
		}
		if action.Tool == "Component Tool" || action.Tool == "Voxel Tool" {
				if action.Tool == "Component Tool" {
					readErr := voxelEntities.One("ID", action.EntityId, &entity)
					if readErr == nil {
						newComps := []*Component{}
						for _, v := range action.Components {
							if v.Position == nil {
								v.Position = action.Position
								v.Position[0] -= entity.Position[0]
								v.Position[1] -= entity.Position[1]
								v.Position[2] -= entity.Position[2]
							}
							if v.Quaternion == nil {
								v.Quaternion = action.Quaternion
							}
							newComp := *NewComponent(v.Name, v.Shape, v.Material, v.Color, v.Size, v.Position, v.Quaternion, v.ComponentType)
							newComps = append(newComps, &newComp)
						}
						entity.Components = append(entity.Components, newComps...)
						saveErr := voxelEntities.Save(&entity)
						if saveErr != nil {
							log.Println(saveErr)
						}
					} else {
						log.Println(readErr)
					}
				} else { // voxel tool
					// implement adding voxel
				}
				log.Printf(`tool action: "%s"`, action.Tool)    // modify chunk where this tool was used...
		}
	hub.All().Broadcast(p)
}

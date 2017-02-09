package convolvr

import (
	"encoding/json"
	"strconv"

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
		entity    Entity
		entityOut []byte
	)
	if err := json.Unmarshal([]byte(p.Data), &action); err != nil {
		panic(err)
	}
	x := strconv.Itoa(action.Coords[0])
	y := strconv.Itoa(action.Coords[1])
	z := strconv.Itoa(action.Coords[2])
	voxel := db.From("World_" + action.World).From("X_" + x).From("Y_" + y).From("Z_" + z)
	voxelEntities := voxel.From("entities")
	if action.Tool == "Entity Tool" || action.Tool == "Structure Tool" {
		if action.Tool == "Entity Tool" {
			entity = *NewEntity("", action.World, action.Entity.Components, action.Entity.Aspects, action.Position, action.Quaternion)
			saveErr := voxelEntities.Save(&entity)
			if saveErr != nil {
				log.Println(saveErr)
			}
			action.EntityId = entity.ID
			action.Entity.ID = entity.ID
			log.Println(entity.ID)
			entityOut, _ = json.Marshal(action)
			p.Data = string(entityOut[:])
		} else { // structure tool
			// implement
		}
		log.Printf(`tool action: "%s"`, action.Tool) // modify chunk where this tool was used...
	}
	if action.Tool == "Component Tool" || action.Tool == "Voxel Tool" {
		if action.Tool == "Component Tool" {
			readErr := voxelEntities.One("ID", action.EntityId, &entity)
			if readErr == nil {
				//pos := action.Position
				newComps := []*Component{}
				for _, v := range action.Components {
					if v.Quaternion == nil {
						v.Quaternion = action.Quaternion
					}
					newComp := *NewComponent(v.Name, v.Shape, v.Material, v.Color, v.Size, []float64{v.Position[0], v.Position[1], v.Position[2]}, v.Quaternion, v.ComponentType)
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
			// implement
		}
		log.Printf(`tool action: "%s"`, action.Tool) // modify chunk where this tool was used...
	}
	hub.All().Broadcast(p)
}

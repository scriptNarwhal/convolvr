package convolvr

import (
	"encoding/json"
	"strconv"

	log "github.com/Sirupsen/logrus"
	"github.com/ds0nt/nexus"
)

func update(c *nexus.Client, p *nexus.Packet) { // broadcast user telemetry to all users

	// log.Printf(`broadcasting update "%s"`, p.Data) uncomment for wall of text
	hub.All().Broadcast(p)
}

func toolAction(c *nexus.Client, p *nexus.Packet) { // 📎💬 it looks like you're trying to change the world

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

	if action.Tool == "Entity Tool" { // creating an entity

		if action.Tool == "Entity Tool" {

			if len(action.Entity.Components) == 0 {
				log.Println("Can't save entity with 0 components")
			} else {
				entity = *NewEntity(-1, "", action.World, action.Entity.Components, action.Position, action.Quaternion, action.Entity.BoundingRadius, nil)
				saveErr := voxelEntities.Save(&entity)
				if saveErr != nil {
					log.Println(saveErr)
				}
				action.EntityID = entity.ID
				action.Entity.ID = entity.ID
				log.Println(entity.ID)
				entityOut, _ = json.Marshal(action)
				p.Data = string(entityOut[:])
			}

		}
		log.Printf(`tool action: "%s"`, action.Tool) // modify chunk where this tool was used...

	} else { // doing something with an entity

		readErr := voxelEntities.One("ID", action.EntityID, &entity)

		if readErr == nil {

			if action.Tool == "Component Tool" {

				if len(entity.Components) < 48 { // will increase this limit once re-initialization uses more caching || magic, client-side

					newComps := []*Component{}
					for _, v := range action.Components {
						if len(v.Position) > 0 {

							newComp := *NewComponent(v.Name, []float64{v.Position[0], v.Position[1], v.Position[2]}, v.Quaternion, v.Props, v.State, v.Components, nil)
							newComps = append(newComps, &newComp)

						}

					}

					entity.Components = append(entity.Components, newComps...)
				}

			} else if action.Tool == "System Tool" || action.Tool == "Geometry Tool" || action.Tool == "Material Tool" || action.Tool == "Asset Tool" {

				// implement
				//for _, v in range entity.Components {

				// check ComponentPath

				//}
				log.Printf(`tool action: "%s"`, action.Tool)

			} else if action.Tool == "World Tool" || action.Tool == "Place Tool" {

				// implement / notifying users of which world / place was created / switched to,
				// trigger creating world / saving it

			} else if action.Tool == "File Tool" || action.Tool == "Directory Tool" {

				// implement

			} else if action.Tool == "Delete Tool" {

				deleteErr := voxelEntities.DeleteStruct(&entity)
				if deleteErr != nil {
					log.Println(deleteErr)
				}

			}

			saveErr := voxelEntities.Save(&entity)

			if saveErr != nil {
				log.Println(saveErr)
			}

		} else {
			log.Println(readErr)
		}

	}

	hub.All().Broadcast(p)
}

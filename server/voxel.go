package convolvr

import (
	"math"
	"net/http"
	"strconv"
	"strings"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type Voxel struct {
	ID       int       `storm:"id,increment" json:"id"`
	X        int       `storm:"index" json:"x"`
	Y        int       `storm:"index" json:"y"`
	Z        int       `storm:"index" json:"z"`
	Altitude float32   `json:"altitude"`
	World    string    `storm:"id" json:"world"`
	Name     string    `json:"name"`
	Entities []*Entity `json:"entities"`
}

func NewVoxel(id int, x int, y int, z int, alt float32, world string, name string, entities []*Entity) *Voxel {
	return &Voxel{id, x, y, z, alt, world, name, entities}
}

func getWorldChunks(c echo.Context) error {
	var (
		worldData      World
		generatedChunk Voxel
		chunksData     []Voxel
		foundChunks    []Voxel
		entities       []*Entity
	)
	generatedBuildings := 0
	chunk := c.Param("chunks")
	world := c.Param("worldId")
	chunks := strings.Split(chunk, ",")
	worldErr := db.One("Name", world, &worldData)
	if worldErr != nil {
		log.Println(worldErr)
	}
	voxels := db.From("World_" + world)

	for _, v := range chunks {

		coords := strings.Split(v, "x")
		x, _ := strconv.Atoi(coords[0])
		y, _ := strconv.Atoi(coords[1])
		z, _ := strconv.Atoi(coords[2])
		voxel := voxels.From("X_" + coords[0]).From("Y_" + coords[1]).From("Z_" + coords[2])
		voxelEntities := voxel.From("entities")
		voxel.All(&foundChunks)

		if len(foundChunks) == 0 {

			entities = nil
			altitude := float32(0)
			flatArea := worldData.Terrain.FlatAreas == true && math.Sin(2+float64(x)/9.0)+math.Cos(2+float64(z)/9.0) > 0.62

			if worldData.Terrain.TerrainType == "voxels" || worldData.Terrain.TerrainType == "both" {

				if flatArea == false {

					if worldData.Terrain.Turbulent {

						altitude = float32((math.Sin(float64(x)/2)*9+float64((x%5)-(z%5))+math.Cos(float64(z)/2)*9)/worldData.Terrain.Flatness) * 200000.0

					} else {

						altitude = float32((math.Sin(float64(x)/2)*9+math.Cos(float64(z)/2)*9)/worldData.Terrain.Flatness) * 200000.0

					}

				}

			}

			// create terrain as entity.. the 1st entity, or ideally, one with the largeset bounding radius should have higher LOD priority
			entities = append(entities, generateTerrain(world, x, y, z, altitude, flatArea, worldData.Terrain.Color, "default"))

			initErr := voxelEntities.Init(&Entity{})
			if initErr != nil {
				log.Println(initErr)
			}

			// Spawn useful entities, if desired

			if worldData.Spawn.NPCS {

				if canPlaceNPCAt(x, 0, z) {
					entities = append(entities, generateNPC(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Trees {

				if canPlaceTreeAt(x, 0, z) {
					entities = append(entities, generateTree(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Structures {

				if canPlaceStructureAt(x, 0, z) {
					entities = append(entities, generateBuilding(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Roads {

				if canPlaceRoadAt(x, 0, z) {
					entities = append(entities, generateRoad(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Walls {

				if canPlaceWallAt(x, 0, z) {
					entities = append(entities, generateWall(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Vehicles {

				if canPlaceVehicleAt(x, 0, z) {
					entities = append(entities, generateVehicle(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Tools {

				if canPlaceToolAt(x, 0, z) {
					entities = append(entities, generateTool(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}
			if worldData.Spawn.Pylons {

				if canPlacePylonAt(x, 0, z) {
					entities = append(entities, generatePylon(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}
			// Spawn entities resembling mental imagery:

			if worldData.Spawn.Blocks {

				if canPlaceBlockAt(x, 0, z) {
					entities = append(entities, generateBlock(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Orbs {

				if canPlaceOrbAt(x, 0, z) {
					entities = append(entities, generateOrb(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Columns {

				if canPlaceColumnAt(x, 0, z) {
					entities = append(entities, generateColumn(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Wheels {

				if canPlaceWheelAt(x, 0, z) {
					entities = append(entities, generateWheel(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Pyramids {

				if canPlacePyramidAt(x, 0, z) {
					entities = append(entities, generatePyramid(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Nets {

				if canPlaceNetAt(x, 0, z) {
					entities = append(entities, generateNet(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Curtains {

				if canPlaceCurtainAt(x, 0, z) {
					entities = append(entities, generateCurtain(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			for _, g := range entities {

				saveEntitiesError := voxelEntities.Save(g)
				if saveEntitiesError != nil {
					log.Println(saveEntitiesError)
				}

			}

			generatedChunk = *NewVoxel(0, x, y, z, altitude, world, "", entities)
			saveErr := voxel.Save(&generatedChunk)
			chunksData = append(chunksData, generatedChunk)

			if saveErr != nil {
				log.Println(saveErr)
			}

		} else {

			voxelEntities.All(&entities)
			foundChunks[0].Entities = entities
			chunksData = append(chunksData, foundChunks[0])

		}

	}
	return c.JSON(http.StatusOK, &chunksData)
}

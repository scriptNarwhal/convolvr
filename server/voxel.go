package convolvr

import (
	"math"
	"net/http"
	"strconv"
	"strings"
	core "github.com/Convolvr/core"
	gen "github.com/Convolvr/generate"
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
	Entities []*core.Entity `json:"entities"`
}

func NewVoxel(id int, x int, y int, z int, alt float32, world string, name string, entities []*core.Entity) *Voxel {
	return &Voxel{id, x, y, z, alt, world, name, entities}
}

func getWorldChunks(c echo.Context) error {
	var (
		worldData      World
		generatedChunk Voxel
		chunksData     []Voxel
		foundChunks    []Voxel
		entities       []*core.Entity
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
			entities = append(entities, gen.GenerateTerrain(world, x, y, z, altitude, flatArea, worldData.Terrain.Color, "default"))

			initErr := voxelEntities.Init(&core.Entity{})
			if initErr != nil {
				log.Println(initErr)
			}

			// Spawn useful entities, if desired

			if worldData.Spawn.NPCS {

				if gen.CanPlaceNPCAt(x, 0, z) {
					entities = append(entities, gen.GenerateNPC(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Trees {

				if gen.CanPlaceTreeAt(x, 0, z) {
					entities = append(entities, gen.GenerateTree(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Structures {

				if gen.CanPlaceStructureAt(x, 0, z) {
					entities = append(entities, gen.GenerateBuilding(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Roads {

				if gen.CanPlaceRoadAt(x, 0, z) {
					entities = append(entities, gen.GenerateRoad(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Walls {

				if gen.CanPlaceWallAt(x, 0, z) {
					entities = append(entities, gen.GenerateWall(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Vehicles {

				if gen.CanPlaceVehicleAt(x, 0, z) {
					entities = append(entities, gen.GenerateVehicle(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Tools {

				if gen.CanPlaceToolAt(x, 0, z) {
					entities = append(entities, gen.GenerateTool(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}
			if worldData.Spawn.Pylons {

				if gen.CanPlacePylonAt(x, 0, z) {
					entities = append(entities, gen.GeneratePylon(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}
			// Spawn entities resembling mental imagery:

			if worldData.Spawn.Blocks {

				if gen.CanPlaceBlockAt(x, 0, z) {
					entities = append(entities, gen.GenerateBlock(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Orbs {

				if gen.CanPlaceOrbAt(x, 0, z) {
					entities = append(entities, gen.GenerateOrb(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Columns {

				if gen.CanPlaceColumnAt(x, 0, z) {
					entities = append(entities, gen.GenerateColumn(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Wheels {

				if gen.CanPlaceWheelAt(x, 0, z) {
					entities = append(entities, gen.GenerateWheel(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Pyramids {

				if gen.CanPlacePyramidAt(x, 0, z) {
					entities = append(entities, gen.GeneratePyramid(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Nets {

				if gen.CanPlaceNetAt(x, 0, z) {
					entities = append(entities, gen.GenerateNet(generatedBuildings+1, world, x, z, altitude))
					generatedBuildings++
				}

			}

			if worldData.Spawn.Curtains {

				if gen.CanPlaceCurtainAt(x, 0, z) {
					entities = append(entities, gen.GenerateCurtain(generatedBuildings+1, world, x, z, altitude))
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

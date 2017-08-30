package convolvr

import (
	"math"
)

func generateNPC(id int, world string, x int, z int, altitude float32) *Entity {
	var (
		structure           *Entity
		structureComponents []*Component
	)
	npcs := 1
	width := 2.8
	structureSize := 14000.0

	npcPos := []float64{0.0, 0.0, 0.0}
	npcQuat := []float64{0.0, 0.0, 0.0, 0.0}
	npcProps := make(map[string]interface{})
	npcGeometry := make(map[string]interface{})
	npcMaterial := make(map[string]interface{})
	npcProps["npc"] = map[string]string{
		"name": "Testerson",
	}
	npcGeometry["size"] = []float64{structureSize, structureSize * 1.7, structureSize}
	npcGeometry["shape"] = "box"
	npcGeometry["merge"] = true
	npcMaterial["name"] = "metal"
	npcMaterial["color"] = 0xf0f0f0
	npcProps["geometry"] = npcGeometry
	npcProps["material"] = npcMaterial
	wallState := make(map[string]interface{})
	structureComponents = append(structureComponents, NewComponent("", npcPos, npcQuat, npcProps, wallState, []*Component{}, nil))

	structurePos := []float64{(float64(x) * 928000.0), float64(altitude) - 80000, float64(z) * 807360.0} //  + (structureSize * width)
	structureRadius := math.Sqrt(math.Pow(width, 2) + math.Pow(float64(npcs)*structureSize*0.5, 2))
	structure = NewEntity(id+1, "Convolvr Bot 0"+string(id+1), world, []int{x, 0, z}, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, structureRadius, nil)
	return structure
}

func canPlaceNPCAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 4)))
	//zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if (int(math.Abs(float64(x%30))) < 8) && (int(math.Abs(float64(z%30))) < 8) {

		if xOffset == 0 {

			placeStructure = true

		}

	}

	return placeStructure

}

package convolvr

import (
	"math"
	"math/rand"
)

func generateTree(id int, world string, x int, z int, altitude float32) *Entity {

	var (
		structure           *Entity
		structureComponents []*Component
	)

	floors := 1
	width := 2.8
	structureSize := 150000.0

	treePos := []float64{0.0, 70000.0, 0.0}
	treeQuat := []float64{0.0, 0.0, 0.0, 0.0}
	treeProps := make(map[string]interface{})
	treeGeom := make(map[string]interface{})
	treeMat := make(map[string]interface{})
	treeState := make(map[string]interface{})
	treeGeom["size"] = []float64{structureSize, structureSize, structureSize}
	treeGeom["shape"] = "sphere"
	treeGeom["merge"] = true
	treeMat["name"] = "terrain"
	treeMat["color"] = 0x20ff00
	treeProps["geometry"] = treeGeom
	treeProps["material"] = treeMat
	structureComponents = append(structureComponents, NewComponent("", treePos, treeQuat, treeProps, treeState, []*Component{}, nil))

	trunkPos := []float64{0.0, -50000.0, 0.0}
	trunkQuat := []float64{0.0, 0.0, 0.0, 0.0}
	trunkProps := make(map[string]interface{})
	trunkGeom := make(map[string]interface{})
	trunkMat := make(map[string]interface{})
	trunkState := make(map[string]interface{})
	trunkGeom["size"] = []float64{structureSize / 8, structureSize, structureSize / 8}
	trunkGeom["shape"] = "box"
	trunkGeom["merge"] = true
	trunkMat["name"] = "terrain"
	trunkMat["color"] = 0x803010
	trunkProps["geometry"] = trunkGeom
	trunkProps["material"] = trunkMat
	structureComponents = append(structureComponents, NewComponent("", trunkPos, trunkQuat, trunkProps, trunkState, []*Component{}, nil))

	structurePos := []float64{(float64(x) * 928000.0) + rand.Float64()*30000, float64(altitude) + 26000, float64(z)*807360.0 + rand.Float64()*30000} //  + (structureSize * width)
	structureRadius := math.Sqrt(math.Pow(width, 2) + math.Pow(float64(floors)*structureSize*0.5, 2))
	structure = NewEntity(id+1, "Generated Tree", world, []int{x, 0, z}, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, structureRadius, nil)

	return structure

}

func canPlaceTreeAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 4)))
	//zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if (int(math.Abs(float64(x%30))) < 16) && (int(math.Abs(float64(z%30))) < 16) {

		if xOffset == 0 {

			placeStructure = true

		}

	}

	return placeStructure

}

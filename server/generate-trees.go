package convolvr

import (
	"math"
	"math/rand"
)

func generateTree(id int, world string, x int, z int, altitude float32) *Entity {

	var (
		structure  *Entity
		components []*Component
	)

	floors := 1
	width := 2.8
	structureSize := 150000.0
	components = makeBranches(0)

	structurePos := []float64{(float64(x) * 928000.0) + rand.Float64()*30000, float64(altitude) + 26000, float64(z)*807360.0 + rand.Float64()*30000} //  + (structureSize * width)
	structureRadius := math.Sqrt(math.Pow(width, 2) + math.Pow(float64(floors)*structureSize*0.5, 2))
	structure = NewEntity(id+1, "Tree", world, []int{x, 0, z}, components, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, structureRadius, nil)

	return structure

}

func makeBranches(d int) []*Component {

	var (
		structureComponents []*Component
		subComponents       []*Component
	)

	subComponents = []*Component{}
	structureSize := 150000.0

	if d < 3 {

		d += 1
		subComponents = makeBranches(d)

	}

	treePos := []float64{0.0, 70000.0, 0.0}
	treeQuat := []float64{0.0, 0.0, 0.0, 0.0}

	if d > 1 {
		treeQuat = []float64{0.49999999999999994, 0.0, 0.0, 0.8660254037844387}
		treePos = []float64{0.0, 0, 150000.0}
		structureSize = 250000.0 / float64(d+1)
	}

	treeProps := make(map[string]interface{})
	treeGeom := make(map[string]interface{})
	treeMat := make(map[string]interface{})
	treeState := make(map[string]interface{})
	treeGeom["size"] = []float64{structureSize, structureSize, structureSize}
	treeGeom["shape"] = "sphere"
	treeGeom["merge"] = true
	treeMat["name"] = "organic"
	treeMat["color"] = 0x20ff00
	treeProps["geometry"] = treeGeom
	treeProps["material"] = treeMat
	structureComponents = append(structureComponents, NewComponent("", treePos, treeQuat, treeProps, treeState, subComponents, nil))

	trunkPos := []float64{0.0, -50000.0, 0.0}
	trunkProps := make(map[string]interface{})
	trunkGeom := make(map[string]interface{})
	trunkMat := make(map[string]interface{})
	trunkState := make(map[string]interface{})
	trunkGeom["size"] = []float64{structureSize / 8, structureSize * 2.0, structureSize / 8}
	trunkGeom["shape"] = "box"
	trunkGeom["merge"] = true
	trunkMat["name"] = "organic"
	trunkMat["color"] = 0x803010
	trunkProps["geometry"] = trunkGeom
	trunkProps["material"] = trunkMat
	structureComponents = append(structureComponents, NewComponent("", trunkPos, treeQuat, trunkProps, trunkState, []*Component{}, nil))

	return structureComponents

}

func canPlaceTreeAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 4)))
	//zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if (int(math.Abs(float64(x%30))) < 7) || (int(math.Abs(float64(z%30))) < 12) {

		if xOffset == 0 {

			placeStructure = true

		}

	}

	return placeStructure

}

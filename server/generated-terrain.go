package convolvr

func generateTerrain(world string, x int, y int, z int, altitude float32, color int, terrainType string) *Entity {

	var (
		components []*Component
	)

	compPos := []float64{0.0, 0.0, 0.0}
	quat := []float64{0.0, 0.0, 0.0, 1.0}
	props := make(map[string]interface{})
	geometry := make(map[string]interface{})
	material := make(map[string]interface{})
	props["terrain"] = map[string]string{
		"type": terrainType + "rough",
	}
	geometry["size"] = []float64{536000, 536000, 835664}
	geometry["shape"] = "hexagon"
	geometry["faceNormals"] = false
	material["name"] = "terrain"
	material["color"] = color
	props["geometry"] = geometry
	props["material"] = material
	state := make(map[string]interface{})
	components = append(components, NewComponent("Terrain", compPos, quat, props, state, []*Component{}, nil))

	xOffset := float64(1-(z%2)) * (928000 / 2)
	pos := []float64{(float64(x) * 928000.0) + xOffset, -524000 + float64(altitude) + 10000, float64(z) * 806360.0} //  + (structureSize * width)

	return NewEntity(0, "Terrain", world, components, pos, []float64{0.0, 0.0, 0.0, 0.0}, 537000.0, nil)

}

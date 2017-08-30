package convolvr

func colorConvert(hexValue int) (int, int) {

	r := ((hexValue >> 16) & 0xFF) // Extract the RR byte
	b := ((hexValue) & 0xFF)       // Extract the GG byte

	return r, b
}

func generateTerrain(world string, x int, y int, z int, altitude float32, flatArea bool, color int, terrainType string) *Entity {

	var (
		components []*Component
		r          int
		b          int
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
	r, b = colorConvert(color)
	if flatArea {
		if b > r {
			material["name"] = "terrain2"
		} else {
			color = 0xffffff
			material["name"] = "terrain4"
		}
	} else {
		if b > r {
			material["name"] = "terrain"
		} else {
			material["name"] = "terrain3"
		}
	}

	material["color"] = color
	props["geometry"] = geometry
	props["material"] = material
	state := make(map[string]interface{})
	components = append(components, NewComponent("Terrain", compPos, quat, props, state, []*Component{}, nil))

	xOffset := float64(1-(z%2)) * (928000 / 2)
	pos := []float64{(float64(x) * 928000.0) + xOffset, -524000 + float64(altitude) + 10000, 524000 + float64(z)*806360.0} //  + (structureSize * width)

	return NewEntity(0, "Terrain", world, []int{x, 0, z}, components, pos, []float64{0.0, 0.0, 0.0, 0.0}, 537000.0, nil)

}

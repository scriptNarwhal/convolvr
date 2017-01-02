package convolvr

type Entity struct {
	ID         int          `storm:"id,increment" json:"id"`
	Name       string       `storm:"index" json:"name"`
	World      string       `json:"world"`
	Components []*Component `storm:"inline" json:"components"`
	Position   []int        `json:"position"`
	Quaternion []float64     `json:"quaternion"`
	TranslateZ float64      `json:"translateZ"`
}

func NewEntity(id int, name string, world string, components []*Component, pos []int, quat []float64, z float64) *Entity {
	return &Entity{id, name, world, components, pos, quat, z}
}
